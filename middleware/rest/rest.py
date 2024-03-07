from flask import Flask, request, jsonify

from middleware.db.db_conn import get_db_connection

app = Flask(__name__)


@app.route('/user_join', methods=['POST'])
def user_join():
    data = request.get_json()
    presentation_code = data['presentation_code']
    first_name = data['first_name']
    last_name = data['last_name']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.callproc('user_join', [presentation_code, first_name, last_name])
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})


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


if __name__ == '__main__':
    app.run(debug=True, port=5017)
