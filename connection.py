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

@database_common.connection_handler
def select_cards_by_board(cursor, user_id, board_id):
    cursor.execute('''
                    SELECT cards.id, cards.title, cards.status_id
                    FROM cards
                    WHERE cards.user_id = %(user_id)s AND cards.board_id = %(board_id)s;
                    ''',
                   {'user_id': user_id, 'board_id': board_id})
    cards = cursor.fetchall()
    return cards
