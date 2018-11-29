// This function is to initialize the application
function init() {
    // init data
    let userId = 1;
    let isDataLoaded = dataHandler.getUsersData(this.isDataLoadedFunc, userId);
    console.log(dataHandler._data);
    // loads the boards to the screen
    console.log(isDataLoaded);
    //if (isDataLoaded){
    //    console.log('2');
        setTimeout(function(){ dom.loadBoards() }, 300);
    //}
}

function isDataLoadedFunc(){
    let userId = 1
}

init();
