import {ObjectId} from 'mongodb';

function updateTag(tag, id, db, callback) {
    db.collection('tags').replaceOne({_id: id}, tag).then(callback);
}

function updateTagRoute(req, res, next) {
    let tag = req.body;
    console.log("updateTagRoute: tag in", tag);
    const id = ObjectId(tag.id);
    if (id === undefined) {
	console.log("updateTagRoute: called with tag with no ID",tag);
	next(Error("updateTagRoute called with tag with no ID"));
    }
    delete(tag.id);

    // replaceOne returns (via Promise) a little object giving the results
    function updateTagCallback(result) {
        if (result.matchedCount === 1) {
            res.jsonp(tag);
        } else {
            next(Error("tag " + id + " not in DB"), null);
	}
    }

    updateTag(tag, id, req.db, updateTagCallback);
}

module.exports = updateTagRoute;

