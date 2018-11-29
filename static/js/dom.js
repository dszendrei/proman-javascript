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
            boardTitle = document.createElement('span');
            boardTitle.innerHTML = board.title;
            divByBoard.appendChild(boardTitle);
            let deleteBtn = document.createElement('span');
            deleteBtn.setAttribute('class', 'fas fa-trash-alt boardDelete');
            divByBoard.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', dom.deleteBoard);
            let editBtn = document.createElement('span');
            editBtn.setAttribute('class', 'fas fa-edit boardEdit');
            divByBoard.appendChild(editBtn);
            editBtn.addEventListener('click', dom.editBoard);
            let dropBtn = document.createElement('span');
            dropBtn.setAttribute('class', 'fas fa-caret-down dropBtn');
            divByBoard.appendChild(dropBtn);
            dropBtn.addEventListener("click", dom.dropping);
            if (board.is_active) {
                dropBtn.click();
                }
            }
    },
    deleteBoard: function () {
        let boardId = event.path[1].id.replace('board_', '');
        let boardTitle = event.path[1].firstElementChild.innerHTML;
        let confirmation = confirm("Do you want to delete "+boardTitle+'?');
        if (confirmation) {
            dataHandler.deleteBoard(boardId)
        }
        dom.rebuild()
    },
    editBoard: function () {
        let boardId = event.path[1].id;
        let oldBoardTitle = event.path[1].firstElementChild.innerHTML;
        let boardTitle = prompt("Please enter new title", oldBoardTitle);
        dataHandler.editBoard(boardId, boardTitle);
        dom.rebuild()
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, this.showCards);
    },
    showCards: function (cards, numberOfCards) {

        // shows the cards of a board
        // it adds necessary event listeners also
        let dropBtn = event.target;
        let rowId = dropBtn.parentElement.id.replace('board_', 'row_');
        let row = document.getElementById(rowId);
        let order = 0;
        for (let i = 0; i < numberOfCards; i++) {
            order += 1;
            for (let card of cards) {
                if (card.order === order){
                    let status = dropBtn.parentElement.childNodes[5].childNodes[card.status_id-1];
                    let cardDiv = document.createElement('div');
                    cardDiv.setAttribute('class', 'card');
                    cardDiv.setAttribute('id', 'card_' + card.id);
                    cardDiv.setAttribute('data-order', card.order);
                    let cardText = document.createElement('span');
                    cardText.innerHTML = card.title;
                    cardText.setAttribute('class', 'cardtext');
                    cardDiv.appendChild(cardText);
                    let editSpan = document.createElement('span');
                    editSpan.setAttribute('class', 'fas fa-edit cardEdit');
                    cardDiv.appendChild(editSpan);
                    status.appendChild(cardDiv);
                    editSpan.addEventListener('click', dom.editCard)
                }
            }
        }
    },
    editCard: function () {
        let cardId = event.path[1].id;
        let oldCardTitle = event.path[1].firstElementChild.innerHTML;
        let cardTitle = prompt("Please enter new title", oldCardTitle);
        dataHandler.editCard(cardId, cardTitle);
        dom.rebuild()
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
        let dropBtn = event.target;
        let boardId = dropBtn.parentElement.id;
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
        board.dataset.dropped = 'true';
    },
    dropping: function() {
        let dropBtn = this;
        let board = document.getElementById(this.parentElement.id);
        let dropped = board.dataset.dropped;
        if (dropped === 'false'){
            dom.createInput(this.parentElement.id, dom.addCard, 'card');
            dom.loadStatuses(this.parentElement.id.replace('board_', ''));
            dom.loadCards(this.parentElement.id.replace('board_', ''));
            dom.placeDagula();
            dom.addDeleteLogo(this.parentElement.id);
            dataHandler.saveDroppedStatus(this.parentElement.id.replace('board_', ''), true);
            dropBtn.setAttribute('class', 'fas fa-caret-down dropBtn')
        } else if (dropBtn.parentElement.parentElement.id === "boards") {
            dom.hideCards(this.parentElement.id.replace('board_', ''));
            dataHandler.saveDroppedStatus(this.parentElement.id.replace('board_', ''), false);
            dropBtn.setAttribute('class', 'fas fa-caret-left dropBtn')
        }

    },
    addDeleteLogo: function (boardId) {
        let deleteCols = document.getElementsByClassName('delete');
        for (let deleteCol of deleteCols) {
            if (deleteCol.id.replace('delete_', '') === boardId.replace('board_', '')) {
                let deleteLogo = document.createElement('i');
                deleteLogo.setAttribute('class', "fas fa-trash-alt cardDelete");
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
        let dropBtn = event.target;
        let statuses = Array.from(dropBtn.parentElement.lastElementChild.childNodes);
        let drake = dragula(statuses, {
            revertOnSpill: true,
            invalid: function (el) {
                return el.classList.contains("fa-trash-alt")}});
        drake.on('drop', function (el, target, source, sibling) {
                let cardId = el.id;
                let statusId = document.getElementById(cardId).parentElement.id;
                if (statusId.slice(0, 3) === 'del') {
                    let confirmation = confirm("Do you want to delete this card?");
                    if (confirmation) {
                        dataHandler.deleteCard(cardId.replace('card_', ''));
                        el.remove();
                    } else {
                        dom.rebuild();
                    }
                } else {
                    dataHandler.saveCard(cardId, statusId);
                }
            }).on('dragend', function (el) {
                dataHandler.saveCards(el)
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
