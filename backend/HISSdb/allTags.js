function findAllTags(db, callback) {
    let cursor = db.collection('tags').find();
    cursor.toArray(callback);      // this is asynchronous -- it is where DB access really happens
}

function allTagsRoute(req, res, next) {
    function findAllTagsCallback(err, results) {
	if (err) {
	    console.log("allTags error: ", err);
	    next(err);
	} else {
	    res.listOfTags = results;
	}
	next();
    }

    findAllTags(req.db, findAllTagsCallback);
}

module.exports = allTagsRoute;
