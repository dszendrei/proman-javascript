from flask import Flask, render_template, session, request, jsonify, redirect, url_for, flash
import data_manager
import os

app = Flask(__name__)


@app.route('/')
def index():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('index.html')


@app.route('/boards')
def boards():
    user_id = session['user_id']
    return render_template('boards.html', user_id=user_id)


@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    if data_manager.user_login(username, password):
        session['username'] = username
        user_id = data_manager.get_user_id(session['username'])
        session['user_id'] = user_id
        session.pop('_flashes', None)
        return redirect(url_for('boards'))
    else:
        flash(u'Wrong username or password.', 'login')
        return redirect(url_for('index'))


@app.route('/registration', methods=['POST'])
def registration():
    username = request.form['username']
    password = request.form['password']

    if data_manager.register_new_user(username, password):
        session['username'] = username
        user_id = data_manager.get_user_id(session['username'])
        session['user_id'] = user_id
        session.pop('_flashes', None)
        return redirect(url_for('boards'))
    else:
        flash(u'This username is already taken.', 'signup')
        return redirect(url_for('index'))


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route("/data-handling/<item>", methods=['POST'])
def data_handling(item):
    json_data = request.get_json()
    user_id = json_data['user_id']
    if item == 'boards':
        return_data = data_manager.get_boards_by_user(user_id)
    ''' this is a one-pager which shows all the boards and cards '''
    if item == 'cards':
        return_data = data_manager.get_cards_by_user(user_id)
    return jsonify(success=True, data=return_data)


def main():
    app.secret_key = os.urandom(24)
    app.run(debug=True)


if __name__ == '__main__':
    main()
