import database_common


@database_common.connection_handler
def select_boards_by_user(cursor, user_id):
    cursor.execute('''
                    SELECT id, title, is_active
                    FROM boards
                    WHERE user_id = %(user_id)s;
                    ''',
                   {'user_id': user_id})
    boards = cursor.fetchall()
    return boards

