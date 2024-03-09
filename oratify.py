import os

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from middleware.db.db_conn import get_db_connection

app = Flask(__name__, static_folder='static')
CORS(app)


@app.route('/user_join', methods=['POST'])
def user_join():
    data = request.get_json()
    presentation_code = data['presentation_code']
    first_name = data['first_name']
    last_name = data['last_name']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('user_join', [presentation_code, first_name, last_name])

    # Fetch the result set from the stored procedure
    results = cursor.stored_results()
    result_set = next(results, None)
    if result_set:
        columns = [col[0] for col in result_set.description]
        row = result_set.fetchone()
        if row:
            user_data = dict(zip(columns, row))
        else:
            user_data = {'message': 'No user data returned'}
    else:
        user_data = {'message': 'No user data returned'}

    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(user_data)


@app.route('/session_question_curr', methods=['GET'])
def session_question_curr():
    # Assuming presentation_id is provided as a query parameter
    presentation_id = request.args.get('presentation_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('session_question_curr', [presentation_id])

    # Fetch result and column names
    results = cursor.stored_results()
    result_set = next(results, None)
    if result_set:
        columns = [col[0] for col in result_set.description]  # Get column names
        row = result_set.fetchone()
        if row:
            data = dict(zip(columns, row))
            cursor.close()
            conn.close()
            return jsonify(data)
        else:
            cursor.close()
            conn.close()
            return jsonify({'message': 'No data found'}), 404
    else:
        cursor.close()
        conn.close()
        return jsonify({'message': 'No data found'}), 404


@app.route('/session_question_set', methods=['POST'])
def session_question_set():
    data = request.get_json()
    presentation_id = data['presentation_id']
    curr_question_id = data['curr_question_id']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('session_question_set', [presentation_id, curr_question_id])
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})


@app.route('/answer', methods=['POST'])
def answer():
    data = request.get_json()
    user_id = data['user_id']
    presentation_id = data['presentation_id']
    question_id = data['question_id']
    answer = data['answer']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('answer', [user_id, presentation_id, question_id, answer])
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})


@app.route('/answers_question', methods=['GET'])
def answers_question():
    presentation_id = request.args.get('presentation_id')
    question_id = request.args.get('question_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('answers_question', [presentation_id, question_id])

    # Initialize an empty list to hold all rows of results
    all_results = []

    # Fetch result and column names
    results = cursor.stored_results()
    result_set = next(results, None)
    if result_set:
        columns = [col[0] for col in result_set.description]  # Get column names
        rows = result_set.fetchall()
        for row in rows:
            data = dict(zip(columns, row))
            all_results.append(data)

    cursor.close()
    conn.close()
    return jsonify(all_results)


@app.route('/sessions_users', methods=['GET'])
def sessions_users():
    # Assuming presentation_id is provided as a query parameter
    presentation_id = request.args.get('presentation_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('sessions_users', [presentation_id])

    # Initialize an empty list to hold all rows of results
    all_results = []

    # Fetch result and column names
    results = cursor.stored_results()
    result_set = next(results, None)
    if result_set:
        columns = [col[0] for col in result_set.description]  # Get column names
        rows = result_set.fetchall()
        for row in rows:
            data = dict(zip(columns, row))
            all_results.append(data)

    cursor.close()
    conn.close()
    return jsonify(all_results)


@app.route('/presentation_play', methods=['POST'])
def presentation_play():
    data = request.get_json()
    presentation_id = data['presentation_id']
    duration = data['duration']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('presentation_play', [presentation_id, duration])
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({'success': True})


@app.route('/presentation_remaining_time', methods=['GET'])
def presentation_remaining_time():
    presentation_id = request.args.get('presentation_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('presentation_remaining_time', [presentation_id])

    result_set = next(cursor.stored_results(), None)
    remaining_time = result_set.fetchone()[0] if result_set else 0

    cursor.close()
    conn.close()
    return jsonify({'remaining_seconds': remaining_time})


@app.route('/presentation_curr_set', methods=['POST'])
def presentation_curr_set():
    data = request.get_json()
    presentation_id = data['presentation_id']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('presentation_curr_set', [presentation_id])
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})


@app.route('/presentation_curr_get', methods=['GET'])
def presentation_curr_get():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('presentation_curr_get')

    result_set = next(cursor.stored_results(), None)
    presentation_id = result_set.fetchone()[0] if result_set else None

    cursor.close()
    conn.close()
    return jsonify({'presentation_id': presentation_id})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5017)
