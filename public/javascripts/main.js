///////////
//Globals//
///////////

//<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC0YiNK4ltKqEjgqLmphbAPRAvRePvRefY&callback=initMap&libraries=&v=weekly" async></script>

const CONTAINER_ID = "tab-container";
const TAB_CLASS = "button";
const MAP_ID = "map";
const TBL_CLASSES = ["table", "table-striped"];
const SUBTBL_CLASSES = ["table-plain"];
const TTL_CLASSES = ["col-sm-12", "border-bottom", "table-title"];
const TAB_IDS = {"crimes": "tab-crimes", "census": "tab-census", "schools": "tab-schools"};
const TBL_EXCLUDE = ["loc_id", "retrieved", "year"];

var map;
var geocoder;

const SCHOOLS_TTLS = ["Elementary Schools", "Secondary Schools"];
const SCHOOLS_TBL_COL_HEADERS = ["", "Name", "Score", "Rank", "Address"];
const SCHOOLS_TBL_ROW_HEADERS = [];
const SCHOOLS_TBL_CAPTIONS = ["Data retrieved from: ", "Data retrieved on: "];

const CRIMES_TTLS = ["Total, all violations", "Total violent Criminal Code", "Total property crime", "Total Criminal Code traffic violations", "Total drug violations"];
const CRIMES_TBL_COL_HEADERS = ["Unit of Measurement", "Municipality", "Province/State", "Country"];
const CRIMES_TBL_ROW_HEADERS = [{"incidents": "Incidents"}, {"rate": "Rate Per 100,000 Population"}, {"change": "% Change Previous Year"}];
const CRIMES_TBL_CAPTIONS = ["Total, all violations may include other criminal offence categories not encompassed on this page, for brevity.", "Data retrieved from: ", "Data retrieved on: "];

const CENSUS_TTLS = ["Census Summary"];
const CENSUS_TBL_COL_HEADERS = ["Category", "Municipality", "Province/State", "Country"];
const CENSUS_TBL_ROW_HEADERS = [{"avgAge": "Average Age"}, {"ageGroups": "Age Groups"}, {"avgHouseIncome": "Average Household Income"}, {"avgIncome": "Average Income"}, {"population": "Population"}, {"demographics": "Demographics"}];
const CENSUS_TBL_CAPTIONS = ["table note to be added", "Data retrieved from: ", "Data retrieved on: "];

/////////////////////////
/// General Functions ///
/////////////////////////

function create_tab_listener(tab_id) {
	var tab = document.getElementById(tab_id);
	tab.onclick = function() {
		let tab_content = document.querySelectorAll(".tab-content")
		for(let i=0; i<tab_content.length; i++) {
			tab_content[i].style.display = "none"
		}
		let selected_content = document.getElementById(tab_id.replace(/^btn/,'tab')) //btn-tabname -> tab-tabname
		selected_content.style.setProperty("display", "block")
	}
}

