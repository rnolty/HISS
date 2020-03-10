// for debug only
const util = require('util');

// change the criteria object from the format used on the client side
//    to the format used by mongodb
function transformCriteria(originalCriteria) {
    //console.log("criteria from browser: ", util.inspect(originalCriteria));

    let newCriteria = {};

    for (const prop in originalCriteria) {
	if (prop === "type") {
	    if (originalCriteria.type !== 'All') {
		if (Array.isArray(originalCriteria.type)) {
		    newCriteria["header.type"] = {$in: originalCriteria.type};
		} else {
		    // a single type
		    newCriteria["header.type"] = originalCriteria.type;
		}
	    } // else leave it unspecified
	    continue;
	}

	if (prop === "people") {
	    if (originalCriteria.people !== 'All') {
		if (Array.isArray(originalCriteria.people)) {
		    newCriteria["header.people"] = {$in: originalCriteria.people};
		} else {
		    // a single person
		    newCriteria["header.people"] = originalCriteria.people;
		}
	    } // else leave it unspecified
	    continue;
	}

	if (prop === "tags") {
	    if ((originalCriteria.tags !== "All") && (originalCriteria.tags.length !== 0)) {
		// unlike people, tags is always an Array
		// TODO: include all descendant tags in list of tags
		newCriteria["header.tags"] = {$in: originalCriteria.tags};
		//console.log("originalCriteria.tags: ", originalCriteria["tags"], "newCriteria[header.tags]: ", newCriteria["header.tags"]);
	    } // else leave it unspecified
	    continue;
	}

	if ((prop === "startDate") || (prop === "endDate")) {
	    //console.log("non-date criteria: ", util.inspect(newCriteria));
	    newCriteria = handleDate(originalCriteria, newCriteria);
	    //console.log("after applying date criteria: ", util.inspect(newCriteria));
	    continue
	}

	if (prop === "searchString") {
	    // TODO
	    continue;
	}

	
	// those are the standard ones from search widgets.  Some browser-side code
	//    adds additional criteria; if so, use them directly
	newCriteria[prop] = originalCriteria[prop];
    }

    return newCriteria;
}

function handleDate(originalCriteria, nonDateCriteria) {

    let startDate = null;
    let endDate = null;
    if (originalCriteria.startDate) {
	startDate = new Date(originalCriteria.startDate);
    } else {
	startDate = new Date(); startDate.setYear(-10000);
    }
    if (originalCriteria.endDate) {
	endDate = new Date(originalCriteria.endDate);
    } else {
	endDate = new Date(); endDate.setYear(10000);
    }

    // now we have to handle the different item types differently
    let typeCriteria = [];

    if ((nonDateCriteria.type === undefined) || (nonDateCriteria.type === "Calendar") ||
	(nonDateCriteria.type.indexOf("Calendar") != -1))
    {
	typeCriteria.push(handleDateCalendar(startDate, endDate));
    }

    if ((nonDateCriteria.type === undefined) || (nonDateCriteria.type === "Todo") ||
	(nonDateCriteria.type.indexOf("Todo") != -1))
    {
	typeCriteria.push(handleDateTodo(startDate, endDate));
    }

    let doOther = false;
    if (nonDateCriteria.type === undefined) {   // if unspecified, accept all types
	doOther = true;
    } else if (Array.isArray(nonDateCriteria.type)) {
	for (let type of nonDateCriteria.type) {
	    if ((type != "Calendar") && (type != "Todo")) {
		doOther = true;
	    }
	}
    } else if ((nonDateCriteria.type != "Calendar") && (nonDateCriteria.type != "Todo")) {
	doOther = true;
    }

    if (doOther) {
	typeCriteria.push(handleDateOther(startDate, endDate));
    }
			  
    return { $or: typeCriteria, ...nonDateCriteria};
}

function handleDateCalendar(startDate, endDate) {
    // choose any item whose time window overlaps the search window
    return {"header.type": "Calendar", "details.startTime": {$lte: endDate}, "details.endTime": {$gte: startDate}};
}

function handleDateTodo(startDate, endDate) {
    return {"header.type": "Todo",
	    $and: [{"details.dueDate": {$gte: startDate}}, {"details.dueDate": {$lte: endDate}}]};
}

function handleDateOther() {
    return {$and: [{"header.type": {$ne: "Calendar"}}, {"header.type": {$ne: "Todo"}}]};
}

function doSearch(db, criteria, callback) {
    let cursor = db.collection('items').find(criteria);
    cursor.toArray(callback);      // this is asynchronous -- it is where DB access really happens
}

function searchRoute(req, res, next) {
    function searchCallback(err, results) {
        if (err) {
            console.log("search error: ", err);
            next(err);
            return;        // I'm not sure if next() ever returns....
        }
	console.log("search: returning", results.length, "items");
        for (let item of results) console.log(item.header.title);
        res.listOfItems = results;

	next();
    }

    let criteria = req.body;
    criteria = transformCriteria(criteria);
    console.log("search: final criteria:", util.inspect(criteria));
    doSearch(req.db, criteria, searchCallback);
}

module.exports = searchRoute;
