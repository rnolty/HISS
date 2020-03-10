function findTimeFrameTodos(db, callback) {
    let cursor = db.collection('items').find({"header.type": "Todo", "details.done": false,
					  "details.timeFrame": {$ne: "dueDate"}});
    cursor.toArray(callback);      // this is asynchronous -- it is where DB access really happens
}

function findTimeFrameTodosRoute(req, res, next) {
    function findTimeFrameTodosCallback(err, results) {
	if (err) {
	    console.log("findTimeFrameTodos error: ", err);
	    next(err);
	} else {
	    console.log("findTimeFrameTodos: returning", results.length, "items");
	    res.listOfItems = results;
	    next();
	}
    }

    findTimeFrameTodos(req.db, findTimeFrameTodosCallback);
}

module.exports = findTimeFrameTodosRoute;
