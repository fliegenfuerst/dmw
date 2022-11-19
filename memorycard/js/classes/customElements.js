class NumberInput extends HTMLInputElement{
	constructor(minValue, maxValue, id, targetValue){
		super();
		this.targetValue = targetValue;
		this.type = "number";
		this.id = id;
		this.value = this.targetValue.value;
		this.min = minValue;
		this.max = maxValue;
		this.step = 1;
		this.style.float = "right";
		this.onkeypress = this.isNumberKey;
		this.onkeyup = this.checkIsInRange;
		this.onchange = this.applyChange;
	}
	isNumberKey(event){
		let charCode = (event.which) ? event.which : event.keyCode;
		if (47 < charCode && charCode < 58 || charCode == 45)
			return true;
		return false;
	}
	checkIsInRange(event){
		if(this.min < this.valueAsNumber){
			if(this.valueAsNumber > this.max){
				this.value = this.max;
			}
		}else{
			this.value = this.min;
		}
	}
	applyChange(){
		this.targetValue.value = this.valueAsNumber;
	}
}
class NameInput extends HTMLInputElement{
	constructor(id, targetValue){
		super();
		this.targetValue = targetValue;
		this.type = "text";
		this.id = id;
		this.value = targetValue.value;
		this.maxLength = 7;
		this.style.width = "72px";
		this.style.float = "right";
		this.style.textAlign = "center";
		this.onkeypress = this.isAllowedKey;
		this.oninput = this.onpaste = this.onchange = this.applyChange;
	}
	isAllowedKey(event){
		let charCode = (event.which) ? event.which : event.keyCode;
		if (charCode == 48 || (47 < charCode && charCode < 58) || (64 < charCode && charCode < 91) || (96 < charCode && charCode < 123))
			return true;
		return false;
	}
	applyChange(){
		this.targetValue.value = this.value;
	}
}
class CheckboxInput extends HTMLInputElement{
	constructor(index, targetValue){
		super();
		this.type = "checkbox";
		this.index = index;
		this.id = `trigger-${index}`;
		this.targetValue = targetValue;
		this.onchange = this.applyChange;
		this.checked = targetValue.readBit(index);
	}
	applyChange(){
		//this.targetValue.setBit(index, this.checked);
		this.targetValue.toggleBit(this.index);
	}
}
class InventorySizeSelect extends HTMLSelectElement{
	constructor(targetValue){
		super();
		this.targetValue = targetValue;
		this.style.float = "right";
		this.onchange = this.applyChange;
		var option = document.createElement("option");
		option.value = 10;
		option.innerHTML = 10;
		this.appendChild(option);
		option = document.createElement("option");
		option.value = 20;
		option.innerHTML = 20;
		this.appendChild(option);
		option = document.createElement("option");
		option.value = 30;
		option.innerHTML = 30;
		this.appendChild(option);
		this.selectedIndex = targetValue.value/10 -1;
	}
	applyChange(){
		this.targetValue.value = parseInt(this.selectedOptions[0].value);
		this.parentNode.parentNode.parentNode.populate();
	}
}
class ItemSelect extends HTMLSelectElement{
	constructor(targetValue){
		super();
		this.targetValue = targetValue;
		//this.id = `${statName}-${index}`;
		this.onchange = this.applyChange;
		this.appendChild(new ItemOption(255));
		for(let i = 0; i < items.length; i++){
			this.appendChild(new ItemOption(i));
		}
		if(targetValue.value == 255){
			this.selectedIndex = 0;
		}else{
			this.selectedIndex = targetValue.value + 1;
		}
	}
	applyChange(){
		this.targetValue.value = parseInt(this.selectedOptions[0].value);
	}
}
class ItemOption extends HTMLOptionElement{
	constructor(value){
		super();
		//this.id = `moveOption-${value[1]}`;
		this.value = value;
		if(value == 255){
			this.innerHTML = "none";
		}else{
			this.innerHTML = items[value].name.eng;
		}
		//this.style = `background-image: url("https://fliegenfuerst.github.io/dw1/evolution/img/${digimonStats[value].name}.gif")`;
	}
}
class MapSelect extends HTMLSelectElement{
	constructor(targetValue){
		super();
		this.targetValue = targetValue;
		this.onchange = this.applyChange;
		for(let i = 0; i < mapDetails.length; i++){
			this.appendChild(new MapOption(mapDetails[i]));
			if(targetValue.value == mapDetails[i].id){
				this.selectedIndex = i;
			}
		}
	}
	applyChange(){
		this.targetValue.value = parseInt(this.selectedOptions[0].value);
	}
}
class MapOption extends HTMLOptionElement{
	constructor(mapDetail){
		super();
		this.value = mapDetail.id;
		this.innerHTML = mapDetail.description;
	}
}
class DigimonSelect extends HTMLSelectElement{
	constructor(statName, index, digi, owner){
		super();
		this.owner = owner;
		this.digi = digi;
		this.statName = statName;
		this.id = `${statName}-${index}`;
		//this.style = `background-image: url("https://fliegenfuerst.github.io/dw1/evolution/img/${digimonStats[value].name}.gif")`;
		this.style.width = "150px";
		this.style.float = "right";
		//this.className = "digimon-sprite";
		this.onchange = this.applyChange;
		for(let i = 0; i < digimonAlphabetical.length; i++){
			this.appendChild(new DigimonOption(digimonAlphabetical[i]));
			if(this.digi[this.statName].value == digimonAlphabetical[i].id){
				this.selectedIndex = i;
			}
		}
	}
	applyChange(){
		this.digi[this.statName].value = parseInt(this.selectedOptions[0].value);
		this.owner.setMoveSelectOptions();
	}
}
class DigimonOption extends HTMLOptionElement{
	constructor(value){
		super();
		this.id = `digimonOption-${value.id}`;
		this.value = value.id;
		this.innerHTML = value.name;
		//this.className = "digimon-sprite";
		if(value.id < 66 && value.id != 62){
			this.classList.add("obtainable");
		}else{
			this.classList.add("unobtainable");
		}
		//this.style = "background-image: url(" + "'https://fliegenfuerst.github.io/dw1/evolution/img/" + digimonStats[value.id].name + ".gif'" + ")";
		//this.style = `background-image: url('./img/${digimonStats[value.id].name}.gif');`;
	}
}
class MoveSelect extends HTMLSelectElement{
	constructor(digi, index, options, registeredDigiId, owner){
		super();
		this.digi = digi;
		this.index = index;
		this.owner = owner;
		this.id = `registeredDigi-${registeredDigiId}-moveSelect-${index}`;
		//this.style = `background-image: url("https://fliegenfuerst.github.io/dw1/evolution/img/${digimonStats[value].name}.gif")`;
		this.style.width = "150px";
		this.style.float = "right";
		this.moveOptions = options;
		this.onchange = this.applyChange;
		this.selectedMoveIndexes = [this.digi.move1.value - 0x2E, this.digi.move2.value - 0x2E, this.digi.move3.value - 0x2E];
		this.updateOptions();
		
	}
	clearOptions(){
		while(this.options.length > 0){
			this.remove(0);
		}
		//this.selectedMoveIndexes = [0x0, 0xD1, 0xD1];
		this.selectedMoveIndexes = [this.digi.move1.value - 0x2E, this.digi.move2.value - 0x2E, this.digi.move3.value - 0x2E];
		if((this.digi.move1.value + this.digi.move2.value + this.digi.move3.value) > 0x1FE){
			this.selectedMoveIndexes.push(this.moveOptions.length - 1);
		}
	}
	setOptions(options){
		this.moveOptions = options;
		this.clearOptions();
		this.updateOptions();
	}
	updateOptions(){
		this.clearOptions();
		let moveOption;
		for(let i = 0; i < this.moveOptions.length; i++){
			let moveOption = new MoveOption(this.moveOptions[i])
			if(this.selectedMoveIndexes.indexOf(i) != -1){
				moveOption.disabled = true;
			}
			this.appendChild(moveOption);
		}
		if(this.digi[`move${this.index + 1}`].value != 0xFF){
			this.selectedIndex = this.digi[`move${this.index + 1}`].value - 0x2E;
		}else{
			this.selectedIndex = this.moveOptions.length - 1;
		}
	}
	applyChange(){
		if(this.selectedOptions[0].value == (this.options.length - 1)){
			this.digi[`move${this.index + 1}`].value = 0xFF;
		}else{
			this.digi[`move${this.index + 1}`].value = parseInt(this.selectedOptions[0].value) + 0x2E;
		}
		this.owner.updateMoveSelectOptions();
	}
}
class MoveOption extends HTMLOptionElement{
	constructor(value){
		super();
		this.id = `moveOption-${value[1]}`;
		this.value = value[1];
		this.innerHTML = value[0];
		//this.style = `background-image: url("https://fliegenfuerst.github.io/dw1/evolution/img/${digimonStats[value].name}.gif")`;
	}
}
class CustomTable extends HTMLTableElement{
	constructor(model, index){
		super();
		this.model = model;
		this.index = index;
	}
	getNameRow(name){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		let propertyName = helper.guiNameToPropertyName(name);
		col.innerText = name;
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(new NameInput(`${propertyName}-${this.index}`, this.model[propertyName]));
		row.appendChild(col);
		return row;
	}
	getNumberRow(name, minValue, maxValue){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		let propertyName = helper.guiNameToPropertyName(name);
		let input = new NumberInput(minValue, maxValue, `${propertyName}-${this.index}`, this.model[propertyName]);
		col.innerText = name;
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(input);
		row.appendChild(col);
		return row;
	}
	getCheckboxRow(name, index, targetValue){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = name;
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(new CheckboxInput(index, targetValue));
		row.appendChild(col);
		return row;
	}
}
class PlayerTable extends CustomTable{
	constructor(player){
		super(player, 0);
		this.appendChild(this.getNameRow("Name"));
		this.appendChild(this.getNumberRow("Bits", 0, 999999));
		this.appendChild(this.getNumberRow("Merit Points", 0, 65535));
		this.appendChild(this.getNumberRow("Started Battles", 0, 65535));
		this.appendChild(this.getNumberRow("Run Aways", 0, 65535));
		this.appendChild(this.getNumberRow("Tournaments Won", 0, 65535));
		this.appendChild(this.getNumberRow("Tournament Battles Won", 0, 65535));
		this.appendChild(this.getNumberRow("Tournaments Lost", 0, 65535));
		this.appendChild(this.getNumberRow("Tamer Level", 0, 255));
		this.appendChild(this.getNumberRow("Raised Digimon", 0, 255));
		//this.appendChild(this.getNumberRow("", 0, ));
		
	}
}
class WorldTable extends CustomTable{
	constructor(world){
		super(world, 0);
		this.appendChild(this.getNumberRow("Year", 0, 65535));
		this.appendChild(this.getNumberRow("Day", 0, 30));
		this.appendChild(this.getNumberRow("Hour", 0, 23));
		this.appendChild(this.getNumberRow("Minute", 0, 59));
		this.appendChild(this.getNumberRow("Hours Played", 0, 65535));
		this.appendChild(this.getNumberRow("Minutes Played", 0, 59));
		this.appendChild(this.getMapRow("Current Screen"));
		this.appendChild(this.getMapRow("Last Screen"));
	}
	getMapRow(statName){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		let mapSelect = new MapSelect(this.model[helper.guiNameToPropertyName(statName)]);
		col.innerText = statName;
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(mapSelect);
		row.appendChild(col);
		return row;
	}
}
class InventoryTable extends CustomTable{
	constructor(inventory){
		super(inventory, 0);
		this.inventory = inventory;
		this.populate();
	}
	populate(){
		let child = this.lastElementChild;
		while(child){
			this.removeChild(child);
			child = this.lastElementChild;
		}
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = "size";
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(new InventorySizeSelect(this.inventory.size));
		row.appendChild(col);
		this.appendChild(row);
		//let sizeSelect = col = document.createElement("SELECT");
		for(let i = 0; i < this.inventory.size.value; i++){
			this.appendChild(this.getItemRow(i));
		}
	}
	getItemRow(i){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.appendChild(new ItemSelect(this.inventory[`slot${i}Id`]));
		row.append(col);
		col = document.createElement("TD");
		col.appendChild(new NumberInput(0, 99, i, this.inventory[`slot${i}Amount`]));
		row.append(col);
		return row;
	}
}
class ItemBankTable extends CustomTable{
	constructor(itemBank){
		super(itemBank, 0);
		this.itemBank = itemBank;
		this.populate();
	}
	populate(){
		let child = this.lastElementChild;
		while(child){
			this.removeChild(child);
			child = this.lastElementChild;
		}
		for(let i = 0; i < 127; i++){
			this.appendChild(this.getItemRow(i));
		}
	}
	getItemRow(i){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = items[i].name.eng;
		row.append(col);
		col = document.createElement("TD");
		col.appendChild(new NumberInput(0, 99, i, this.itemBank[i]));
		row.append(col);
		return row;
	}
}
class RecycleShopTable extends CustomTable{
	constructor(recycleShop){
		super(recycleShop, 0);
		this.recycleShop = recycleShop;
		this.populate();
	}
	populate(){
		let child = this.lastElementChild;
		while(child){
			this.removeChild(child);
			child = this.lastElementChild;
		}
		for(let i = 0; i < 78; i++){
			this.appendChild(this.getItemRow(i));
		}
	}
	getItemRow(i){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = recycleShopItemNames[i];
		row.append(col);
		col = document.createElement("TD");
		col.appendChild(new NumberInput(0, 99, i, this.recycleShop[i]));
		row.append(col);
		return row;
	}
}
class CardTable extends CustomTable{
	constructor(cards){
		super(cards, 0);
		for(let i = 0; i < 66; i++){
			let row = document.createElement("TR");
			let col = document.createElement("TD");
			col.innerText = cardNames[i];
			row.appendChild(col);
			col = document.createElement("TD");
			col.appendChild(new NumberInput(0, 9, i, cards[i]));
			row.appendChild(col);
			this.appendChild(row);
			this.className = "visible-row-border";
		}
	}
}
class TriggerTable extends CustomTable{
	constructor(triggers){
		super(triggers, 0);
		for(let i = 0; i < 800; i++){
			this.appendChild(this.getCheckboxRow(triggerNames[i], i%8, triggers[(i-i%8)/8]));
		}
		this.className = "visible-row-border";
	}
}
class GameStateTable extends CustomTable{
	constructor(gameStates){
		super(gameStates, 0);
		for(let i = 0; i < 35; i++){
			let row = document.createElement("TR");
			let col = document.createElement("TD");
			col.innerText = gameStateInfos[i].join("\n");
			row.appendChild(col);
			col = document.createElement("TD");
			col.appendChild(new NumberInput(0, 255, i, gameStates[i]));
			row.appendChild(col);
			this.appendChild(row);
			this.className = "visible-row-border";
		}
	}
}
class DigimonTable extends CustomTable{
	constructor(digi, index, isRegisteredDigi){
		super(digi);
		this.digi = digi;
		this.index = index;
		this.availableMoves = [];
		this.equippedMoves = [];
		this.moveSelects = [];
		if(isRegisteredDigi){
			let row = document.createElement("TR");
			let col = document.createElement("TD");
			let span = document.createElement("SPAN");
			span.innerText = `vs digimon no.${helper.addLeadingZeros(index + 1, 2)}`;
			col.colSpan="2";
			col.appendChild(span);
			col.appendChild(new DeleteRegisteredDigimonButton(index));
			col.appendChild(new DuplicateRegisteredDigimonButton(index));
			this.appendChild(row);
			row.appendChild(col);
		}
		this.appendChild(this.getNameRow("Name"));
		this.appendChild(this.getTypeRow("Type"));
		if(isRegisteredDigi){
			this.appendChild(this.getNumberRow("Max HP", 0, 9999));
			this.appendChild(this.getNumberRow("Max MP", 0, 9999));
		}else{
			this.appendChild(this.getNumberRow("Max HP", 0, 9999));
			this.appendChild(this.getNumberRow("Current HP", 0, 9999));
			this.appendChild(this.getNumberRow("Max MP", 0, 9999));
			this.appendChild(this.getNumberRow("Current MP", 0, 9999));
		}
		this.appendChild(this.getNumberRow("Offense", 0, 999));
		this.appendChild(this.getNumberRow("Defense", 0, 999));
		this.appendChild(this.getNumberRow("Speed", 0, 999));
		this.appendChild(this.getNumberRow("Brains", 0, 999));
		if(!isRegisteredDigi){
			this.appendChild(this.getNumberRow("Discipline", 0, 100));
			this.appendChild(this.getNumberRow("Happiness", -100, 100));
		}
		this.getMovesStatRows();
		if(!isRegisteredDigi){
			//this.appendChild(new CheckboxInput(0, this.digi.conditionFlags));
			this.getConditionFlagRows();
		}
	}
	getMovesStatRows(){
		let availableMoves = [];
		let digiStats = digimonStats[this.digi.type.value];
		for(let i = 0; i < digiStats.moves.length; i++){
			if(digiStats.moves[i] != "None" && digiStats.moves[i] != digiStats.finisher){
				availableMoves.push([digiStats.moves[i], i]);
			}
		}
		availableMoves.push(["empty", availableMoves.length]);
		this.appendChild(this.getMoveStatRow(0, availableMoves));
		this.appendChild(this.getMoveStatRow(1, availableMoves));
		this.appendChild(this.getMoveStatRow(2, availableMoves));
	}
	getMoveStatRow(moveIndex, options){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = `Move ${moveIndex + 1}`;
		row.appendChild(col);
		col = document.createElement("TD");
		let moveSelect = new MoveSelect(this.digi, moveIndex, options, this.index, this);
		this.moveSelects.push(moveSelect);
		col.appendChild(moveSelect);
		row.appendChild(col);
		return row;
	}
	getTypeRow(statName){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		let digiSelect = new DigimonSelect(helper.guiNameToPropertyName(statName), this.index, this.digi, this);
		col.innerText = statName;
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(digiSelect);
		row.appendChild(col);
		return row;
	}
	updateMoveSelectOptions(){
		this.moveSelects[0].updateOptions();
		this.moveSelects[1].updateOptions();
		this.moveSelects[2].updateOptions();
	}
	setMoveSelectOptions(){
		this.digi.move1.value = 0x2E;
		this.digi.move2.value = 0xFF;
		this.digi.move3.value = 0xFF;
		let availableMoves = [];
		let digiStats = digimonStats[this.digi.type.value];
		for(let i = 0; i < digiStats.moves.length; i++){
			if(digiStats.moves[i] != "None" && digiStats.moves[i] != digiStats.finisher){
				availableMoves.push([digiStats.moves[i],i]);
			}
		}
		availableMoves.push(["empty", 0xFF]);
		this.moveSelects[0].setOptions(availableMoves);
		this.moveSelects[1].setOptions(availableMoves);
		this.moveSelects[2].setOptions(availableMoves);
	}
	getConditionFlagRows(){
		this.appendChild(this.getCheckboxRow("is sleepy", 0, this.digi.conditionFlags));
		this.appendChild(this.getCheckboxRow("is tired", 1, this.digi.conditionFlags));
		this.appendChild(this.getCheckboxRow("is hungry", 2, this.digi.conditionFlags));
		this.appendChild(this.getCheckboxRow("has to poop", 3, this.digi.conditionFlags));
		this.appendChild(this.getCheckboxRow("is unhappy", 4, this.digi.conditionFlags));
		this.appendChild(this.getCheckboxRow("is injured", 5, this.digi.conditionFlags));
		this.appendChild(this.getCheckboxRow("is sick", 6, this.digi.conditionFlags));
	}
}
class CurrentDigimonTable extends DigimonTable{
	constructor(digi){
		super(digi, 255, false);
	}
}
class RegisteredDigimonTable extends DigimonTable{
	constructor(digi, index){
		super(digi, index, true);
	}
}
class TabButtonsDiv extends HTMLDivElement{
	constructor(){
		super();
		this.appendChild(new MenuItemButton("partner"));
		this.appendChild(new MenuItemButton("vs digimon"));
		this.appendChild(new MenuItemButton("player"));
		this.appendChild(new MenuItemButton("world"));
		this.appendChild(new MenuItemButton("inventory"));
		this.appendChild(new MenuItemButton("item bank"));
		this.appendChild(new MenuItemButton("recycle shop"));
		this.appendChild(new MenuItemButton("cards"));
		this.appendChild(new MenuItemButton("triggers"));
		this.appendChild(new MenuItemButton("game states"));
		
	}
}
class MenuItemButton extends HTMLButtonElement{
	constructor(name){
		super();
		this.innerText = name;
		//this.onclick = func;
		this.onclick = this.show;
	}
	show(){
		switch(this.innerText){
			case "partner":
				gui.showCurrentDigimonView();
				break;
			case "vs digimon":
				gui.showRegisteredDigimonView();
				break;
			case "player":
				gui.showPlayerView();
				break;
			case "world":
				gui.showWorldView();
				break;
			case "inventory":
				gui.showInventoryView();
				break;
			case "item bank":
				gui.showItemBankView();
				break;
			case "recycle shop":
				gui.showRecycleShopView();
				break;
			case "cards":
				gui.showCardView();
				break;
			case "triggers":
				gui.showTriggerView();
				break;
			case "game states":
				gui.showGameStateView();
				break;
			default:
				break;
		}
	}
}
class AddRegisteredDigimonButton extends HTMLButtonElement{
	constructor(){
		super();
		this.innerText = "add";
		this.onclick = this.clicked;
	}
	clicked(){
		gui.addRegisteredDigimon();
	}
}
class RegisterCurrentDigimonButton extends HTMLButtonElement{
	constructor(){
		super();
		this.innerText = "register";
		this.onclick = this.clicked;
	}
	clicked(){
		gui.registerCurrentDigimon();
	}
}
class DuplicateRegisteredDigimonButton extends HTMLButtonElement{
	constructor(index){
		super();
		this.index = index;
		this.innerText = "duplicate";
		this.style.float = "right";
		this.onclick = this.clicked;
	}
	clicked(){
		gui.duplicateRegisteredDigimon(this.index);
	}
}
class DeleteRegisteredDigimonButton extends HTMLButtonElement{
	constructor(index){
		super();
		this.index = index;
		this.innerText = "delete";
		this.style.float = "right";
		this.onclick = this.clicked;
	}
	clicked(){
		gui.deleteRegisteredDigimon(this.index);
	}
}