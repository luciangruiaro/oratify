# db_conn.py
import mysql.connector

from python.middleware.config.db_config import DB_CONFIG


def get_db_connection():
    return mysql.connector.connect(
        host=DB_CONFIG['host'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password'],
        database=DB_CONFIG['database']
    )
