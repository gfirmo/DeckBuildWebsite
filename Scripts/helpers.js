

//#region HELPER FUNCTIONS
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

function makevisItem(ID) {
	let ret = createElementWithAttributes("div", {"class":"vis-item", "card-id": parseInt(ID), "onmouseover":"showPlus(this)", "onmouseout":"hidePlus(this)"});
	const plus_item = createElementWithAttributes("div", {"class":"plus", "onclick":"addCard(this.parentNode.getAttribute('data-card-id'))"});
	ret.appendChild(plus_item);
	return ret
}

function getCard(card) {
	switch (card.Type) {
		case "Creature":
			return htmlCreature(card);
		case "Instant":
			return htmlInstant(card);
		case "Wonder":
			return htmlWonder(card);
		case "Battlefield":
			return htmlBattlefield(card);
		default:
			alert("Card Type not recognized");
	}
}
//#endregion

//#region CSS AND HTML SCRIPTS
// Macros, really

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
	return `<div class="card Creature_Template">
				<img style="width:100%" src="Images/Creature_template.png" alt="Creature">
				<a class="name">${card.Name}</a>
				<span class="stats">
					<a class="strength">${card.Strength}</a>
					<a class="health">${card.Health}</a>
					<a class="restore">${card.Restore}</a>
				</span>
				<a class="text">${card.Effect.replace(/\n/g, "<br>")}</a>
				<a class="traits">${card.Traits}</a>
				<a class="cost">${(card.Cost).split("")[0]}</a>
				<a class="color" style="background-color:var(--${card.Color})"></a>
			</div>`;
}

function htmlInstant(card) {
	return `<div class="card Instant_Template">
				<img style="width:100%" src="Images/Instant_template.png" alt="Instant">
				<a class="name">${card.Name}</a>
				<a class="traits">${card.Traits}</a>
				<a class="text">${card.Effect.replace(/\n/g, "<br>") }</a>
				<a class="cost">${(card.Cost).split("")[0]}</a>
				<a class="color" style="background-color:var(--${card.Color})"></a>
  			</div>`;
}

function htmlWonder(card){
	return `<div class="card Wonder_Template">
				<img style="width:100%" src="Images/Wonder_template.png" alt="Wonder">
				<a class="cost">${(card.Cost).split("")[0]}</a>
				<a class="name">${card.Name}</a>
				<a class="health">${card.Health}</a>
				<a class="text">${card.Effect.replace(/\n/g, "<br>")}</a>
				<a class="traits">${card.Traits}</a>
				<a class="color" style="background-color:var(--${card.Color})"></a>
			</div>`;
}

function htmlBattlefield(card) {
	return `<div class="card Battlefield_Template">
				<img style="width:100%" src="Images/Battlefield_template.png" alt="Battlefield">
				<a class="name">${card.Name}</a>
				<a class="captured_text">${card.Notes.replace(/\n/g, "<br>")}</a>
				<a class="wild_text">${card.Effect.replace(/\n/g, "<br>")}</a>
			</div>`;
}

//#endregion
