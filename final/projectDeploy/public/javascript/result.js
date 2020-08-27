//global variables
var sort_wasPressed = [1,1,1];

//Set up event listeners on HTML page load
window.addEventListener('DOMContentLoaded', (event) => {
	var table = document.getElementById("theTable");
	var rowsNotSelected = table.getElementsByTagName("tr");
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
});

//called on insert()
function createListener(row) {
	row.onclick = function() {
		var table = document.getElementById("theTable");
		var highlightRow = this.rowIndex;
		var rowsNotSelected = table.getElementsByTagName("tr");
	    for (var j=1; j<table.rows.length; j++) {
	    	rowsNotSelected[j].style.backgroundColor = "";
	    }
	    this.style.backgroundColor = "#00FFFF";
	}
}

//called on insert()
function updateAverage() {
	var table = document.getElementById("theTable");
	var avg = 0;
	for (var i = 1; i<table.rows.length; i++) {
		avg += parseInt(table.rows[i].cells[2].innerHTML);
	}
	avg = avg/(table.rows.length-1); //table has one additional row for column names (row 0)
	document.getElementById("averageAgeText").innerHTML = "The average age of all users is: " + avg.toFixed(2);
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

//called on submit buttom press
function insert() {
	if (isValidInputs() == 0) {
		var table = document.getElementById("theTable");
		var row = table.insertRow(-1);
		var col1 = row.insertCell(0);
		var col2 = row.insertCell(1);
		var col3 = row.insertCell(2);
		col1.innerHTML = document.getElementById("Name").value;
		col2.innerHTML = document.getElementById("Email").value;
		col3.innerHTML = document.getElementById("Age").value;
		updateAverage();
		createListener(row);
	}
	else {
		alert("INVALID INPUT!");
	}
	clearInputs();
}

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
