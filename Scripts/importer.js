fillVisualizer();

var RunningCardList = {};

function createElementWithAttributes(tag, attributes) {
	let ret = document.createElement(tag);
	for (let attr in attributes) {
		if (attributes.hasOwnProperty(attr)) {
			if (attr.startsWith("data-") || attr.startsWith("on") || attr == "id" || attr == "class" || attr == "style") {
				ret.setAttribute(attr, attributes[attr]);
			} else {
				ret.setAttribute("data-"+attr, attributes[attr]);
			}
		}
	}
	return ret;
}

async function stackCards(){
	document.querySelector(".grid-container").innerHTML = "";

	let old_list = {};
	Object.assign(old_list, RunningCardList);
	for (const [id, qty] of Object.entries(old_list)) {
		delete RunningCardList[id];
		for (let i = 0; i < qty; i++){
			await addCard(id);
		}
	}
}

function flattenCards(){
	document.querySelector(".grid-container").innerHTML = "";
	
	for (const [id, qty] of Object.entries(RunningCardList)) {
		if (id == "ID") {
			continue;
		}
		for (let i = 0; i < qty; i++){
			fillCard(id);
		}
	}
}

async function addCard(id){
	if (id in RunningCardList) {
		const stack_height = RunningCardList[id];
		if ( stack_height < 4 ) {
			const card_stack = createElementWithAttributes("div", {"class":"card-stack"});
			card_stack.style.bottom = `${stack_height * 5}px`; 
			card_stack.style.left = `${stack_height * 5}px`;
			card_stack.style.zIndex = `${-1 * stack_height}`;

			document.querySelector(`.grid-container [id='${id}']`).appendChild(card_stack);
			++(RunningCardList[id]);
		} else if (isNaN(stack_height)) {
			RunningCardList[id] = 1;
			await fillCard(id);
		} else {
			alert("Already have 4 of that card! Tsk tsk");
		}
		
	} else {
		RunningCardList[id] = 1;
		await fillCard(id);
	}
	
	return "card added"
}

function removeCard(parent_card){
	try {
		let stacked_cards = parent_card.querySelectorAll(".card-stack");
		stacked_cards[stacked_cards.length - 1].remove();
		--RunningCardList[parent_card.id];
	} catch (error) {
		--RunningCardList[parent_card.id];
		if (RunningCardList[parent_card.id] == 0){
			delete RunningCardList[parent_card.id];
		}
		parent_card.remove();
	}
}

async function fillCard(cardID) {
	cardID = cardID - 1; //For data[] 0 indexing
	await d3.csv("Scripts/cgc.csv").then(function(data) {

		var grid_item = createElementWithAttributes("div", {"class":"grid-item","id": data[cardID].ID, "onmouseover":"showX(this)", "onmouseout":"hideX(this)"});
		const X_item = createElementWithAttributes("div", {"class":"X","onclick":"removeCard(this.parentNode)"});
		grid_item.appendChild(X_item);

		grid_item.innerHTML += getCard(data[cardID]);
		
		document.getElementById('container').prepend(grid_item);

		});
}

function fillVisualizer() {
	const passesfilter = readCheckBoxes();
	document.getElementById('visualizer').innerHTML = ""; // wipe old visualizer

	let visualizerFrag = document.createDocumentFragment();
	d3.csv("Scripts/cgc.csv").then(function(data) {
		let i = 0;
		try {
			while (data[i].ID != "") {
				if (passesfilter.includes(data[i].Color) && passesfilter.includes(data[i].Type)) {
					let vis_card = makevisItem(data[i].ID)
					vis_card.innerHTML += getCard(data[i]);
					visualizerFrag.appendChild(vis_card);
				}
				i++;
			}
		} catch (error) { // Catches data[i] is out of bounds so the list is empty
			document.getElementById('visualizer').appendChild(visualizerFrag);
			console.log( document.getElementById('visualizer').childElementCount + "/" + i + " cards loaded into the visualizer!");
		}
		
});
}

