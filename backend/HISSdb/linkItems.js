const {ObjectId} = require('mongodb');

function linkItems(id1, id2, db, callback) {

    function _localCallback(err, results) {
	//console.log("linkItems._localCallback results:", results);
	if (results.length != 2) {
	    callback("linkItems call failed", null);
	    return;
	}
	let item1, item2;
        // don't know why toHexString() is necessary here, but it certainly didn't match without it
	if (results[0]._id.toHexString() === id1.toHexString()) {
	    item1 = results[0];
	    item2 = results[1];
	    console.log('a', item1._id, item1.header.links, item2._id, item2.header.links);
	} else if (results[1]._id.toHexString() === id1.toHexString()) {
	    item1 = results[1];
	    item2 = results[0];
	    console.log('b', item1._id, item1.header.links, item2._id, item2.header.links);
	} else {
            throw Error("results mismatch");
        }

	//if (item1.header && item1.header.links && (item1.header.links.indexOf(id2) === -1)) 
        var id, linkFound;
        linkFound = false;
        // prevents linking item to self -- front end won't ask such, but for completeness
        if (id2.toHexString() === item1._id.toHexString()) linkFound = false;
        for (id of item1.header.links) {
            if (id.toHexString() === id2.toHexString()) linkFound = true;
        }
        if (!linkFound) {
	    item1.header.links.push(id2);
	}
        //if (item2.header && item2.header.links && (item2.header.links.indexOf(id1) === -1)) {
        linkFound = false;
        // prevents linking item to self -- front end won't ask such, but for completeness
        if (id1.toHexString() === item2._id.toHexString()) linkFound = false;
        for (id of item2.header.links) {
            if (id.toHexString() === id1.toHexString()) linkFound = true;
        }
        if (!linkFound) {
	    item2.header.links.push(id1);
	}
	console.log('c', item1._id, item1.header.links, item2._id, item2.header.links);

	// originally I tried doing the callback before the updateOne's, hoping to give http response
	//    that much faster.  But it appears control never returned from callback()
	function _tmpCallback(err, results) {/* console.log(results.result.n);*/ }
	db.collection('items').updateOne({_id: item1._id}, {$set: {"header.links": item1.header.links}}, _tmpCallback);
	db.collection('items').updateOne({_id: item2._id}, {$set: {"header.links": item2.header.links}}, _tmpCallback);

	callback(null, [item1, item2]);
    }
    const criteria = {_id: {$in: [ObjectId(id1), ObjectId(id2)]}};
    //console.log(criteria);
    db.collection('items').find(criteria).toArray(_localCallback);
}

function linkItemsRoute(req, res, next) {

    const id1 = ObjectId(req.body.id1);
    const id2 = ObjectId(req.body.id2);
    console.log("linkItems", id1, id2);

    function linkItemsCallback(err, results) {
 	if (err) {
 	    console.log("linkItems error: ", err);
 	    next(err);
 	} else {
	    let retval = [];
	    for (const item of results) {
		if (item && item.header) {
		    item.header.id = item._id;
		    delete item._id;
		}
		retval.push(item);
	    }
	    res.jsonp(retval);
	    //console.log("linked",retval);
	}
    }

     linkItems(id1, id2, req.db, linkItemsCallback);
}

module.exports = linkItemsRoute;
