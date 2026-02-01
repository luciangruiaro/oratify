"""
WebSocket API Endpoint

Handles real-time communication for live presentation sessions.

Endpoint: /ws/session/{join_code}

Connection Flow:
1. Client connects to /ws/session/{join_code}
2. Client sends 'join' or 'join_speaker' message
3. Server validates and adds to session
4. Server sends 'session_state' message
5. Server broadcasts 'participant_joined' to others
6. Bidirectional messages until disconnect

Message handling is based on message 'type' field.
"""

import json
import logging
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_websocket
from app.core.security import decode_token
from app.core.websocket import Connection, ConnectionRole, connection_manager
from app.models import Participant
from app.schemas.websocket import (
    WSMessageType,
    create_error_message,
    create_session_state_message,
    create_slide_info,
    ParticipantJoinedMessage,
    ParticipantLeftMessage,
    ResponseReceivedMessage,
    PongMessage,
)
from app.services import session as session_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["websocket"])


async def get_session_for_websocket(db: AsyncSession, join_code: str):
    """Get session by join code for WebSocket connection."""
    return await session_service.get_session_by_join_code(db, join_code)


async def create_participant(
    db: AsyncSession,
    session_id: uuid.UUID,
    connection_id: str,
    display_name: str | None = None,
) -> Participant:
    """Create a new participant record."""
    is_anonymous = display_name is None or display_name.strip() == ""

    participant = Participant(
        session_id=session_id,
        display_name=display_name if not is_anonymous else None,
        connection_id=connection_id,
        is_anonymous=is_anonymous,
    )

    db.add(participant)
    await db.commit()
    await db.refresh(participant)

    return participant


async def mark_participant_left(db: AsyncSession, participant_id: uuid.UUID):
    """Mark a participant as having left the session."""
    from sqlalchemy import select

    result = await db.execute(
        select(Participant).where(Participant.id == participant_id)
    )
    participant = result.scalar_one_or_none()

    if participant:
        participant.left_at = datetime.utcnow()
        participant.connection_id = None
        await db.commit()


async def handle_join(
    websocket: WebSocket,
    join_code: str,
    connection_id: str,
    message: dict,
    db: AsyncSession,
):
    """Handle audience member joining."""
    display_name = message.get("display_name")

    # Get session
    session = await get_session_for_websocket(db, join_code)
    if not session:
        await websocket.send_json(
            create_error_message("session_not_found", "Session not found")
        )
        await websocket.close(code=4004)
        return None

    # Check session status
    if session.status == "ended":
        await websocket.send_json(
            create_error_message("session_ended", "This session has ended")
        )
        await websocket.close(code=4003)
        return None

    # Create participant record
    participant = await create_participant(
        db=db,
        session_id=session.id,
        connection_id=connection_id,
        display_name=display_name,
    )

    # Register connection
    connection = await connection_manager.connect(
        websocket=websocket,
        join_code=join_code,
        connection_id=connection_id,
        role=ConnectionRole.AUDIENCE,
        participant_id=participant.id,
        display_name=display_name,
    )

    # Send session state
    participant_count = connection_manager.get_participant_count(join_code)
    state_message = create_session_state_message(session, participant_count)
    await websocket.send_json(state_message)

    # Broadcast participant joined to others
    joined_message = ParticipantJoinedMessage(
        participant_id=str(participant.id),
        display_name=display_name,
        is_anonymous=participant.is_anonymous,
        participant_count=participant_count,
    ).model_dump()

    await connection_manager.broadcast_to_session(
        join_code, joined_message, exclude_connection_id=connection_id
    )

    return connection


async def handle_join_speaker(
    websocket: WebSocket,
    join_code: str,
    connection_id: str,
    message: dict,
    db: AsyncSession,
):
    """Handle speaker joining their session."""
    token = message.get("token")

    if not token:
        await websocket.send_json(
            create_error_message("auth_required", "Authentication token required")
        )
        await websocket.close(code=4001)
        return None

    # Validate token
    try:
        payload = decode_token(token)
        speaker_id = payload.get("sub")
        if not speaker_id:
            raise ValueError("Invalid token")
    except Exception:
        await websocket.send_json(
            create_error_message("invalid_token", "Invalid or expired token")
        )
        await websocket.close(code=4001)
        return None

    # Get session and verify ownership
    session = await get_session_for_websocket(db, join_code)
    if not session:
        await websocket.send_json(
            create_error_message("session_not_found", "Session not found")
        )
        await websocket.close(code=4004)
        return None

    # Verify speaker owns this session
    if str(session.presentation.speaker_id) != speaker_id:
        await websocket.send_json(
            create_error_message("forbidden", "You do not own this session")
        )
        await websocket.close(code=4003)
        return None

    # Check if speaker already connected
    existing_speaker = connection_manager.get_speaker_connection(join_code)
    if existing_speaker:
        await websocket.send_json(
            create_error_message(
                "speaker_already_connected", "Speaker is already connected"
            )
        )
        await websocket.close(code=4002)
        return None

    # Register speaker connection
    connection = await connection_manager.connect(
        websocket=websocket,
        join_code=join_code,
        connection_id=connection_id,
        role=ConnectionRole.SPEAKER,
    )

    # Send session state
    participant_count = connection_manager.get_participant_count(join_code)
    state_message = create_session_state_message(session, participant_count)
    await websocket.send_json(state_message)

    return connection


