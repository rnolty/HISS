function findAllAdmin(db, callback) {
    let cursor = db.collection('admin').find();
    cursor.toArray(callback);      // this is asynchronous -- it is where DB access really happens
}

function allAdminRoute(req, res, next) {
    function findAllAdminCallback(err, results) {
	if (err) {
	    console.log("allAdmin error: ", err);
	    next(err);
	} else {
	    res.jsonp(results);
	}
    }

    findAllAdmin(req.db, findAllAdminCallback);
}

module.exports = allAdminRoute;
