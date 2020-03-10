# HISS
Household Information SystemS - a web app for shared calendar, todo-list, etc.

HISS is designed to be shared among members of a household, although it can be used by other types of groups or by individuals.  It consists of items such as Calendar Items, Todo Items, Contact Items, etc.  Any member of the group can create items and they can be seen by all members.  Any item can be tagged with one or more members of the group (for example, to assign Todo Items).

Compared to other personal information apps, HISS excels in:

. Hierarchical tagging.  Every user-defined tag can have children tags.  When searching for a parent tag, any items tagged with a child tag will be found.  For example, Watering could be a child of Garden.  If the user searches for Garden, all Watering items would be found.

. Timeframes for the real world.  Users can assign a specific due date for a Todo Item, but if they prefer they can choose timeframes such as 'In a Few Days' or 'Someday'.  Such items will never be considered Overdue.

. Flexible Handling of Overdue Todo Items.  Some Todo Items, such as applying for a grant before the deadline, are moot if I don't accomplish them on time so they are never marked Overdue.  Other items, such as flea-treating my pet once a month, just roll over to be due the next day.  Still others, such as calling my Mom on her birthday, become Overdue after the due date and are brought to my attention as soon as I log on.

. Flexible Recurring Todo and Calendar Items.  One of my church groups meets on alternate Wednesdays, regardless of how many Wednesdays there are in a month.  Another happens on the 2nd and 4th Tuesdays of the month, even if there are three weeks between the 4th Tuesday of one month and the 2nd Tuesday of the next.  My class meets on Monday, Wednesday and Friday.  There are recurrence choices for all these situations.  There is also flexibility in how recurrence interacts with deadlines.  Paying bills is due on the 10th of evey month, even if I didn't get it done until the 13th last month.  But flea-treating my pet is due 4 weeks after I mark it Done even if it was three weeks overdue.

_Status_

HISS is not currently usable (2 Sep 2019).  I had a largely-functional version, but I have decided to recode from scratch to apply some programming philosophies I have been learning.  Once I get things working again I will welcome collaborators.