async def handle_submit_response(
    websocket: WebSocket,
    join_code: str,
    connection_id: str,
    message: dict,
    db: AsyncSession,
):
    """Handle response submission from audience."""
    slide_id = message.get("slide_id")
    content = message.get("content")

    if not slide_id or content is None:
        await websocket.send_json(
            create_error_message("invalid_request", "slide_id and content required")
        )
        return

    # Get connection info
    connections = connection_manager.get_session_connections(join_code)
    connection = next(
        (c for c in connections if c.connection_id == connection_id), None
    )

    if not connection or connection.role != ConnectionRole.AUDIENCE:
        await websocket.send_json(
            create_error_message("forbidden", "Only audience can submit responses")
        )
        return

    # Get session
    session = await get_session_for_websocket(db, join_code)
    if not session or session.status != "active":
        await websocket.send_json(
            create_error_message("session_not_active", "Session is not active")
        )
        return

    # Create response record
    from app.models import Response as ResponseModel

    response = ResponseModel(
        session_id=session.id,
        slide_id=uuid.UUID(slide_id),
        participant_id=connection.participant_id,
        content=content,
        is_ai_response=False,
    )

    db.add(response)
    await db.commit()
    await db.refresh(response)

    # Notify speaker of new response
    response_message = ResponseReceivedMessage(
        response_id=str(response.id),
        slide_id=str(response.slide_id),
        participant_id=(
            str(connection.participant_id) if connection.participant_id else None
        ),
        display_name=connection.display_name,
        content=content,
        created_at=response.created_at.isoformat(),
    ).model_dump()

    await connection_manager.broadcast_to_speaker(join_code, response_message)


async def handle_ping(websocket: WebSocket):
    """Handle ping message."""
    pong = PongMessage(timestamp=datetime.utcnow().isoformat()).model_dump()
    await websocket.send_json(pong)


@router.websocket("/ws/session/{join_code}")
async def websocket_session(
    websocket: WebSocket,
    join_code: str,
):
    """
    WebSocket endpoint for live session communication.

    Connection Flow:
    1. Connect to /ws/session/{join_code}
    2. Send 'join' message (audience) or 'join_speaker' message (speaker)
    3. Receive 'session_state' with current state
    4. Exchange messages until disconnect

    Message Types (Client -> Server):
    - join: {type: "join", display_name?: string}
    - join_speaker: {type: "join_speaker", token: string}
    - submit_response: {type: "submit_response", slide_id: string, content: object}
    - ping: {type: "ping"}
    """
    connection_id = str(uuid.uuid4())
    connection = None

    # Accept connection first for initial handshake
    await websocket.accept()

    # Get database session
    async for db in get_db_websocket():
        try:
            # Wait for join message
            try:
                initial_data = await websocket.receive_json()
            except Exception as e:
                logger.error(f"Failed to receive initial message: {e}")
                await websocket.close(code=4000)
                return

            message_type = initial_data.get("type")

            # Handle join based on role
            if message_type == WSMessageType.JOIN.value:
                # Re-create websocket connection since we already accepted
                connection = await handle_join_after_accept(
                    websocket, join_code, connection_id, initial_data, db
                )
            elif message_type == WSMessageType.JOIN_SPEAKER.value:
                connection = await handle_join_speaker_after_accept(
                    websocket, join_code, connection_id, initial_data, db
                )
            else:
                await websocket.send_json(
                    create_error_message(
                        "invalid_message",
                        "First message must be 'join' or 'join_speaker'",
                    )
                )
                await websocket.close(code=4000)
                return

            if not connection:
                # Connection was rejected, handle_* already closed websocket
                return

            # Main message loop
            while True:
                try:
                    data = await websocket.receive_json()
                    msg_type = data.get("type")

                    if msg_type == WSMessageType.SUBMIT_RESPONSE.value:
                        await handle_submit_response(
                            websocket, join_code, connection_id, data, db
                        )
                    elif msg_type == WSMessageType.PING.value:
                        await handle_ping(websocket)
                    else:
                        logger.warning(f"Unknown message type: {msg_type}")

                except WebSocketDisconnect:
                    break
                except json.JSONDecodeError:
                    await websocket.send_json(
                        create_error_message("invalid_json", "Invalid JSON message")
                    )

        except WebSocketDisconnect:
            pass
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
        finally:
            # Clean up connection
            if connection:
                removed = connection_manager.disconnect(join_code, connection_id)

                if removed and removed.role == ConnectionRole.AUDIENCE:
                    # Mark participant as left
                    if removed.participant_id:
                        await mark_participant_left(db, removed.participant_id)

                    # Broadcast participant left
                    participant_count = connection_manager.get_participant_count(
                        join_code
                    )
                    left_message = ParticipantLeftMessage(
                        participant_id=(
                            str(removed.participant_id)
                            if removed.participant_id
                            else ""
                        ),
                        participant_count=participant_count,
                    ).model_dump()

                    await connection_manager.broadcast_to_session(
                        join_code, left_message
                    )