function makevisItem(ID) {
	let ret = createElementWithAttributes("div", {"class":"vis-item","id": ID, "onmouseover":"showPlus(this)", "onmouseout":"hidePlus(this)"});
	const plus_item = createElementWithAttributes("div", {"class":"plus","onclick":"addCard(this.parentNode.getAttribute('id'))"});
	ret.appendChild(plus_item);
	return ret
}

function getCard(card) {

	switch (card.Type) {
		case "Creature":
			return htmlCreature(card);
		case "Instant":
			return htmlInstant(card);
		case "Artifact":
			return htmlArtifact(card);
		case "Battlefield":
			return htmlBattlefield(card);
		default:
			alert("Card Type not recognized");
	}
}

function readDList() {
	
	var theFile = document.getElementById('myFile').files[0];
	var fileCont = ""
	var reader = new FileReader();
    reader.onload = async function (evt) {
		document.querySelector(".grid-container").innerHTML = "";
		RunningCardList = {}; // doesn't remove references if RCL has been copied

        fileCont = evt.target.result;
		console.log(fileCont);
		data = await d3.csvParse(fileCont);
		var i = 0;
		try { // What about "for (A of data){ for (B of A.Quantity) {} }
			while(data[i].ID != "") {
				var j = 0;
				while(j < data[i].Quantity) {
					await addCard(`${data[i].ID}.0`); // I hate doing this. Please find the origin of our id issues
					j++;
				}
				i++;
			}
		} catch (error) { // Catches data[i] is out of bounds so the list is empty
			console.log("Read in Deck List");
		}
    }
	reader.onerror = function (evt) {
		console.log('aaah');
	}
	reader.readAsText(theFile);
}

function expCardList() {
	var csv = "ID,Quantity\n" 
	for (const [id, qty] of Object.entries(RunningCardList)) {
		csv += parseInt(id) + "," + qty + "\n";
	}
	console.log(csv);

	let hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'decklist.csv';
    hiddenElement.click();
}

function analyzeCards() {
	/*
	Stats to get:
	Number of cards
	Number of Creatures, Artifacts, Instants
	Number in each house
	*/
	var total_cards = 0;

	let type = {"Creature":0, "Artifact":0, "Instant":0};
	let houses = {"Purple":0, "Gold":0, "Grey":0, "Green":0, "Blue":0, "Red":0};
	let house_string = "";

	d3.csv("Scripts/cgc.csv").then(function(data) {
		for (const [id, qty] of Object.entries(RunningCardList)) {
			total_cards += qty;
			for (let i = 0; i < qty; i++){
				type[data[id - 1].Type]++; //sloppy to do this with direct indexing
				houses[data[id - 1].Color]++;
			}
		}

		for (let [house, num] of Object.entries(houses)) {
			if (num > 0) {
				house_string += num + " in " + house + "\n";
			}
		}

		alert(`${total_cards} total cards

${type["Creature"]} creatures
${type["Artifact"]} artifacts
${type["Instant"]} instants
		
${house_string}`);
	});
}

function readCheckBoxes() {
	const checked = document.querySelectorAll("input[type=checkbox]:checked");
	let ret = [];
	for (box of checked){
		const filterfor = box.id.split("-")[1]; // Based on how Houses and Types are stored
		ret.push(filterfor);
		if (filterfor == "Battlefield"){
			ret.push("Brown"); // Technically the "color" of Battlefields so they'll show up
		}
	}
	return ret;
}

/* JULES TODO
- export with Name
- filtering for stacks
- unique card rules
	> artifacts
	> battlefields
- search by name
- card formatting (input handling)
	> bold keywords
	> italic within paren
- spam clicking "stack" causes duplicates
- PRINT BUTTON


- track down ID int!= int.0
- background / palette rework
*/

/*
*
* CSS AND HTML SCRIPTS
* Macros, really
*
*/

function toggleScroll() {
	if (document.getElementById("scroll-open").style.height == "395px") {
		document.getElementById("scroll-open").style.height = "0px";
		document.getElementById("scroll-open").style.borderWidth = "0px"
	} else {
		document.getElementById("scroll-open").style.height = "395px";
		document.getElementById("scroll-open").style.borderWidth = "5px"
	}
}

function showX(el) {
	const X = el.querySelector(":scope > .X");
	X.style.visibility = "visible";
}

