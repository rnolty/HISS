var item;

// I use insertMany instead of insertOne because the latter doesn't include document in results
function addItem(db, callback) {
    let cursor = db.collection('items').insertMany([item], callback);
}

function addItemRoute(req, res, next) {
    function addItemCallback(err, results) {
	if (err) {
	    console.log("addItem error: ", err);
	    next(err);
	} else {
	    let newItem = results.ops[0];
	    // move the ID from top level to header
	    newItem.header.id = newItem._id;
	    delete newItem._id;
	    console.log("addItem: added ",newItem);
	    res.jsonp(newItem);
	}
    }

    item = req.body;
    delete item.header.id;          // don't store in DB; was just a temporary used by JS in browser
    datifyObject(item);
    //console.log(item);
    addItem(req.db, addItemCallback);
}

module.exports = addItemRoute;





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