function create_table(tbl_col_header, tbl_row_header, tbl_cells, tbl_classes=[], captions=[]) {
	let table = document.createElement("table");
	table.setAttribute("style", "width:100%;");
	//add table classes
	if(tbl_classes.length) {
		table.classList.add(...tbl_classes);
	}
	//add header to table
	let header = document.createElement("thead");
	let row = document.createElement("tr");
	for(let i=0; i<tbl_col_header.length; i++) {
		let col = document.createElement("th");
		col.setAttribute("scope", "col");
		col.appendChild(document.createTextNode(tbl_col_header[i]));
		row.appendChild(col);
	}
	header.appendChild(row);
	table.appendChild(header);
	let body = document.createElement("tbody");
	//add rows to table
	for(let i=0; i<tbl_row_header.length; i++) { //row
		let row = document.createElement("tr");
		let row_header = document.createElement("th");
		row_header.setAttribute("scope", "row");
		row_header.appendChild(document.createTextNode(tbl_row_header[i]));
		row.appendChild(row_header);
		//row subheaders
		if(!Array.isArray(tbl_cells[i])) {
			row_header.setAttribute("colspan", tbl_col_header.length);
			body.appendChild(row); //append main header
			/*
			//nested table approach (removed as cols cannot be lined to parent table cols)
			let sub_row = document.createElement("tr");
			let sub_col = document.createElement("td");
			sub_col.setAttribute("colspan", tbl_col_header.length);
			sub_row.appendChild(sub_col);
			let sub_headers = Object.keys(tbl_cells[i]);
			//convert format dictionary to table cells
			let sub_tbl_cells = [];
			for(let j=0; j<sub_headers.length; j++) {
				sub_tbl_cells.push(tbl_cells[i][sub_headers[j]]);
			}
			sub_col.appendChild(create_table(tbl_col_header, sub_headers, sub_tbl_cells, SUBTBL_CLASSES, []));
			body.appendChild(sub_row);
			*/
			let sub_headers = Object.keys(tbl_cells[i]);
			for(let j=0; j<sub_headers.length; j++) { //row
				let row = document.createElement("tr");
				let row_header = document.createElement("th");
				row_header.setAttribute("scope", "row");
				row_header.setAttribute("style", "padding-left: 3em;")
				row_header.appendChild(document.createTextNode(sub_headers[j]));
				row.appendChild(row_header);
				for(let k=0; k<tbl_cells[i][sub_headers[j]].length; k++) {
					let cell = document.createElement("td");
					cell.appendChild(document.createTextNode(tbl_cells[i][sub_headers[j]][k]));
					row.appendChild(cell);
				}
				body.appendChild(row);
			}
			
		}
		//no row subheaders
		else {
			for(let j=0; j<tbl_cells[0].length; j++) { //col
				let cell = document.createElement("td");
				cell.appendChild(document.createTextNode(tbl_cells[i][j]));
				row.appendChild(cell);
			}
			body.appendChild(row);
		}
	}
	//add captions to table
	let caption = document.createElement("caption");
	if(captions.length) {
		let paragraph = document.createElement("p");
		for(let i=0; i<captions.length; i++) {
			paragraph.appendChild(document.createTextNode(captions[i]));
			paragraph.appendChild(document.createElement('br'));
		}
		caption.appendChild(paragraph);
	}
	table.appendChild(body);
	table.appendChild(caption);
	return table;
}

function create_map(tab_id, api_key) {
	var tab = document.getElementById(tab_id);
	var script = document.createElement("script");
	script.src = "https://maps.googleapis.com/maps/api/js?key=" + api_key + "&callback=initMap&libraries=&v=weekly";
	script.async = true;
	tab.appendChild(script);
}

//supports lists and dictionaries
function unserialize(str) {
	let list_pattern = /^(\[).*(\])$/g;
	if (list_pattern.exec(str)) {
		return JSON.parse(str);
	}
	let dict_pattern = /^(\{).*(\})$/g;
	if (dict_pattern.exec(str)) {
		return JSON.parse(str.replaceAll(":", ": ")); //TODO: review custom serializer in webscraper to see if replace step may be omitted.
	}
	return str;
}

/////////////////////
/// Tab Functions ///
/////////////////////

function schoolsTab_setup(titles, ttl_classes, tbl_col_headers, row_headers, tbl_data, tbl_classes, tbl_captions) {
	if(false) {
		throw "schoolstab_setup: invalid inputs";
	}
	//format tbl_data
	let formatted_data = schoolsTab_formatData(titles, tbl_data);
	console.log(formatted_data)
	//TODO: data retrieved from: to be added when source details are added
	tbl_captions[2] = tbl_captions[2] + formatted_data["year"];
	//create tables
	let tab = document.getElementById("tab-"+"schools");
	for(let i=0; i<titles.length; i++) {
		//add table title
		let title = document.createElement("div");
		if(ttl_classes.length){
			title.classList.add(...ttl_classes);
		}
		title.appendChild(document.createTextNode(titles[i]));
		tab.appendChild(title);
		tab.appendChild(create_table(tbl_col_headers, Array.from(Array(formatted_data[titles[i]].length), () => [""]), formatted_data[titles[i]], tbl_classes, tbl_captions));
	}
}

function schoolsTab_formatData(titles, tbl_data) {
	//table cells formatted to: school type - <entries> x location type
	let location_types = Object.keys(tbl_data);
	let formatted_data = {};
	for(let i=0; i<titles.length; i++) {
		//keys are by school type: elementary or secondary
		formatted_data[titles[i]] = [];
		for(let j=0; j<location_types.length; j++) {
			//TODO: use array prototype method map() to clean up array logic
			//tbl_data[].map();
			for(let k=0; k<tbl_data[location_types[j]].length; k++) {
				let school_type = titles[i].split(" ")[0];
				if(tbl_data[location_types[j]][k].type == school_type) {
					let school = [tbl_data[location_types[j]][k].name, tbl_data[location_types[j]][k].score, tbl_data[location_types[j]][k].rank, tbl_data[location_types[j]][k].address];
					formatted_data[titles[i]].push(school);
				}
			}
		}
	}
	return formatted_data;
}

