// This is called either from updateItem, when a recurring item is newly marked as done, or
//    recurP3s daily cron job, for recurring P3s that would be overdue.

// This does not figure out if items should recur; that should be done by whatever
//    calls this.

function recurTodos(db, list) {
    var changedItems = [];
    const today = new Date();       // TODO: mess with timezones -- make due date @ time 23:59 local
    for (let item of list) {
	if (item.header.type !== "Todo") continue;
	if (item.details.recur === "None") continue;

	if (item.details.recur === "Daily") {
	    item.details.dueDate.setDate(item.details.dueDate.getDate() + 1);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed daily item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "Weekdays") {
	    item.details.dueDate.setDate(item.details.dueDate.getDate() + 1);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    if (item.details.dueDate.getDay() === 0) {                         // Sunday
		item.details.dueDate.setDate(item.details.dueDate.getDate() + 1);
	    } else if (item.details.dueDate.getDay() === 7) {                   // Saturday
		item.details.dueDate.setDate(item.details.dueDate.getDate() + 2);
	    }
	    changedItems.push(item);
	    console.log("recur: changed weekday item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "Weekly") {
	    item.details.dueDate.setDate(item.details.dueDate.getDate() + 7);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed weekly item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "Biweekly") {
	    item.details.dueDate.setDate(item.details.dueDate.getDate() + 14);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed biweekly item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "DateOfMonth") {
	    item.details.dueDate.setMonth(item.details.dueDate.getMonth() + 1);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed monthly(date) item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "WeekOfMonth") {
	    // TODO: count weeks; handle 5th week events
	    item.details.dueDate.setDate(item.details.dueDate.getDate() + 28);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed monthly(week) item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "Quarterly") {
	    item.details.dueDate.setMonth(item.details.dueDate.getMonth() + 3);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed quarterly item to", item.details.dueDate);
	    continue;
	} else if (item.details.recur === "Annually") {
	    item.details.dueDate.setYear(item.details.dueDate.getYear() + 1);
	    if (item.details.dueDate < today) item.details.dueDate = today;
	    changedItems.push(item);
	    console.log("recur: changed annual item to", item.details.dueDate);
	    continue;
	} else {
	    console.log("recur: unknown recurrence type", item.details.recur);
	}
    }
    return changedItems;
}

module.exports = recurTodos;
