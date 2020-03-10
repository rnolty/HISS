var express = require('express');
var router = express.Router();

/******************** Getters ********************/
var allAdminRoute = require('./HISSdb/allAdmin');
router.get("/allAdmin", allAdminRoute);

var allTagsRoute = require('./HISSdb/allTags');
router.get("/allTags", allTagsRoute);

// search parameters are in the POST body
var searchRoute = require('./HISSdb/search');
router.post("/search", searchRoute);

var findTimeFrameTodosRoute = require('./HISSdb/findTimeFrameTodos');
router.get("/findTimeFrameTodos", findTimeFrameTodosRoute);

var findOverdueTodosRoute = require('./HISSdb/findOverdueTodos');
router.get("/findOverdueTodos", findOverdueTodosRoute)

/******************** Setters ********************/
var addItemRoute = require('./HISSdb/addItem');
router.post("/addItem", addItemRoute);

var updateItemRoute = require('./HISSdb/updateItem');
router.post("/updateItem", updateItemRoute);

var linkItemsRoute = require('./HISSdb/linkItems');
router.post("/linkItems", linkItemsRoute);

var deleteItemRoute = require('./HISSdb/deleteItem');
router.post("/deleteItem", deleteItemRoute);

var addTagRoute = require('./HISSdb/addTag');
router.post("/addTag", addTagRoute);

var updateTagRoute = require('./HISSdb/updateTag');
router.post("/updateTag", updateTagRoute);

var deleteTagRoute = require('./HISSdb/deleteTag');
router.post("/deleteTag", deleteTagRoute);

/************* Additional Middleware *************/
function massageItem(item) {
    // move the mongo ID into the header
    if (item && item.header) {               // skip any malformed items that got into DB
        item.header.id = item._id;
        delete item._id;
    }

    // if date is intrinsic to an item, populate header.date
    if (item && item.details && item.details.dueDate && item.header) {
	item.header.date = item.details.dueDate;
    } else if (item && item.details && item.details.startTime && item.header) {
	item.header.date = item.details.startTime;
    }

    // if a todo item is overdue, flag it
    delete item.overdue;   // in case this ephemeral value accidentally got stored in DB
    if (item && item.header && (item.header.type === "Todo")) {
	if (item.details &&(! item.details.done) && (item.details.ifOverdue == "P1") &&
            item.details.dueDate)
	{
            let today = new Date();
            today.setHours(0,0,0,0);       // TODO: use client's timezone
            if (item.details.dueDate < today) {
	        item.overdue = true;
            }
	}
    }
}

function massageTag(tag) {
    tag.id = tag._id;
    delete tag._id;
}

function massageResults(req, res, next) {
    // our DB function return either an item or a list of items
    if (res.listOfItems) {
	res.listOfItems.forEach(massageItem);
	res.json(res.listOfItems);
	return;   // don't call next(); response finished (next thing in chain is 404 handler)
    } else if (res.item) {
	massageItem(res.item);
	res.json(res.item);
	return;
    } else if (res.listOfTags) {
	res.listOfTags.forEach(massageTag);
	res.json(res.listOfTags);
	return;
    } else if (res.tag) {
	massageTag(res.tag);
	res.json(res.tag);
	return;
    }

    // any route that wants to return something else should return it and not call next(), so
    //    this middleware doesn't get called.  If we get here, req has not been handled.
    next();
}

// this must go after all the routes
router.use(massageResults);

module.exports = router;