//TODO: may be able to create a general setup function
function censusTab_setup(titles, ttl_classes, tbl_col_headers, row_headers, tbl_data, tbl_classes, tbl_captions) {
	if(false) {
		throw "censustab_setup: invalid inputs";
	}
	//format tbl_data
	let row_keys = row_headers.map((header) => {
		let key = Object.keys(header)[0];
		return key;
	});
	let tbl_row_headers = row_headers.map((header) => {
		let key = Object.keys(header)[0];
		return header[key];
	});
	let formatted_data = censusTab_formatData(titles, row_keys, tbl_data);
	//TODO: data retrieved from: to be added when source details are added
	tbl_captions[2] = tbl_captions[2] + formatted_data["year"];
	//create tables
	let tab = document.getElementById("tab-"+"census");
	for(let i=0; i<titles.length; i++) {
		//add table title
		let title = document.createElement("div");
		if(ttl_classes.length){
			title.classList.add(...ttl_classes);
		}
		title.appendChild(document.createTextNode(titles[i]));
		tab.appendChild(title);
		tab.appendChild(create_table(tbl_col_headers, tbl_row_headers, formatted_data[titles[i]], tbl_classes, tbl_captions));
	}
}

//format census data into table cell format
function censusTab_formatData(titles, row_keys, tbl_data) {
	//table cells formatted to: category x location type
	let location_types = Object.keys(tbl_data);
	let formatted_data = {"year": tbl_data["city"]["year"]};
	for(let i=0; i<titles.length; i++) {
		formatted_data[titles[i]] = Array.from(Array(row_keys.length), () => []);
		for(let j=0; j<location_types.length; j++) {		
			for(let k=0; k<row_keys.length; k++) {
				//TODO: use array prototype method map() to clean up array logic
				//tbl_data[].map();
				let value = unserialize(tbl_data[location_types[j]][row_keys[k]]); //census reports may contain serialized dictionaries
				if(value instanceof Object) {
					let sub_keys = Object.keys(value);
					//subheaders have not been created
					if(Array.isArray(formatted_data[titles[i]][k])) {
						let sub_rows = {};
						for(let l=0; l<sub_keys.length; l++) {
							sub_rows[sub_keys[l]] = [value[sub_keys[l]]];
						}
						formatted_data[titles[i]][k] = sub_rows;
					}
					//subheaders have already been created
					else {
						for(let l=0; l<sub_keys.length; l++) {
							formatted_data[titles[i]][k][sub_keys[l]].push(value[sub_keys[l]]);
						}
					}
				}
				else {
					formatted_data[titles[i]][k].push(value);
				}
			}
		}
	}
	return formatted_data;
}

function crimesTab_setup(titles, ttl_classes, tbl_col_headers, row_headers, tbl_data, tbl_classes, tbl_captions) {
	if(false) {
		throw "crimestab_setup: invalid inputs";
	}
	//format tbl_data
	let row_keys = row_headers.map((header) => {
		let key = Object.keys(header)[0];
		return key;
	});
	let tbl_row_headers = row_headers.map((header) => {
		let key = Object.keys(header)[0];
		return header[key];
	});
	let formatted_data = crimesTab_formatData(titles, row_keys, tbl_data);
	//create tables
	let tab = document.getElementById("tab-"+"crimes");
	//TODO: data retrieved from: to be added when source details are added
	tbl_captions[2] = tbl_captions[2] + formatted_data["year"];
	for(let i=0; i<titles.length; i++) {
		//add table title
		let title = document.createElement("div");
		if(ttl_classes.length){
			title.classList.add(...ttl_classes);
		}
		title.appendChild(document.createTextNode(titles[i]));
		tab.appendChild(title);
		if(i==titles.length-1) {
			tab.appendChild(create_table(tbl_col_headers, tbl_row_headers, formatted_data[titles[i]], tbl_classes, tbl_captions));
		}
		else {
			tab.appendChild(create_table(tbl_col_headers, tbl_row_headers, formatted_data[titles[i]], tbl_classes, []));
		}
	}
}

