fillSelector();

function fillCard(cardID) {
	d3.csv("js/cgc.csv").then(function(data) {
	if (data[cardID].Type == "Creature") {
		document.getElementById('container').innerHTML += 
		`<div class="grid-item" id="${cardID}" onmouseover="showX(this)" onmouseout="hideX(this)">
			<div class="X" onclick="this.parentNode.remove()"> </div>
			<div style="background-color:GhostWhite;height:92mm;width:66mm;padding:0.1in">
				<div style="background-color:${data[cardID].Color}; border: 4px solid ${data[cardID].Color};" class="printOmit" id="cName">
					${data[cardID].Name}
					<div id="cCost" class="printOmit"> 
						${data[cardID].Cost}
					</div>
				</div>
				<div style="height:1.6in;">
					<div id ="cTraits">
						${data[cardID].Traits}
					</div> 
					<div style="background-color:blue;float:right;height:1.2in;width:0.4in;"> 
						<div id="cPower">
							${data[cardID].Strength}
						</div>
						<div style="background-color:#8080ff;height:0.4in;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;line-height:20px;" id="cDefense">
							${data[cardID].Health}
						</div>
						<div id="cRestore">
							${data[cardID].Restore}
						</div>
					</div>
					<div style="top:116px;" id="cType">
						${data[cardID].Type}
					</div> 
				</div>
				<div id="cTextBox">
					${data[cardID].Effect.replace(/\n/g, "<br>")}
				</div>
			</div> 
		</div>`;
	}
	else if (data[cardID].Type == "Instant") {
		document.getElementById('container').innerHTML +=  
		`<div class="grid-item" id="${cardID}" onmouseover="showX(this)" onmouseout="hideX(this)">
			<div class="X" onclick="this.parentNode.remove()"> </div>
			<div style="background-color:GhostWhite;height:92mm;width:66mm;padding:0.1in">
				<div style="background-color:${data[cardID].Color}; border: 4px solid ${data[cardID].Color};" class="printOmit" id="cName"> 
					${data[cardID].Name}
					<div id='cCost' class='printOmit'>
						${data[cardID].Cost}
					</div>
				</div>
				<div style="height:1.6in;">
					<div id ="cTraits">
						${data[cardID].Traits}
					</div> 
					<div style="top:136px;right:95px;" id="cType">
						${data[cardID].Type}
					</div> 
				</div>
				<div id="cTextBox">
					${data[cardID].Effect.replace(/\n/g, "<br>") }
				</div>
			</div>
		</div>`;
	
	}
	else if (data[cardID].Type == "Artifact") {
		document.getElementById('container').innerHTML +=  
		`<div class="grid-item" id="${cardID}" onmouseover="showX(this)" onmouseout="hideX(this)">
			<div class="X" onclick="this.parentNode.remove()"> </div>
			<div style="background-color:GhostWhite;height:92mm;width:66mm;padding:0.1in">
				<div style="height:1.6in;">
					<div id ="cTraits">
						${data[cardID].Traits}
					</div>  
					<div style="top:136px;right:95px;" id="cType">
						${data[cardID].Type}
					</div>
					<div style="background-color:#8080ff;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;height:0.3in;width:0.3in;position:relative;top:2.8in;left:1.8in;line-height:0px;" id="cDefense">
						${data[cardID].Health}
					</div>
				</div>
				<div id="cTextBox">
					${data[cardID].Effect.replace(/\n/g, "<br>")}
				</div>
				<div style="background-color:${data[cardID].Color}; border: 4px solid ${data[cardID].Color};" class="printOmit" id="cName">
					${data[cardID].Name}
					<div id='cCost' class='printOmit'>
						${data[cardID].Cost}
					</div>
				</div> 
			</div> 
		</div>`;
	}
	});
}

function fillSelector() {
	var good_houses = readCheckBoxes();
	document.getElementById('chosen_card').innerHTML = ""; // wipe old selector

	d3.csv("js/cgc.csv").then(function(data) {
		var i = 0;
		try {
			while (data[i].ID != "") {
				if (good_houses.includes(data[i].Color)) {
					document.getElementById('chosen_card').innerHTML += `<option value="${data[i].ID}"> ${data[i].Name} </option>`;
				}
				i++;
			}
		} catch (error) { // Catches data[i] is out of bounds so the list is empty
			console.log( document.getElementById('chosen_card').childElementCount + "/" + i + " cards loaded into the selector!");
		}
		
});
}

function fillCardSelect() {
	var x = document.getElementById("chosen_card").value - 1;
	var i = 0;
	while (i < document.getElementById("numCards").value) {
		fillCard(x);
		i++;
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
				fillCard(data[i].ID - 1);
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
		var house = box.id.split("-")[1]; // Based on how IDs are structured
		ret.push(house);
	}

	return ret;
}

function getCSVCardHouse(card) {
	var cost = (card.Cost).split(""); //Check periodically against side effects
	return cost.pop();
}

function toggleScroll() {
	if (document.getElementById("scroll_open").style.height == "30px") {
		document.getElementById("scroll_open").style.height = "0px";
	} else {
		document.getElementById("scroll_open").style.height = "30px";
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
			type[data[card.id].Type]++; //sloppy to do this with direct indexing
			houses[data[card.id].Color]++;
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