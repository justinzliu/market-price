//////////////////////////
//results.ejs javascript//
//////////////////////////

//global variables
var MAX_KEYSDISPLAYED = 9;
//var sort_wasPressed = [1,1,1];

//Set up event listeners on HTML page load
window.addEventListener('DOMContentLoaded', (event) => {
	//fetch and convert categories into array
	var categories = document.getElementById("categories").innerHTML;
	var categories_obj = JSON.parse(categories);
	var categories_lst = categories_obj.categories
	//fetch and convert results into JSON object
	console.log("DOM init");
	var result = document.getElementById("result").innerHTML;
	var result_objs = JSON.parse(result);
	initTables(categories_lst,result_objs)
});

//creates listeners for table rows
//called on initTables(), results in row highlighting when clicked
function createListenerROW(row) {
	row.onclick = function() {
		var table = document.getElementById("theTable");
		//var highlightRow = this.rowIndex;
		var rowsNotSelected = table.getElementsByTagName("tr");
	    for (var j=1; j<table.rows.length; j++) {
	    	rowsNotSelected[j].style.backgroundColor = "";
	    }
	    this.style.backgroundColor = "#00FFFF";
	}
}
//creates listeners for theTable category headers
//called on initTables(), results in lexicographical sorting entries by the category
function createListenerCOL(rowid, col) {
	col.onclick = function() {
		var headerRow = document.getElementById(rowid);
		var headerCols = headerRow.getElementsByTagName("td")
		//console.log(headerRow)
	    for (var j=0; j<headerCols.length; j++) {
	    	headerCols[j].style.backgroundColor = "";
	    	console.log(headerCols[j])
	    }
	    this.style.backgroundColor = "#00FFFF";
	    sortTableBy()
	}
}

//creates listeners for categoriesTable
//called on initTables(), results in lexicographical sorting entries by the category
function createListenerCategory(rowid, col, results) {
	col.onclick = function() {
		var headerRow = document.getElementById(rowid);
		var headerCols = headerRow.getElementsByTagName("td")
		//console.log(headerRow)
	    for (var j=0; j<headerCols.length; j++) {
	    	headerCols[j].style.backgroundColor = "";
	    	console.log(headerCols[j])
	    }
	    this.style.backgroundColor = "#00FFFF";
	}
}

//called on page load
function initTables(categories, results) {
	var table = document.getElementById("theTable");
	//insert categories as table headers
	var cat_row = table.insertRow(-1);
	cat_row.id = "tableHeader"
	for(var i=0; i<categories.length; i++){
		var col = cat_row.insertCell(-1);
		col.innerHTML = categories[i];
		//create listener for each category
		createListenerCOL(cat_row.id,col);
	}
	//insert results as entries in table
	for(var i=0; i<results.length; i++){
		var row = table.insertRow(-1);
		for(var j=0; j<categories.length; j++){
			var col = row.insertCell(-1);
			col.innerHTML = results[i][categories[j]];
		}
		createListenerROW(row);
	}
	//insert categories into categoriesTable
	var categoriesHeader = document.getElementById("categoriesHeader");
	for(var i=0; i<categories.length; i++){
		var col = categoriesHeader.insertCell(-1);
		col.innerHTML = categories[i];
		createListenerCategory("categoriesHeader",col,results);
	}
	//create histogram table
	var histogram = document.getElementById("histogram");
	var histData_obj = JSON.parse(document.getElementById("histData").innerHTML);
	var keys = Object.keys(histData_obj);
	var numCols = get_numCols(keys.length, MAX_KEYSDISPLAYED)
	var proportion_arr = getProportions(keys, histData_obj, numCols);
	for(var i=0; i<11; i++){
		var row = histogram.insertRow(-1);
		for(var j=0; j<numCols; j++){
			var col = row.insertCell(-1);
		}
	}
	lastRow = histogram.getElementsByTagName("tr")[10].cells;
	for(var j=0; j<numCols; j++){
		lastRow[j].innerHTML = keys[j];
		lastRow[j].style.fontSize = "xx-small";
	}
	colourHistogram(proportion_arr);
}

//calculates proportion of the items in a category
function getProportions(keys, histData, num_cols) {
	var prop_arr = new Array(num_cols).fill(0); //9 unique keys can be represented, the 10th key will be "other" and accrue any keys beyond 10
	var total_entries = 0;
	for(var i=0; i<keys.length; i++){
		total_entries += histData[keys[i]];
	}
	console.log(total_entries);
	var count_remaining = total_entries;
	for(var i=0; i<prop_arr.length-1; i++){
		var key_val = histData[keys[i]];
		prop_arr[i] = Math.floor(key_val/total_entries*100);
		count_remaining -= key_val;
	}
	prop_arr[prop_arr.length-1] = Math.floor(count_remaining/total_entries*100); //fill "other entry with remaining proportion"
	return prop_arr;
}

function get_numCols(num_keys, max_keysDisplayed) {
	if(num_keys > max_keysDisplayed){return max_keysDisplayed}
	return num_keys;
}

//colours histogram based on prop_arr
function colourHistogram(arr) {
	var table = document.getElementById("histogram");
	if (table != null) {
		var rows = table.getElementsByTagName("tr");
		var curr_percent = 10;
		for(var i=rows.length-2; i>-1; i--) {
			cols = rows[i].cells;
			for(var j=0; j<cols.length; j++) {
				if (curr_percent <= Math.round(arr[j]/10)*10) { //round to the nearest 10
					cols[j].style.backgroundColor = "#5397F3";
				}
				else {
					cols[j].style.backgroundColor = "#FFFFFF";
				}
			}
			curr_percent += 10;
		}
	}
}

//TODO: implement sorting on results
//called on any of sort option buttons press
function sortTableBy(btnID) {
	var table = document.getElementById("theTable");
	var tableArr = [[]];
	//copy table into array format
	for (var i=1; i<table.rows.length; i++) {
		var row = [];
		for (var j=0; j<table.rows[0].cells.length; j++) {
			row.push(table.rows[i].cells[j].innerHTML);
		}
		tableArr.push(row);
	}
	//determine which sort function to use
	switch(btnID) {
		case 0:
			if (sort_wasPressed[0]) {
				//sorting alphabetically
				tableArr.sort(function(a,b) {
					if (a[0]<b[0]) {
						return -1;
					}
					return 1;
				});
				sort_wasPressed[0] = 0;
			}
			else {
				//sorting reverse alphabetically
				tableArr.sort(function(a,b) {
					if (a[0]>b[0]) {
						return -1;
					}
					return 1;
				});
				sort_wasPressed[0] = 1;
			}
			break;
		case 1:
			if (sort_wasPressed[1]) {
				tableArr.sort(function(a,b) {
					if (a[0]<b[0]) {
						return -1;
					}
					return 1;
				});
				sort_wasPressed[1] = 0;
			}
			else {
				tableArr.sort(function(a,b) {
					if (a[0]>b[0]) {
						return -1;
					}
					return 1;
				});
				sort_wasPressed[1] = 1;
			}
			break;
		case 2:
			if (sort_wasPressed[2]) {
				tableArr.sort(function(a,b){return a[2]-b[2]});
				sort_wasPressed[2] = 0;
			}
			else {
				tableArr.sort(function(a,b){return b[2]-a[2]});
				sort_wasPressed[2] = 1;
			}
			break;
	}
	//write new values into table
	for (var i=1; i<table.rows.length; i++) {
		for (var j=0; j<table.rows[0].cells.length; j++) {
			table.rows[i].cells[j].innerHTML = tableArr[i][j];
		}
	}
}