async def handle_join_after_accept(
    websocket: WebSocket,
    join_code: str,
    connection_id: str,
    message: dict,
    db: AsyncSession,
):
    """Handle audience join after WebSocket is already accepted."""
    display_name = message.get("display_name")

    # Get session
    session = await get_session_for_websocket(db, join_code)
    if not session:
        await websocket.send_json(
            create_error_message("session_not_found", "Session not found")
        )
        await websocket.close(code=4004)
        return None

    # Check session status
    if session.status == "ended":
        await websocket.send_json(
            create_error_message("session_ended", "This session has ended")
        )
        await websocket.close(code=4003)
        return None

    # Create participant record
    participant = await create_participant(
        db=db,
        session_id=session.id,
        connection_id=connection_id,
        display_name=display_name,
    )

    # Register connection (don't accept again)
    connection = Connection(
        websocket=websocket,
        connection_id=connection_id,
        role=ConnectionRole.AUDIENCE,
        participant_id=participant.id,
        display_name=display_name,
    )

    join_code_upper = join_code.upper()
    if join_code_upper not in connection_manager._connections:
        connection_manager._connections[join_code_upper] = []
    connection_manager._connections[join_code_upper].append(connection)

    # Send session state
    participant_count = connection_manager.get_participant_count(join_code)
    state_message = create_session_state_message(session, participant_count)
    await websocket.send_json(state_message)

    # Broadcast participant joined to others
    joined_message = ParticipantJoinedMessage(
        participant_id=str(participant.id),
        display_name=display_name,
        is_anonymous=participant.is_anonymous,
        participant_count=participant_count,
    ).model_dump()

    await connection_manager.broadcast_to_session(
        join_code, joined_message, exclude_connection_id=connection_id
    )

    return connection


async def handle_join_speaker_after_accept(
    websocket: WebSocket,
    join_code: str,
    connection_id: str,
    message: dict,
    db: AsyncSession,
):
    """Handle speaker join after WebSocket is already accepted."""
    token = message.get("token")

    if not token:
        await websocket.send_json(
            create_error_message("auth_required", "Authentication token required")
        )
        await websocket.close(code=4001)
        return None

    # Validate token
    try:
        payload = decode_token(token)
        speaker_id = payload.get("sub")
        if not speaker_id:
            raise ValueError("Invalid token")
    except Exception:
        await websocket.send_json(
            create_error_message("invalid_token", "Invalid or expired token")
        )
        await websocket.close(code=4001)
        return None

    # Get session and verify ownership
    session = await get_session_for_websocket(db, join_code)
    if not session:
        await websocket.send_json(
            create_error_message("session_not_found", "Session not found")
        )
        await websocket.close(code=4004)
        return None

    # Verify speaker owns this session
    if str(session.presentation.speaker_id) != speaker_id:
        await websocket.send_json(
            create_error_message("forbidden", "You do not own this session")
        )
        await websocket.close(code=4003)
        return None

    # Check if speaker already connected
    existing_speaker = connection_manager.get_speaker_connection(join_code)
    if existing_speaker:
        await websocket.send_json(
            create_error_message(
                "speaker_already_connected", "Speaker is already connected"
            )
        )
        await websocket.close(code=4002)
        return None

    # Register speaker connection (don't accept again)
    connection = Connection(
        websocket=websocket,
        connection_id=connection_id,
        role=ConnectionRole.SPEAKER,
    )

    join_code_upper = join_code.upper()
    if join_code_upper not in connection_manager._connections:
        connection_manager._connections[join_code_upper] = []
    connection_manager._connections[join_code_upper].append(connection)

    # Send session state
    participant_count = connection_manager.get_participant_count(join_code)
    state_message = create_session_state_message(session, participant_count)
    await websocket.send_json(state_message)

    return connection
