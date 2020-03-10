function findOverdueTodos(db, callback) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let cursor = db.collection('items').find({"header.type": "Todo", "details.done": false,
					  "details.dueDate": {$lt: today}, "details.ifOverdue": {$ne: "P3"}});
    cursor.toArray(callback);      // this is asynchronous -- it is where DB access really happens
}

function findOverdueTodosRoute(req, res, next) {
    function findOverdueTodosCallback(err, results) {
	if (err) {
	    console.log("findOverdueTodos error: ", err);
	    next(err);
	} else {
	    console.log("findOverdueTodos: returning", results.length, "items");
	    res.listOfItems = results;
	    next();
	}
    }

    findOverdueTodos(req.db, findOverdueTodosCallback);
}

module.exports = findOverdueTodosRoute;
