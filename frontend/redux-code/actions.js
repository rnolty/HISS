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


var actions = {addItem, createNewItem, saveNewItem, changeItem, deleteItem};

export default actions;
