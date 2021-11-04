///////////
//Globals//
///////////

const CONTAINER_ID = "tab-container";
const TAB_CLASS = "button";
const MAP_ID = "map";
const CRIME_CATEGORIES = ["Total, all violations", "Total violent Criminal Code", "Total property crime", "Total Criminal Code traffic violations", "Total drug violations"]
const CRIME_TBL_HEADERS = ["Unit of Measurement", "Municipality", "Province/State", "Country"]
const CRIME_TTL_CLASSES = ["col-sm-2", "border-bottom", "table-title"]
var map;
var geocoder;

/////////////
//Functions//
/////////////

function create_tab_listener(tab_id) {
	var tab = document.getElementById(tab_id);
	tab.onclick = function() {
		let tab_content = document.querySelectorAll(".tab-content")
		for(let i = 0; i<tab_content.length; i++) {
			tab_content[i].style.display = "none"
		}
		let selected_content = document.getElementById(tab_id.replace(/^btn/,'tab'))
		selected_content.style.setProperty("display", "block")
	}
}

function create_table(tbl_title, tbl_header, tbl_rows, title_classes=[], tbl_id=null, tbl_classes=[]) {
	let table = document.createElement("table");
	//set table id
	if(tbl_id){
		table.setAttribute("id", tbl_id);
	}
	//add table classes
	if(tbl_classes.length){
		table.classList.add(...tbl_classes);
	}
	//add title to table
	let title = document.createElement("div");
	if(title_classes.length){
		title.classList.add(...title_classes);
	}
	title.appendChild(document.createTextNode(tbl_title));
	table.appendChild(title);
	//add header to table
	let header = document.createElement("thead");
	let row = document.createElement("tr")
	for(let i = 0; i<tbl_header.length; i++){
		let col = document.createElement("th");
		col.setAttribute("scope", "col");
		col.appendChild(document.createTextNode(tbl_header[i]))
		row.appendChild(col)
	}
	header.appendChild(row)
	table.appendChild(header);
	//add rows to table
	for(let i = 0; i<header.length; i++){

	}
	return table
}

function initMap() {
	const address = "Burnaby, BC, Canada"
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: address}).then(({results}) => {
		map = new google.maps.Map(document.getElementById(MAP_ID), {
		center: results[0].geometry.location,
		zoom: 8,
		});
	}).catch((e) => alert("Geocode was not successful for the following reason: " + e)
	);
}

function geocodeAddress(geocoder, resultsMap) {
	//const address = document.getElementById("address").value;
	const address = "Burnaby"
	geocoder.geocode({ address: address }).then(({ results }) => {
		resultsMap.setCenter(results[0].geometry.location);
		new google.maps.Marker({
		  map: resultsMap,
		  position: results[0].geometry.location,
		});
	  })
	  .catch((e) =>
		alert("Geocode was not successful for the following reason: " + e)
	  );
  }

//////////
///Main///
//////////

window.addEventListener('DOMContentLoaded', (event) => {
	//create tab listeners
	let tabs = document.getElementsByTagName(TAB_CLASS);
	for(let i = 0; i<tabs.length; i++){
		create_tab_listener(tabs[i].id)
	}
	//create crime tables
	document.getElementById("tab-crime").appendChild(create_table("TITLE", CRIME_TBL_HEADERS, ["TEST1", "TEST2", "TEST3"], title_classes=CRIME_TTL_CLASSES, tbl_id="TEST"))
});

