d3.csv("js/cgc.csv").then(function(data) {
	console.log(data[1])
});
var currnum = 0;

function fillCard(cardID) {
	d3.csv("js/cgc.csv").then(function(data) {
	if (data[cardID].Type == "Creature") {
		document.getElementById('container').innerHTML = document.getElementById('container').innerHTML +  `<div class="grid-item" id="` + cardID +`" onclick="remov(this, this.id)">
	<div style="background-color:GhostWhite;height:92mm;width:66mm;padding:0.1in">
		<div style="background-color:`+ data[cardID].Color+`;" class="printOmit" id="cName">` + data[cardID].Name+ "<div id='cCost' style='float:right;' class='printOmit'>" + data[cardID].Cost + "</div> " + `</div> 
			<div style="height:1.6in;">
			<div style="background-color:lightgray;height:0.2in;width:1in;float:left;border-color:dimgray;border-style:solid;border-width:2px;color:black;padding-left:3px;font-size:15px" id ="cTraits">`+ data[cardID].Traits +`</div> 
				<div style="background-color:blue;float:right;height:1.2in;width:0.4in;"> 
	<div style="background-color:#ff6666;height:0.4in;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;line-height:20px;" id="cPower">`+ data[cardID].Strength +`</div>
	<div style="background-color:#8080ff;height:0.4in;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;line-height:20px;" id="cDefense">`+ data[cardID].Health +`</div>
	<div style="background-color:#85e085;height:0.4in;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;line-height:20px;" id="cRestore">`+ data[cardID].Restore +`</div></div>
<div style="position:relative;top:116px;background-color:lightgray;height:0.2in;width:1in;float:left;border-color:dimgray;border-style:solid;border-width:2px;color:black;padding-left:3px" id="cType">`+ data[cardID].Type +`</div> 
	</div>
	<div style="background-color:azure;height:1.4in;border-radius:3px;border-color:grey;border-style:solid;border-width:2px;color:black;padding-left:3px;padding-right:3px;font-size:12px;" id="cTextBox">`+ data[cardID].Effect.replace(/\n/g, "<br>") +`
</div>
	</div> </div>`;
	currnum += 1;
	}
	else if (data[cardID].Type == "Instant") {
		document.getElementById('container').innerHTML = document.getElementById('container').innerHTML +  `<div class="grid-item" id="` + cardID +`" onclick="remov(this)">
	<div style="background-color:GhostWhite;height:92mm;width:66mm;padding:0.1in">
		<div style="background-color:`+ data[cardID].Color+`;" class="printOmit" id="cName">` + data[cardID].Name+ "<div id='cCost' style='float:right;'class='printOmit'>" + data[cardID].Cost + "</div> " + `</div> 
			<div style="height:1.6in;">
			<div style="background-color:lightgray;height:0.2in;width:1in;float:left;border-color:dimgray;border-style:solid;border-width:2px;color:black;padding-left:3px;font-size:15px" id ="cTraits">`+ data[cardID].Traits +`</div> 
<div style="position:relative;top:136px;right:95px;background-color:lightgray;height:0.2in;width:1in;float:left;border-color:dimgray;border-style:solid;border-width:2px;color:black;padding-left:3px" id="cType">`+ data[cardID].Type +`</div> 
	</div>
	<div style="background-color:azure;height:1.4in;border-radius:3px;border-color:grey;border-style:solid;border-width:2px;color:black;padding-left:3px;padding-right:3px;font-size:12px;" id="cTextBox">`+ data[cardID].Effect.replace(/\n/g, "<br>") +`
</div>
	</div> </div>`;
	currnum += 1;
	}
	else if (data[cardID].Type == "Artifact") {
		document.getElementById('container').innerHTML = document.getElementById('container').innerHTML +  `<div class="grid-item" id="` + cardID +`" onclick="remov(this)">
	<div style="background-color:GhostWhite;height:92mm;width:66mm;padding:0.1in">
			<div style="height:1.6in;">
			<div style="background-color:lightgray;height:0.2in;width:1in;float:left;border-color:dimgray;border-style:solid;border-width:2px;color:black;padding-left:3px;font-size:15px" id ="cTraits">`+ data[cardID].Traits +`</div>  
<div style="position:relative;top:136px;right:95px;background-color:lightgray;height:0.2in;width:1in;float:left;border-color:dimgray;border-style:solid;border-width:2px;color:black;padding-left:3px" id="cType">`+ data[cardID].Type +`</div>
<div style="background-color:#8080ff;border-color:dimgray;border-style:solid;border-width:3px;text-align:center;height:0.3in;width:0.3in;position:relative;top:2.8in;left:1.8in;line-height:0px;" id="cDefense">`+ data[cardID].Health +`</div> 
	</div>
	<div style="background-color:azure;height:1.4in;border-radius:3px;border-color:grey;border-style:solid;border-width:2px;color:black;padding-left:3px;padding-right:3px;font-size:12px;" id="cTextBox">`+ data[cardID].Effect.replace(/\n/g, "<br>") +`
</div>
<div style="background-color:`+ data[cardID].Color+`;" class="printOmit" id="cName">` + data[cardID].Name+ "<div id='cCost' style='float:right;' class='printOmit'>" + data[cardID].Cost + "</div> " + `</div> 
	</div> </div>`;
	currnum += 1;
	}
	});
}
function fillSelector() {
	d3.csv("js/cgc.csv").then(function(data) {
		var i = 0;
		console.log(data[i].ID);
		while (data[i].ID != "") {
			document.getElementById('cards').innerHTML = document.getElementById('cards').innerHTML + `<option value="` + data[i].ID + `"> `+ data[i].Name + `</option>`;
			i++;
		}
});
}

function fillCardSelect() {
	//console.log("hello");
	var x = document.getElementById("cards").value - 1;
	var i = 0;
	while (i < document.getElementById("numCards").value) {
		fillCard(x);
		i++;
	}
}
function readDList() {
	var theFile = document.getElementById('myFile').files[0];
	//console.log(theFile);
	var fileCont = ""
	var reader = new FileReader();
    reader.onload = function (evt) {
		console.log(evt.target.result);
        fileCont = evt.target.result;
		console.log(fileCont);
		data = d3.csvParse(fileCont);
		var i =0;
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
	//d3.csv.parse(fileCont).then(function(data) {
	//	var i = 0;
	//	while(data[i].ID != "") {
	//		var j = 0;
	//		while(j < data[i].Quantity) {
	//			fillCard(data[i - 1].ID)
	//			j++;
	//		}
	//		i++;
	//	}
	//});
}

function remov(el, id) {
	var element = el;
	element.remove();
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
fillSelector();
//readDList()

