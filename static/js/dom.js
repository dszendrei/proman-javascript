// It uses data_handler.js to visualize elements
let dom = {
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(this.showBoards);
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardsDiv = document.getElementById('boards');
        dom.createInput('boards', dom.addBoard, 'board');
        for (let board of boards){
            let divByBoard = document.createElement("div");
            divByBoard.setAttribute('id', 'board_' + board.id);
            divByBoard.setAttribute('class', 'container');
            divByBoard.setAttribute('data-dropped', 'false');
            boardsDiv.appendChild(divByBoard);
            divByBoard.innerHTML = board.title;
            divByBoard.addEventListener("click", dom.dropping);
            if (board.is_active) {
                divByBoard.click();
                }
            }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, this.showCards);
    },
    showCards: function (cards, numberOfCards) {

        // shows the cards of a board
        // it adds necessary event listeners also
        let rowId = event.target.id.replace('board_', 'row_');
        let row = document.getElementById(rowId);
        let order = 0;
        for (let i = 0; i < numberOfCards; i++) {
            order += 1;
            for (let card of cards) {
                if (card.order === order){
                    let status = event.target.childNodes[2].childNodes[card.status_id-1];
                    let cardDiv = document.createElement('div');
                    cardDiv.setAttribute('class', 'card');
                    cardDiv.setAttribute('id', 'card_' + card.id);
                    cardDiv.setAttribute('data-order', card.order);
                    cardDiv.innerHTML = card.title;
                    status.appendChild(cardDiv);
                }
            }
        }
    },
    appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    // here comes more features
    loadStatuses: function() {
        dataHandler.getStatuses(this.showStatuses)
    },
    showStatuses: function(statuses) {
        let boardId = event.target.id;
        let board = document.getElementById(boardId);
        let row = document.createElement("div");
        row.setAttribute('class', 'row');
        row.setAttribute('id', 'row_'+boardId.replace('board_', ''));
        board.appendChild(row);
        for (let status of statuses) {
            let statusDiv = document.createElement('div');
            statusDiv.setAttribute('class', 'col status');
            statusDiv.setAttribute('id', 'status_'+status.id);
            statusDiv.setAttribute('data-row-id', boardId.replace('board_', ''));
            statusDiv.innerHTML = status.name;
            row.appendChild(statusDiv);
            }
        let deleteDiv = document.createElement('div');
        deleteDiv.setAttribute('class', 'col delete');
        deleteDiv.setAttribute('id', 'delete_'+boardId.replace('board_', ''));
        row.appendChild(deleteDiv);
        /*let deleteLogo = document.createElement('i');
        deleteLogo.setAttribute('class', "fas fa-trash-alt");
        deleteDiv.appendChild(deleteLogo);*/
        board.dataset.dropped = 'true';
    },
    dropping: function() {
        let board = document.getElementById(this.id);
        let dropped = board.dataset.dropped;
        if (dropped === 'false'){
            dom.createInput(this.id, dom.addCard, 'card');
            dom.loadStatuses(this.id.replace('board_', ''));
            dom.loadCards(this.id.replace('board_', ''));
            dom.placeDagula();
            dom.addDeleteLogo(this.id);
            dataHandler.saveDroppedStatus(this.id.replace('board_', ''), true);
        } else if (event.target.parentElement.id === "boards") {
            dom.hideCards(this.id.replace('board_', ''));
            dataHandler.saveDroppedStatus(this.id.replace('board_', ''), false);
        }

    },
    addDeleteLogo: function (boardId) {
        let deleteCols = document.getElementsByClassName('delete');
        console.log(deleteCols);
        for (let deleteCol of deleteCols) {
            if (deleteCol.id.replace('delete_', '') === boardId.replace('board_', '')) {
                let deleteLogo = document.createElement('i');
                deleteLogo.setAttribute('class', "fas fa-trash-alt");
                deleteCol.appendChild(deleteLogo);
            }
        }
    },
    hideCards: function(boardId) {
        let rowId = 'row_' + boardId;
        let row = document.getElementById(rowId);
        let input = row.previousSibling;
        input.remove();
        row.remove();
        let board = document.getElementById('board_'+boardId);
        board.dataset.dropped = 'false';
    },
    placeDagula: function () {
        let statuses = Array.from(event.target.lastElementChild.childNodes);
        dragula(statuses)
            .on('drop', function (el, target, source, sibling) {
                let cardId = event.target.id;
                let statusId = document.getElementById(cardId).parentElement.id;
                if (statusId.slice(0, 3) === 'del') {
                    let confirmation = confirm("Do you want to delete this card?")
                    if (confirmation) {
                        dataHandler.deleteCard(cardId);
                        el.remove();
                    } else {
                        dom.rebuild();
                    }
                } else {
                    dataHandler.saveCard(cardId, statusId);
                }
            }).on('dragend', function (el) {
                dataHandler.saveCards()
        });

    },
    addBoard: function () {
        let title = event.target.parentElement.previousElementSibling.value;
        dataHandler.saveNewBoard(title);
        let board = document.getElementById("boards");
        board.remove();
        let mainBoardDiv = document.createElement('div');
        mainBoardDiv.setAttribute('id', 'boards');
        let body = document.getElementsByTagName("BODY")[0];
        body.appendChild(mainBoardDiv);
        dom.loadBoards();
    },
    createInput: function (parentId, event, element) {
        let parentDiv = document.getElementById(parentId);
        let divByNewElement = document.createElement("div");
        divByNewElement.setAttribute("class", "input-group mb-3 container");
        parentDiv.appendChild(divByNewElement);
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "form-control");
        input.setAttribute("placeholder", "Add new " + element);
        input.setAttribute("aria-label", "Add new " + element);
        input.setAttribute("aria-describedby", "basic-addon2");
        divByNewElement.appendChild(input);
        let buttonDiv = document.createElement("div");
        buttonDiv.setAttribute("class", "input-group-append");
        divByNewElement.appendChild(buttonDiv);
        let btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-outline-secondary");
        btn.setAttribute("type", "button");
        btn.innerHTML = "Add";
        buttonDiv.appendChild(btn);
        btn.addEventListener("click", event);
    },
    addCard: function () {
        let title = event.target.parentElement.previousElementSibling.value;
        let boardId = Number(event.target.parentElement.parentElement.parentElement.id.replace('board_', ''));
        dataHandler.saveNewCard(title, boardId);
        dom.rebuild();
    },
    rebuild: function () {
        let board = document.getElementById("boards");
        board.remove();
        let mainBoardDiv = document.createElement('div');
        mainBoardDiv.setAttribute('id', 'boards');
        let body = document.getElementsByTagName("BODY")[0];
        body.appendChild(mainBoardDiv);
        dom.loadBoards();
    }
};
