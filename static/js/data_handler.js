// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
let dataHandler = {
    keyInLocalStorage: 'proman-data', // the string that you use as a key in localStorage to save your application data
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _loadData: function () {
        // it is not called from outside
        // loads data from local storage, parses it and put into this._data property
        let localData = localStorage.getItem(this.keyInLocalStorage);
        this._data = JSON.parse(localData);
    },
    _saveData: function () {
        // it is not called from outside
        // saves the data from this._data to local storage
        localStorage.setItem(this.keyInLocalStorage, JSON.stringify(this._data));
    },
    init: function () {
        this._loadData();
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards
        let boards = this._data.boards;
        callback(boards);
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board

    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        let statuses = this._data.statuses;
        callback(statuses);
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status

    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        let cards = [];
        for (let card of this._data.cards){
            if (card.board_id === parseInt(boardId)){
                cards.push(card);
            }
        }
        callback(cards);
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    },
    // here comes more features
    saveCard: function (cardId, statusId, order=1) {
        for (let card of this._data.cards) {
            if (String(card.id) === cardId.replace('card_', '')) {
                card.status_id = statusId.replace('status_', '');
                card.order = order;
            }
        }
        this._saveData();
    },
    saveNewBoard: function (title) {
        let boardId = 0;
        let nameNotTaken = true;
        for (let board of this._data.boards) {
            if (boardId <= board.id) {
                boardId = board.id;
            }
            if (title === board.title) {
                nameNotTaken = false;
            }
        }
        boardId += 1;
        if (nameNotTaken) {
            let newBoard = {id: boardId, title: title, is_active: true};
            this._data.boards.push(newBoard);
            this._saveData();
        } else {
            alert('Title already exists');
        }
    },
    saveNewCard: function (title, boardId) {
        let cardId = 0;
        let nameNotTaken = true;
        for (let card of this._data.cards) {
            if (cardId <= card.id) {
                cardId = card.id;
            }
            if (title === card.title && boardId === card.board_id) {
                nameNotTaken = false;
            }
        }
        cardId += 1;
        if (nameNotTaken) {
            let newCard = {id: cardId, title: title, board_id: boardId, status_id: 1, order: 1};
            this._data.cards.push(newCard);
            this._saveData();
        } else {
            alert('Title already exists');
        }
    },
    saveDroppedStatus: function (boardId, dropped) {
        for (let board of this._data.boards) {
            if (boardId === String(board.id)) {
                if (dropped) {
                    board.is_active = true;
                } else {
                    board.is_active = false;
                }
            }
        }
        this._saveData();
    }
};
