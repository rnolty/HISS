const {ObjectId} = require('mongodb');

async function addTagRoute(req, res, next) {
    function handleError(err) {
        console.log("addTag: Got error",err);
        next(new Error(error));
    }

    let tag = req.body;
    console.log("addTagRoute tag in:", tag);
    function addTagCallback(results) {
	if (results.acknowledged) {
            tag._id = results.insertedId;
	    res.tag = tag;
            console.log("OK");
	    next();
            return;
	}

        next(Error("addTag: " + results));
    }

    delete tag.id;               // just in case browser code added an ID
    if (! (tag.parent === 1)) {    // there is a special top-level tag with a special ID
        tag.parent = ObjectId(tag.parent);
    }

    // function verifyParent(parent) {
    //     if (parent) {
    //         db.collection('tags').insertOne(tag).then(addTagCallback);
    //         return;
    //     }
    //     next(Error("addTag: unknown parent " + tag.parent));
    // }

    // db.collection('tags').findOne({_id: tag.parent}).then(verifyParent);
    let parent = await req.db.collection('tags').findOne({_id: tag.parent}).catch((e) => handleError(e));
    if (parent) {
        req.db.collection('tags').insertOne(tag).then(addTagCallback);
        return;
    }
    handleError("addTag: unknown parent " + tag.parent);
}


module.exports = addTagRoute;
