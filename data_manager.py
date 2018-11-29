import connection


def get_boards_by_user(user_id):
    return connection.select_boards_by_user(user_id)


def get_cards_by_user(user_id):
    return connection.select_cards_by_user(user_id)
