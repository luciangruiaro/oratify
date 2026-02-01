"""
WebSocket Connection Manager

Manages WebSocket connections for live presentation sessions.
Tracks connections per session and provides broadcast capabilities.

Features:
- Per-session connection tracking
- Broadcast to all participants in a session
- Broadcast to specific roles (speaker/audience)
- Connection lifecycle management
"""

import json
import logging
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionRole(str, Enum):
    """Role of a WebSocket connection."""

    SPEAKER = "speaker"
    AUDIENCE = "audience"


@dataclass
class Connection:
    """Represents an active WebSocket connection."""

    websocket: WebSocket
    connection_id: str
    role: ConnectionRole
    participant_id: UUID | None = None
    display_name: str | None = None
    connected_at: datetime = field(default_factory=datetime.utcnow)


class ConnectionManager:
    """
    Manages WebSocket connections for all active sessions.

    Provides methods to:
    - Add/remove connections
    - Broadcast messages to sessions
    - Track participant counts
    """

    def __init__(self):
        # session_join_code -> list of connections
        self._connections: dict[str, list[Connection]] = {}

    def get_session_connections(self, join_code: str) -> list[Connection]:
        """Get all connections for a session."""
        return self._connections.get(join_code.upper(), [])

    def get_participant_count(self, join_code: str) -> int:
        """Get number of audience connections for a session."""
        connections = self.get_session_connections(join_code)
        return sum(1 for c in connections if c.role == ConnectionRole.AUDIENCE)

    def get_speaker_connection(self, join_code: str) -> Connection | None:
        """Get the speaker connection for a session, if connected."""
        connections = self.get_session_connections(join_code)
        for conn in connections:
            if conn.role == ConnectionRole.SPEAKER:
                return conn
        return None

    async def connect(
        self,
        websocket: WebSocket,
        join_code: str,
        connection_id: str,
        role: ConnectionRole,
        participant_id: UUID | None = None,
        display_name: str | None = None,
    ) -> Connection:
        """
        Accept a new WebSocket connection and add to session.

        Args:
            websocket: The WebSocket connection
            join_code: Session join code
            connection_id: Unique connection identifier
            role: Connection role (speaker/audience)
            participant_id: Database participant ID (for audience)
            display_name: Display name (for audience)

        Returns:
            The created Connection object
        """
        await websocket.accept()

        connection = Connection(
            websocket=websocket,
            connection_id=connection_id,
            role=role,
            participant_id=participant_id,
            display_name=display_name,
        )

        join_code_upper = join_code.upper()
        if join_code_upper not in self._connections:
            self._connections[join_code_upper] = []

        self._connections[join_code_upper].append(connection)

        logger.info(
            f"Connection {connection_id} ({role.value}) joined session {join_code_upper}"
        )

        return connection

    def disconnect(self, join_code: str, connection_id: str) -> Connection | None:
        """
        Remove a connection from a session.

        Args:
            join_code: Session join code
            connection_id: Connection to remove

        Returns:
            The removed Connection, or None if not found
        """
        join_code_upper = join_code.upper()
        connections = self._connections.get(join_code_upper, [])

        for i, conn in enumerate(connections):
            if conn.connection_id == connection_id:
                removed = connections.pop(i)
                logger.info(
                    f"Connection {connection_id} ({removed.role.value}) "
                    f"left session {join_code_upper}"
                )

                # Clean up empty session
                if not connections:
                    del self._connections[join_code_upper]

                return removed

        return None

    async def send_personal(self, websocket: WebSocket, message: dict[str, Any]):
        """Send a message to a specific connection."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")

    async def broadcast_to_session(
        self,
        join_code: str,
        message: dict[str, Any],
        exclude_connection_id: str | None = None,
    ):
        """
        Broadcast a message to all connections in a session.

        Args:
            join_code: Session join code
            message: Message to broadcast
            exclude_connection_id: Optional connection ID to exclude
        """
        connections = self.get_session_connections(join_code)

        for conn in connections:
            if exclude_connection_id and conn.connection_id == exclude_connection_id:
                continue

            try:
                await conn.websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to {conn.connection_id}: {e}")

    async def broadcast_to_audience(
        self,
        join_code: str,
        message: dict[str, Any],
        exclude_connection_id: str | None = None,
    ):
        """Broadcast a message to all audience connections in a session."""
        connections = self.get_session_connections(join_code)

        for conn in connections:
            if conn.role != ConnectionRole.AUDIENCE:
                continue
            if exclude_connection_id and conn.connection_id == exclude_connection_id:
                continue

            try:
                await conn.websocket.send_json(message)
            except Exception as e:
                logger.error(
                    f"Error broadcasting to audience {conn.connection_id}: {e}"
                )

    async def broadcast_to_speaker(self, join_code: str, message: dict[str, Any]):
        """Send a message to the speaker connection of a session."""
        speaker = self.get_speaker_connection(join_code)
        if speaker:
            try:
                await speaker.websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending to speaker: {e}")

    def close_session(self, join_code: str) -> list[Connection]:
        """
        Remove all connections for a session.

        Returns the list of removed connections.
        """
        join_code_upper = join_code.upper()
        connections = self._connections.pop(join_code_upper, [])
        logger.info(
            f"Closed session {join_code_upper}, removed {len(connections)} connections"
        )
        return connections


# Global connection manager instance
connection_manager = ConnectionManager()
