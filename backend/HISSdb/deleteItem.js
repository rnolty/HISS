const {ObjectId} = require('mongodb');

function deleteItem(id, db, callback) {
    db.collection('items').deleteOne({_id: id}, callback);
}

function deleteItemRoute(req, res, next) {
    let id = ObjectId(req.body.id);
    function deleteCallback(err, results) {
        if (err) {
            console.log("delete error: ", err);
            next(err);
        } else if (results.result.ok != 1) {
	    console.log("delete found no object", id);
	    res.jsonp({deleted: null});
	} else {
	    console.log(id, "deleted");
	    res.jsonp({deleted: id});
	}
    }

    deleteItem(id, req.db, deleteCallback);
}

module.exports = deleteItemRoute;