//format crimes data into separate tables
function crimesTab_formatData(titles, row_keys, tbl_data) {
	//table cells formatted to: violation - unit of measurement x location type
	let location_types = Object.keys(tbl_data);
	let formatted_data = {"year": tbl_data["city"][0]["year"]};
	for(let i=0; i<titles.length; i++) {
		//keys are by violations
		formatted_data[titles[i]] = Array.from(Array(row_keys.length), () => []);
		for(let j=0; j<location_types.length; j++) {
			//TODO: use array prototype method map() to clean up array logic
			//tbl_data[].map();
			for(let k=0; k<titles.length; k++) {
				if(tbl_data[location_types[j]][k].violations == titles[i]) {
					formatted_data[titles[i]][0].push(tbl_data[location_types[j]][k][row_keys[0]]); //incidents
					formatted_data[titles[i]][1].push(tbl_data[location_types[j]][k][row_keys[1]]); //rate
					formatted_data[titles[i]][2].push(tbl_data[location_types[j]][k][row_keys[2]]); //% change
				}
			}
		}
	}
	return formatted_data;
}

/*
function censusTab_formatData(titles, row_headers, tbl_data) {
	//table cells formatted to: category x location type
	let row_keys = Object.keys(row_headers);
	let location_types = Object.keys(tbl_data);
	let formatted_data = {};
	for(let i=0; i<titles.length; i++) {
		formatted_data[titles[i]] = Array.from(Array(row_keys.length), () => []);
		for(let j=0; j<location_types.length; j++) {		
			for(let k=0; k<row_keys.length; k++) {
				//TODO: use array prototype method map() to clean up array logic
				//tbl_data[].map();
				let value = unserialize(tbl_data[location_types[j]][row_keys[k]]); //census reports may contain serialized dictionaries
				formatted_data[titles[i]][k].push(value); 
			}
		}
	}
	return formatted_data;
}
*/

//format crimes data into separate tables
function dataToTable(titles, row_keys, tbl_data) {
	//table cells formatted to: violation - unit of measurement x location type
	let location_types = Object.keys(tbl_data);
	let formatted_data = {};
	for(let i=0; i<titles.length; i++) {
		//keys are by violations
		formatted_data[titles[i]] = Array.from(Array(row_keys.length), () => []);
		for(let j=0; j<location_types.length; j++) {
			//TODO: use array prototype method map() to clean up array logic
			//tbl_data[].map();
			for(let k=0; k<titles.length; k++) {
				if(tbl_data[location_types[j]][k].violations == titles[i]) {
					formatted_data[titles[i]][0].push(tbl_data[location_types[j]][k][row_keys[0]]); //incidents
					formatted_data[titles[i]][1].push(tbl_data[location_types[j]][k][row_keys[1]]); //rate
					formatted_data[titles[i]][2].push(tbl_data[location_types[j]][k][row_keys[2]]); //% change
				}
			}
		}
	}
	return formatted_data;
}

////////////////////////////
/// GoogleMaps Functions ///
////////////////////////////

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
	console.log(tabs)
	for(let i = 0; i<tabs.length; i++){
		create_tab_listener(tabs[i].id);
	}
	//create map
	create_map(tabs[1].id, window.parsed_key);
	//create tab content
	const schools_data = {"city": window.parsed_results.city.schools};
	console.log("schools_data:\n", schools_data);
	schoolsTab_setup(SCHOOLS_TTLS, TTL_CLASSES, SCHOOLS_TBL_COL_HEADERS, SCHOOLS_TBL_ROW_HEADERS, schools_data, TBL_CLASSES, SCHOOLS_TBL_CAPTIONS);
	const census_data = {"city": window.parsed_results.city.census[0], "province": window.parsed_results.province.census[0], "country": window.parsed_results.country.census[0]};
	//console.log("census_data:\n", census_data);
	censusTab_setup(CENSUS_TTLS, TTL_CLASSES, CENSUS_TBL_COL_HEADERS, CENSUS_TBL_ROW_HEADERS, census_data, TBL_CLASSES, CENSUS_TBL_CAPTIONS);
	const crimes_data = {"city": window.parsed_results.city.crimes, "province": window.parsed_results.province.crimes, "country": window.parsed_results.country.crimes};
	//console.log("crimes_data:\n", crimes_data);
	crimesTab_setup(CRIMES_TTLS, TTL_CLASSES, CRIMES_TBL_COL_HEADERS, CRIMES_TBL_ROW_HEADERS, crimes_data, TBL_CLASSES, CRIMES_TBL_CAPTIONS);
});