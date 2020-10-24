/*
*   This isn't meant to be actually run by the website
*
*   I put old functions, HTML templates, and a TODO list
*   here so it doesn't clog the main scripts.
*
*   Reve control is nice. On hand is nicer.
*/


/* JULES TODO

- card formatting (input handling)
	> bold keywords
	> italic within paren
	> name shrink
- add only one of card
	> Wonders
    > battlefields
- compare import to Name and error if different
- filtering for stacks
- search by name
- spam clicking "stack" causes duplicates
- PRINT BUTTON

- background / palette rework
*/


// #region  possibly not needed:
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

// #endregion


// #region THESE ARE THE OLD HTML CARD TEMPLATES:
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

function htmlWonder(card){
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
//#endregion