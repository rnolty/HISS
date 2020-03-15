function addItem(state, action) {
    // this will be called for items fetched from server
    var tmp = {};
    tmp[action.item.id] = action.item;
    return {...state, allItems: Object.assign(tmp, state.allItems)};
}

function createNewItem(state, action) {
    const newItem = {id: -1, name: 'newItem', type: "CalendarItem"}
    var tmp = {};
    tmp[newItem.id] = newItem;
    return {...state, allItems: Object.assign(tmp, state.allItems)};
}

function saveNewItem(state, action) {
    const oldID = action.item.id;
    // todo: dispatch request to server; delete oldID and insert newID when server replies
}

function changeItem(state, action) {
    var tmp = {};
    tmp[action.item.id] = action.item;
    return {...state, allItems: Object.assign(tmp, state.allItems)};
}

function deleteItem(state, action) {
    // todo: dispatch delete request to server
    copyItems = state.allItems;
    delete(copyItems[action.id]);
    return {...state, allItems: copyItems};
}

function createList(state, action) {
    // this is just for the app, no need to communicate with server
    theList = action.theList.items ? action.theList.items : [];
    tmp = {}
    tmp[action.theList.id] = theList;
    return {...state, allLists: Object.assign(tmp, state.allLists)};
}
var reducers = {addItem, createNewItem, saveNewItem, changeItem, deleteItem, createList};

export default reducers;
