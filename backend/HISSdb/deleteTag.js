const {ObjectId} = require('mongodb');

function deleteTag(id, db, callback) {
    db.collection('tags').deleteOne({_id: id}, callback);
}

function deleteTagRoute(req, res, next) {
    let id = ObjectId(req.body.id);

    function deleteTagCallback(err, results) {
	if (err) {
	    console.log("deleteTagCallback error: ", err);
	    next(err);
	} else if (results.result.ok != 1) {
	    console.log("deleteTagCallback found no object", id);
	    res.json({deleted: null});
	} else {
	    console.log("tag", id, "deleted");
	    res.json({deleted: id});
	}
    }

    deleteTag(id, req.db, deleteTagCallback);
}

module.exports = deleteTagRoute;
