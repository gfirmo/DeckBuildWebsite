fillVisualizer();

var RunningCardList = {};


async function zipStuff(){
	async function fillURLs(){
		for (const [id, qty] of Object.entries(RunningCardList)) {
			var offScreen = document.querySelector(`.grid-container [data-card-id='${id}']`);
			await html2canvas(offScreen)
				.then(function(canvas) {
					url = canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")
					zip.file(`${qty}X ${id}.png`, url, {base64: true});
				})
		}
		var offScreen = document.querySelector(`.grid-container .Card_Back`);
		await html2canvas(offScreen)
			.then(function(canvas) {
				url =  canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "")
				zip.file(`card_back.png`, url, {base64: true});
			})
		return zip;
	};

	var zip = new JSZip();
	/* Generate a directory within the Zip file structure
	var img = zip.folder("images");*/

	fillURLs()
	.then(function(whole_zip){
		return whole_zip.generateAsync({type:"blob"}) // Generate the zip file asynchronously
	}).then(function(content) {
		saveAs(content, "THIS_IS_YOUR_ZIP.zip");
	});
}

async function stackCards(){
	document.querySelector(".grid-container").innerHTML = `<div class="card Card_Back">
	<img style="width:100%" src="Images/Card_Back.png" alt="Back">
  </div>`;

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
	document.querySelector(".grid-container").innerHTML = `<div class="card Card_Back">
	<img style="width:100%" src="Images/Card_Back.png" alt="Back">
  </div>`;
	
	for (const [id, qty] of Object.entries(RunningCardList)) {
		if (id == "ID") {
			alert("The 'RunningCardList' is badly formatted");
		}
		for (let i = 0; i < qty; i++){
			fillCard(id);
		}
	}
}

async function addCard(number){
	const id = parseInt(number); // number could be in any format. Previous issues with "1.0 != 1"
	if (id in RunningCardList) {
		const stack_height = RunningCardList[id];
		if ( stack_height < 4 ) {
			const card_stack = createElementWithAttributes("div", {"class":"card-stack"});
			card_stack.style.bottom = `${stack_height * 5}px`; 
			card_stack.style.left = `${stack_height * 5}px`;
			card_stack.style.zIndex = `${-1 * stack_height - 5}`;

			document.querySelector(`.grid-container [data-card-id='${id}']`).appendChild(card_stack);
			++(RunningCardList[id]);
		} else if (isNaN(stack_height)) {
			await fillCard(id);
			RunningCardList[id] = 1;
		} else {
			alert("Already have 4 of that card! Tsk tsk");
		}
	} else {
		await fillCard(id);
		RunningCardList[id] = 1;
	}
}

function removeCard(parent_card){
	try {
		let stacked_cards = parent_card.querySelectorAll(".card-stack");
		stacked_cards[stacked_cards.length - 1].remove();
		--RunningCardList[parent_card.getAttribute("data-card-id")];
	} catch (error) {
		const stack_depth = parent_card.getAttribute("data-card-id");
		--RunningCardList[stack_depth];
		if (RunningCardList[stack_depth] == 0){
			delete RunningCardList[stack_depth];
		}
		parent_card.remove();
	}
}

async function fillCard(cardID) {
	cardID = cardID - 1; // Because data[] 0 indexes
	await d3.csv("Scripts/cgc.csv").then(function(data) {
		var grid_item = createElementWithAttributes("div", 
													{"class":"grid-item",
													"card-id": parseInt(data[cardID].ID),
													"onmouseover":"showX(this)",
													"onmouseout":"hideX(this)"});
		const X_item = createElementWithAttributes("div", 
													{"class":"X",
													"onclick":"removeCard(this.parentNode)"});
		
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
		for (entry of data) {
			if (entry.ID == "") {
				break;
			}
			if (passesfilter.includes(entry.Color) && passesfilter.includes(entry.Type)) {
				let vis_card = makevisItem(parseInt(entry.ID));
				vis_card.innerHTML += getCard(entry);
				visualizerFrag.appendChild(vis_card);
			}
		}
		document.getElementById('visualizer').appendChild(visualizerFrag);
		console.log( document.getElementById('visualizer').childElementCount + " cards loaded into the visualizer");
	});
}

function readDList() {
	var theFile = document.getElementById('myFile').files[0];
	var fileCont = ""
	var reader = new FileReader();
    reader.onload = async function (evt) {
		document.querySelector(".grid-container").innerHTML = `<div class="card Card_Back">
		<img style="width:100%" src="Images/Card_Back.png" alt="Back">
	  </div>`;
		RunningCardList = {}; // doesn't remove references if RCL has been copied
        fileCont = evt.target.result;
		console.log(fileCont);
		Dlist = await d3.csvParse(fileCont);
		for (entry of Dlist){
			for (i = 0; i < entry.Quantity; i++) {
				await addCard( parseInt(entry.ID) );
			}
		}
		console.log("Read in Deck List");
    }
	reader.onerror = function (evt) {
		console.log('aaah');
	}
	reader.readAsText(theFile);
}

function expCardList() {
	var csv = "ID,Name,Quantity\n";
	
	d3.csv("Scripts/cgc.csv").then(function(data) {
		for (const [id, qty] of Object.entries(RunningCardList)) {
			csv += parseInt(id) + "," + data[id-1].Name + "," + qty + "\n";
		}
		console.log(csv);

		let hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
		hiddenElement.target = '_blank';
		
		hiddenElement.download = 'decklist.csv';
		hiddenElement.click();
	});
}

function analyzeCards() {
	/*
	Stats to get:
	Number of cards
	Number of Creatures, Wonders, Instants
	Number in each house
	*/
	var total_cards = 0;

	let type = {"Creature":0, "Wonder":0, "Instant":0};
	let houses = {"Purple":0, "Gold":0, "Grey":0, "Green":0, "Blue":0, "Red":0};
	let house_string = "";

	d3.csv("Scripts/cgc.csv").then(function(data) {
		for (const [id, qty] of Object.entries(RunningCardList)) {
			total_cards += qty;
			type[data[id - 1].Type] += qty; //sloppy to do this with direct indexing
			houses[data[id - 1].Color] += qty;
		}

		for (let [house, num] of Object.entries(houses)) {
			if (num > 0) {
				house_string += num + " in " + house + "\n";
			}
		}

		alert(`${total_cards} total cards

${type["Creature"]} creatures
${type["Wonder"]} Wonders
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