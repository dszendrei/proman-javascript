import connection
import hashing


def user_login(username, password):
    user = connection.select_user_by_username(username)
    if user:
        return hashing.verify_password(password, user['password'])
    else:
        return False


def get_user_id(username):
    user_id = connection.select_user_by_username(username)['id']
    return user_id


def register_new_user(username, password):
    if connection.select_user_by_username(username):
        return False
    else:
        hashed_password = hashing.hash_password(password)
        connection.insert_new_user(username, hashed_password)
        return True
