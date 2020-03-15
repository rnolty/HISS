// HISS store
// nolty 201909

import reducers from './reducers';
import consts from './consts';
import { createStore } from 'redux';

// the structure of the store will be as follows:

// {
//    all_items:
//       {key: item}
//
//    all_tags:
//       {key: tag}
//
//    all_users:
//       {...}
//
//    all_lists:       # itemList components have a key for what list they should display
//       {key: [id, id, id]}
//
//    fetchStatus:
//       {currentlyFetching: true/false,
//        errorMessage: text,
//        warningMessage: text,
//        infoMessage: text}

//    page:
//      calendarPage
//         monthView:
//            lists [[[id,displayOptions] ,id,id], [id,id,id], ... ]    1-31
//         OR
//         weekView:
//            lists: [[[id,displayOptions],id,id], [id,id,id], ... ]    1-7
//         OR
//         dayView:
//            list: [[id,displayOptions], id, ...]
//      OR
//      todoPage:
//         timeframeTodoList: [[id, displayOptions], id, ...]
//         dueDateTodoList: [[id, displayOptions], id, ...]
//      OR
//      mainPage ...
//      explorePage ...
//      customPage ...
//   sidebar: ...
//      searchCriteria: {}
//      list: [id, id, ...]



var initialState = {
    allItems: {},
    allTags: {},
    allUsers: {},
    allLists: {},
    fetchStatus: {
        currentlyFetching: false,
        errorMessage: undefined,
        warningMessage: undefined,
        infoMessage: undefined
    },
    page: {
        calendarPage: undefined,
        todoPage: undefined,
//        mainPage: undefined,
        explorePage: undefined,
        customPage: undefined
    },
    sidebar: {
        searchCriteria: {
            expanded: false,
            types: [],
            people: [],
            startDate: undefined,
            endDate: undefined,
            string: undefined
        },
        list: []
    }
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case consts.ADD_ITEM:
        {
           return actions.addItem(state, action);
        }
        case consts.CREATE_LIST:
        {
            return actions.createList(state, action);
        }
    }
    console.log('reducer called with action',action,'; new state:', state);

    return state;
}

console.log("Calling createStore...");
const store = createStore(reducer);
console.log("...done");

///////////////// temporary /////////////////////
console.log("Calling dispatch...");
store.dispatch({type: consts.ADD_ITEM,
                item: {id: 1,
                       header: {
                           id: 1,
                           name: "Bob",
                           type: "TodoItem"
                       }
                      }
               }
              );

store.dispatch({type: consts.ADD_ITEM,
                item: {id: 2,
                       header: {
                           id: 2,
                           name: "Anne",
                           type: "Calendar Item"
                       }
                      }
               }
              );

store.dispatch({type: consts.CREATE_LIST,
                theList: {
                    id: 1,
                    items: [1,2]
                }
               }
              );

console.log("...done");


export default store;
