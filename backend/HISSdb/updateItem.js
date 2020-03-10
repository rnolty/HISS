const {ObjectId} = require('mongodb');

import recurTodos from './recurTodos.js';

function isItemNewlyDone(item, id, db) {
    const itemInDB = db.collection("items").findOne({_id: ObjectId(id)});
    return (!(itemInDB && itemInDB.details && itemInDB.details.done));
}

function checkForRecursion(item, id, db) {
    if (!(item.header && item.header.type === "Todo" && item.details && item.details.done &&
         item.details.recur !== "None")) return item;

    // this item is now 'Done'; was it already done before this update?
    const newlyDone = isItemNewlyDone(item, id, db);
    if (!newlyDone) return item;

    // yes, it is newly 'Done', so we must calculate recurrence before saving it
    const modifiedList = recurTodos(db, [item]);
    if (modifiedList && modifiedList[0]) {
        // since we just recurred the event, it is no longer done
        modifiedList[0].details.done = false;
        console.log("Recurred newly-done item",item.header.title);
        return modifiedList[0];
    }
    return item;        // in case recurTodos somehow returned undefined
}

function updateItem(item, id, db, callback) {
    // TODO: do a shallow merge, so items can retain custom properties, and so maybe some day
    //    items will have seldom-accessed attributes that normally don't get sent to browser
    const criteria = {_id: id};
    const sort = [['_id', 'asc']];              // doesn't matter, only 1 record can possibly match
    const replace = { $set: {header: item.header, details: item.details} };
    const opts = {'new': true};                 // return modified record (not record from db, pre-mods)
    db.collection('items').findOneAndReplace({_id: id}, item);
}

function updateItemRoute(req, res, next) {
    let item = req.body;
    const id = ObjectId(item.header.id);
    if (id === undefined) {
	console.log("updateItemRoute: called with item with no ID",item);
	next(Error("updateItemRoute called with item with no ID"));
    }
    delete item.header.id;          // don't store in DB in this location, but as top-level _id
    datifyObject(item);             // determine if any JSON strings should be turned into Date objects
    console.log("updateItem in: ",item);

    item = checkForRecursion(item, id, req.db); // compute recurring Todo items if this update marks it 'done'

     function updateItemCallback(err, results) {
	console.log('updateItemCallback:', err, results);
	if (err) {
	    console.log("updateItem error: ", err);
	    next(err);
	} else {
	    let updatedItem = results.value;
	    // move the ID from top level to header
            if (! updatedItem.header) {
                console.log("updateItemCallback: received invalid value", updatedItem);
                next(Error("updateItemCallback received invalid item"));
            }
	    updatedItem.header.id = updatedItem._id;
	    delete updatedItem._id;
	    console.log("updateItem out: ", updatedItem);
	    res.jsonp(updatedItem);
	}
    }

    updateItem(item, id, req.db, updateItemCallback);
}

module.exports = updateItemRoute;





// ===================

// this is not HISS-specific but I didn't want to create a whole module for it...
// Given an object, for any fields that appear to be dates, replace string value with Date object
// For now I'm being lazy and operating on the obj passed in -- might be better to copy and
//    return datified copy?
function datifyObject(obj) {
    for (const field in obj) {
	// apparently '!' has higher precedence than instanceof, so extra parens are needed
        if ((typeof obj[field] === "object") && (! (obj[field] instanceof Date))) {
	    datifyObject(obj[field]);
	} else if ((typeof obj[field] === "string") &&
		   ((field.startsWith("date") || field.startsWith("time") ||
		     field.endsWith("Date") || field.endsWith("Time"))))
	{
	    if (Date.parse(obj[field])) {         // valid date string (o/w returns NaN, which evaluates false)
		obj[field] = new Date(obj[field]);
	    }
	} // else do nothing
    }
}