function hideX(el) {
	const X = el.querySelector(":scope > .X");
	X.style.visibility = "hidden";
}

function showPlus(el) {
	const X = el.querySelector(":scope > .plus");
	X.style.visibility = "visible";
}

function hidePlus(el) {
	const X = el.querySelector(":scope > .plus");
	X.style.visibility = "hidden";
}

function htmlCreature(card) {
	/*
	make card
	make Name
	make Cost
	make body
	make Traits
	make Stats
	make Strength
	make Health
	make Restore
	make Type
	make TextBox

	set Name
	set Cost
	set Traits
	set Strength
	set Health
	set Restore
	set Type
	set TextBox

	child Cost < Name
	child Name < card
	child Traits < body
	child S < Stats
	child H < Stats
	child R < Stats
	child Stats < body
	child Type < body
	child body < card
	child TextBox < card
	*/
	return `<div class="card" style="height:92mm;width:66mm;">
				<div style="background-color:${card.Color}; border: 4px solid ${card.Color};" class="printOmit" id="cName">
					${card.Name}
					<div id="cCost" class="printOmit"> 
						${card.Cost}
					</div>
				</div>
				<div style="height:1.6in;">
					<div id ="cTraits">
						${card.Traits}
					</div> 
					<div style="background-color:blue;float:right;height:1.2in;width:0.4in;"> 
						<div id="cPower">
							${card.Strength}
						</div>
						<div style="background-color:#8080ff;height:0.4in;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;line-height:20px;" id="cDefense">
							${card.Health}
						</div>
						<div id="cRestore">
							${card.Restore}
						</div>
					</div>
					<div style="top:116px;" id="cType">
						${card.Type}
					</div> 
				</div>
				<div id="cTextBox">
					${card.Effect.replace(/\n/g, "<br>")}
				</div>
			</div>`;
}

function htmlInstant(card) {
	return `<div class="card" style="height:92mm;width:66mm;">
				<div style="background-color:${card.Color}; border: 4px solid ${card.Color};" class="printOmit" id="cName"> 
					${card.Name}
					<div id='cCost' class='printOmit'>
						${card.Cost}
					</div>
				</div>
				<div style="height:1.6in;">
					<div id ="cTraits">
						${card.Traits}
					</div> 
					<div style="top:136px;right:95px;" id="cType">
						${card.Type}
					</div> 
				</div>
				<div id="cTextBox">
					${card.Effect.replace(/\n/g, "<br>") }
				</div>
			</div>`;
}

function htmlArtifact(card){
	return `<div class="card" style="height:92mm;width:66mm;">
				<div style="height:1.6in;">
					<div id ="cTraits">
						${card.Traits}
					</div>  
					<div style="top:136px;right:95px;" id="cType">
						${card.Type}
					</div>
					<div style="background-color:#8080ff;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;height:0.3in;width:0.3in;position:relative;top:2.8in;left:1.8in;line-height:0px;" id="cDefense">
						${card.Health}
					</div>
				</div>
				<div id="cTextBox">
					${card.Effect.replace(/\n/g, "<br>")}
				</div>
				<div style="background-color:${card.Color}; border: 4px solid ${card.Color};" class="printOmit" id="cName">
					${card.Name}
					<div id='cCost' class='printOmit'>
						${card.Cost}
					</div>
				</div> 
			</div>`;
}

function htmlBattlefield(card) {
	return `<div class="card battlefield" style="height:66mm;width:92mm;">
				<div style="height:1.3in;">
					<div id ="cTraits">
						${card.Name}
					</div>
				</div>
				<div id="cGlobal">
					${card.Effect.replace(/\n/g, "<br>")}
				</div>
				<div id="cCaptured">
					${card.Notes.replace(/\n/g, "<br>")}
				</div>
			</div>`;
}

/* possibly not needed:
function fillCardSelect() {
	var x = document.getElementById("chosen_card").value;
	var i = 0;
	while (i < document.getElementById("numCards").value) {
		fillCard(x);
		i++;
	}
}

function getCSVCardHouse(card) {
	var cost = (card.Cost).split(""); //I should check periodically against side effects
	return cost.pop();
}
*/