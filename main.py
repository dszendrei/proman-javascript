from flask import Flask, render_template, jsonify, request
import data_manager

app = Flask(__name__)


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')


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
    app.run(debug=True)


if __name__ == '__main__':
    main()
