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


@database_common.connection_handler
def insert_new_user(cursor, username, password):
    cursor.execute('''
                    INSERT INTO users (username, password)
                    VALUES (%(username)s, %(password)s); 
                    ''',
                   {'username': username, 'password': password})


@database_common.connection_handler
def select_user_by_username(cursor, username):
    cursor.execute('''
                    SELECT id, username, password
                    FROM users
                    WHERE username = %(username)s;
                    ''',
                    {'username': username})
    user = cursor.fetchone()
    return user


@database_common.connection_handler
def update_board(cursor, user_id, board_id, is_active):
    cursor.execute('''
                    UPDATE boards
                    SET is_active = %(is_active)s
                    WHERE user_id = %(user_id)s AND id = %(board_id)s;
                    ''',
                   {'user_id': user_id, 'board_id': board_id, 'is_active': is_active})


@database_common.connection_handler
def update_card_status(cursor, user_id, status_id, card_id):
    cursor.execute('''
                    UPDATE cards
                    SET status_id = %(status_id)s
                    WHERE user_id = %(user_id)s AND id = %(card_id)s;
                    ''',
                   {'user_id': user_id, 'status_id': status_id, 'card_id': card_id})


@database_common.connection_handler
def update_card_title(cursor, user_id, title, card_id):
    cursor.execute('''
                    UPDATE cards
                    SET title = %(title)s
                    WHERE user_id = %(user_id)s AND id = %(card_id)s;
                    ''',
                   {'user_id': user_id, 'title': title, 'card_id': card_id})


@database_common.connection_handler
def insert_new_board(cursor, user_id, title, is_active=True):
    cursor.execute('''
                    INSERT INTO boards (title, is_active, user_id)
                    VALUES (%(title)s, %(is_active)s, %(user_id)s);
                    ''',
                   {'user_id': user_id, 'title': title, 'is_active': is_active})


@database_common.connection_handler
def insert_new_card(cursor, user_id, title, board_id, status_id=1):
    cursor.execute('''
                    INSERT INTO cards (title, status_id, board_id, user_id) 
                    VALUES (%(title)s, %(status_id)s, %(board_id)s, %(user_id)s);
                    ''',
                   {'user_id': user_id, 'title': title, 'status_id': status_id, 'board_id': board_id})
