// redux actions
// items
const ADD_ITEM = "ADD_ITEM";
const CREATE_NEW_ITEM = "CREATE_NEW_ITEM";
const SAVE_NEW_ITEM = "SAVE_NEW_ITEM";
const CHANGE_ITEM = "CHANGE_ITEM";
const DELETE_ITEM = "DELETE_ITEM";

// tags
const ADD_TAG = "ADD_TAG";
const CREATE_NEW_TAG = "CREATE_NEW_TAG";
const SAVE_NEW_TAG = "SAVE_NEW_TAG";
const CHANGE_TAG = "CHANGE_TAG";
const DELETE_TAG = "DELETE_TAG";

// relationships between items/tags
const CREATE_RELATION = "CREATE_RELATION";
const ATTACH_RELATIONS = "ATTACH_RELATIONS";
const REPARENT_TAG = "REPARENT_TAG";
const TAG_ITEM = "TAG_ITEM";

// listsk
const CREATE_LIST = "CREATE_LIST";
const ADD_TO_LIST = "ADD_TO_LIST";
const REMOVE_FROM_LIST = "REMOVE_FROM_LIST";
const SET_SELECTED_ITEM = "SET_SELECTED_ITEM";


var consts = {ADD_ITEM, CREATE_NEW_ITEM, SAVE_NEW_ITEM, CHANGE_ITEM, DELETE_ITEM,
              CREATE_NEW_TAG, SAVE_NEW_TAG, CHANGE_TAG, DELETE_TAG,
              CREATE_RELATION, ATTACH_RELATIONS, REPARENT_TAG, TAG_ITEM,
              CREATE_LIST, ADD_TO_LIST, REMOVE_FROM_LIST, SET_SELECTED_ITEM};

export default consts;
