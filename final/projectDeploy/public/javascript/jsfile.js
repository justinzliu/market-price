//////////////////////////
//results.ejs javascript//
//////////////////////////

//global variables
var sort_wasPressed = [1,1,1];

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
	//console.log(categories_lst[0])
	//console.log(result_objs[0])
	//console.log(result_objs[0][categories_lst[0]])
	//init theTable
	initTables(categories_lst,result_objs)
	/*
	if (table != null) {
		for(var i=1; i<table.rows.length; i++) {
			rowsNotSelected[i].onclick = function() {
				var table = document.getElementById("theTable");
	    		var highlightRow = this.rowIndex;
    			var rowsNotSelected = table.getElementsByTagName("tr");
			    for (var j=1; j<table.rows.length; j++) {
			    	rowsNotSelected[j].style.backgroundColor = "";
			    }
			    this.style.backgroundColor = "#00FFFF";
			}
		}

	}
	*/
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
}
	
/*
	var col2 = row.insertCell(1);
	var col3 = row.insertCell(2);
	col1.innerHTML = document.getElementById("Name").value;
	col2.innerHTML = document.getElementById("Email").value;
	col3.innerHTML = document.getElementById("Age").value;
	updateAverage();
	createListener(row);
	else {
		alert("INVALID INPUT!");
	}
	clearInputs();
}
*/

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

//called on insert()
function clearInputs() {
	var name = document.getElementById("Name");
	var email = document.getElementById("Email");
	var age = document.getElementById("Age");
	name.value = "";
	email.value = "";
	age.value = "";
}

//called on insert()
function isValidInputs() {
	var name = document.getElementById("Name").value;
	var email = document.getElementById("Email").value;
	var age = document.getElementById("Age").value;
	if (name == "" || email == "" || age == "" || email.includes("@") == false || email.includes(".") == false) {
		return 1;
	}
	return 0;
}
