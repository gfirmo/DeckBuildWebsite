fillVisualizer();

function createElementWithAttributes(tag, attributes) {
	var ret = document.createElement(tag);
	for (var attr in attributes) {
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

function fillCard(cardID) {
	cardID = cardID - 1; //For data[] 0 indexing
	d3.csv("js/cgc.csv").then(function(data) {

		var grid_item = createElementWithAttributes("div", {"class":"grid-item","id": data[cardID].ID, "onmouseover":"showX(this)", "onmouseout":"hideX(this)"});
		var X_item = createElementWithAttributes("div", {"class":"X","onclick":"this.parentNode.remove()"});
		grid_item.appendChild(X_item);

		switch(data[cardID].Type) {
			case "Creature":
				grid_item.innerHTML += htmlCreature(data[cardID]);
				break;
			case "Instant":
				grid_item.innerHTML += htmlInstant(data[cardID]);
				break;
			case "Artifact":
				grid_item.innerHTML += htmlArtifact(data[cardID]);
				break;
			case "Battlefield":
				grid_item.innerHTML += htmlBattlefield(data[cardID]);
				grid_item.setAttribute("style", "grid-column: span 2; width:66mm");
				break;
			default:
				alert("Card Type not recognized");
		}

		document.getElementById('container').prepend(grid_item);
	});
}

function fillVisualizer() {
	var passesfilter = readCheckBoxes();
	document.getElementById('visualizer').innerHTML = ""; // wipe old visualizer

	var visualizerFrag = document.createDocumentFragment();
	d3.csv("js/cgc.csv").then(function(data) {
		var i = 0;
		try {
			while (data[i].ID != "") {
				if (passesfilter.includes(data[i].Color) && passesfilter.includes(data[i].Type)) {
					var vis_card = makevisItem(data[i].ID)
					vis_card.innerHTML += getCard(data[i]);
					visualizerFrag.appendChild(vis_card);
				}
				i++;
			}
		} catch (error) { // Catches data[i] is out of bounds so the list is empty
			document.getElementById('visualizer').appendChild(visualizerFrag);
			console.log( document.getElementById('visualizer').childElementCount + "/" + i + " cards loaded into the selector!");
		}
		
});
}

function makevisItem(ID) {
	var ret = createElementWithAttributes("div", {"class":"vis-item","id": ID, "onmouseover":"showPlus(this)", "onmouseout":"hidePlus(this)"});
	var plus_item = createElementWithAttributes("div", {"class":"plus","onclick":"fillCard(this.parentNode.getAttribute('id'))"});
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
    reader.onload = function (evt) {
		document.querySelector(".grid-container").innerHTML = "";
        fileCont = evt.target.result;
		console.log(fileCont);
		data = d3.csvParse(fileCont);
		var i = 0;
		while(data[i].ID != "") {
			var j = 0;
			while(j < data[i].Quantity) {
				fillCard(data[i].ID);
				j++;
		}
		i++;
		}
    }
	reader.onerror = function (evt) {
		console.log('aaah');
	}
	reader.readAsText(theFile);
}

function showX(el) {
	var X = el.querySelector(":scope > .X");
	X.style.visibility = "visible";
}

function hideX(el) {
	var X = el.querySelector(":scope > .X");
	X.style.visibility = "hidden";
}

function showPlus(el) {
	var X = el.querySelector(":scope > .plus");
	X.style.visibility = "visible";
}

function hidePlus(el) {
	var X = el.querySelector(":scope > .plus");
	X.style.visibility = "hidden";
}

function expCardList() {
	i = 0;
	var cardList = [["ID", "Quantity"]]
	var allCards = document.getElementsByClassName("grid-item");
	var i = 0;
	while (i < allCards.length) {
		cardList.push([allCards[i].id, "1"])
		i++;
	}
	console.log(cardList);
	var csv = "" 
	cardList.forEach(function(row) {
		csv += row.join(',');
		csv += "\n";
	});
	
	console.log(csv);
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'decklist.csv';
    hiddenElement.click();
}

function readCheckBoxes() {
	var checked = document.querySelectorAll("input[type=checkbox]:checked");
	var ret = [];
	for (box of checked){
		var filterfor = box.id.split("-")[1]; // Based on how Houses and Types are stored
		ret.push(filterfor);
		if (filterfor == "Battlefield"){
			ret.push("Brown"); // Technically the "color" of Battlefields so they'll show up
		}
	}

	return ret;
}

function toggleScroll() {
	if (document.getElementById("scroll-open").style.height == "425px") {
		document.getElementById("scroll-open").style.height = "0px";
		document.getElementById("scroll-open").style.borderWidth = "0px"
	} else {
		document.getElementById("scroll-open").style.height = "425px";
		document.getElementById("scroll-open").style.borderWidth = "5px"
	}
}

function analyzeCards() {
	/*
	Stats to get:
	Number of cards
	Number of Creatures, Artifacts, Instants
	Number in each house
	*/
	var card_list = document.querySelectorAll(".grid-item");
	var qty = card_list.length

	var type = {"Creature":0, "Artifact":0, "Instant":0};
	var houses = {"Purple":0, "Gold":0, "Grey":0, "Green":0, "Blue":0, "Red":0};
	var house_string = "";

	d3.csv("js/cgc.csv").then(function(data) {
		for (card of card_list) {
			type[data[card.id - 1].Type]++; //sloppy to do this with direct indexing
			houses[data[card.id - 1].Color]++;
		}
		for ([house, num] of Object.entries(houses)) {
			if (num > 0) {
				house_string += num + " in " + house + "\n";
			}
		}

		alert(`${qty} total cards

${type["Creature"]} creatures
${type["Artifact"]} artifacts
${type["Instant"]} instants
		
${house_string}`);
	});
}

function htmlCreature(card) {
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

/* JULES TODO
- import cards "properly"
- export cards in qty
- grid spacing online
- "Battleline"
- display card collapsed qty
- background / palette rework
*/

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