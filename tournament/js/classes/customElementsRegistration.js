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
		this.onkeyup = this.checkMax;
		this.onchange = this.applyChange;
	}
	isNumberKey(event){
		let charCode = (event.which) ? event.which : event.keyCode;
		if (47 < charCode && charCode < 58)
			return true;
		return false;
	}
	checkMax(event){
		if(this.min < this.valueAsNumber){
			if(this.valueAsNumber > this.max){
				this.value = this.max;
			}
		}
	}
	applyChange(){
		this.targetValue.value = this.valueAsNumber;
		ruleChecker.check();
	}
}
class MaxCombinedStatsNumberInput extends HTMLInputElement{
	constructor(){
		super();
		this.type = "number";
		this.value = maxCombinedStats;
		this.min = 0;
		this.max = 65535;
		this.step = 1;
		this.style.float = "right";
		this.onkeypress = this.isNumberKey;
		this.onkeyup = this.checkMax;
		this.onchange = this.applyChange;
	}
	isNumberKey(event){
		let charCode = (event.which) ? event.which : event.keyCode;
		if (47 < charCode && charCode < 58)
			return true;
		return false;
	}
	checkMax(event){
		if(this.min < this.valueAsNumber){
			if(this.valueAsNumber > this.max){
				this.value = this.max;
			}
		}
	}
	applyChange(){
		maxCombinedStats = this.valueAsNumber;
		ruleChecker.check();
	}
}
class ScreenNameInput extends HTMLInputElement{
	constructor(){
		super();
		this.type = "text";
		this.id = "screen-name-input";
		this.placeholder = "enter name";
		this.maxLength = 20;
		this.style.width = "120px";
		this.style.float = "right";
		this.style.textAlign = "center";
		this.onkeypress = this.isAllowedKey;
		this.oninput = this.applyChange;
		this.onpaste = this.applyChange;
		this.onchange = this.applyChange;
		this.isSet = false;
	}
	isAllowedKey(event){
		let charCode = (event.which) ? event.which : event.keyCode;
		if (charCode == 48 || (47 < charCode && charCode < 58) || (64 < charCode && charCode < 91) || (96 < charCode && charCode < 123))
			return true;
		return false;
	}
	applyChange(){
		screenName = this.value;
		if(screenName.length > 1){
			this.isSet = true;
		}
		ruleChecker.check();
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
		this.oninput = this.applyChange;
		this.onpaste = this.applyChange;
		this.onchange = this.applyChange;
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
class DigimonSelect extends HTMLSelectElement{
	constructor(statName, index, digi, owner){
		super();
		this.owner = owner;
		this.digi = digi;
		this.statName = statName;
		this.id = `${statName}-${index}`;
		this.style.width = "150px";
		this.style.float = "right";
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
		ruleChecker.check(0);
	}
}
class DigimonOption extends HTMLOptionElement{
	constructor(value){
		super();
		this.id = `digimonOption-${value.id}`;
		this.className = value.name;
		this.value = value.id;
		this.innerHTML = value.name;
		if(babyDigimon.indexOf(value.name) != -1){
			this.classList.add("baby");
		}else if(value.id > 0 && value.id < 66 && value.id != 62){
			this.classList.add("obtainable");
		}else if(unplayable.indexOf(value.name) != -1){
			this.classList.add("unplayable");
		}else if(value.name == "Otamamon"){
			this.classList.add("otamamon");
		}else{
			this.classList.add("unobtainable");
		}
	}
}
class MoveSelect extends HTMLSelectElement{
	constructor(digi, index, options, registeredDigiId, owner){
		super();
		this.digi = digi;
		this.index = index;
		this.owner = owner;
		this.id = `registeredDigi-${registeredDigiId}-moveSelect-${index}`;
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
		ruleChecker.check(0);
	}
}
class MoveOption extends HTMLOptionElement{
	constructor(value){
		super();
		this.id = `moveOption-${value[1]}`;
		this.value = value[1];
		this.innerHTML = value[0];
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
		col.innerHTML = name;
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(input);
		row.appendChild(col);
		return row;
	}
}
class NameTable extends CustomTable{
	constructor(model){
		super(model);
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = "User Name";
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(new ScreenNameInput());
		row.appendChild(col);
		this.appendChild(row);
		this.appendChild(this.getNameRow("Tamer Name"));
		row = document.createElement("TR");
		col = document.createElement("TD");
		col.innerText = "Max Combined Stats";
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(new MaxCombinedStatsNumberInput());
		row.appendChild(col);
		this.appendChild(row);
		this.style.width = "293px";
		this.style.margin = "auto";
	}
}
class DigimonTable extends CustomTable{
	constructor(digi, index){
		super(digi);
		this.digi = digi;
		this.index = index;
		this.availableMoves = [];
		this.equippedMoves = [];
		this.moveSelects = [];
		this.appendChild(this.getNameRow("Name"));
		this.appendChild(this.getTypeRow("Type"));
		this.appendChild(this.getNumberRow("HP", 0, 65535));
		this.appendChild(this.getNumberRow("MP", 0, 65535));
		this.appendChild(this.getNumberRow("Offense", 0, 65535));
		this.appendChild(this.getNumberRow("Defense", 0, 65535));
		this.appendChild(this.getNumberRow("Speed", 0, 65535));
		this.appendChild(this.getNumberRow("Brains", 0, 65535));
		this.getMovesStatRows();
		this.style.width = "227px";
		this.style.margin = "auto";
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
}
class RegisteredDigimonTable extends DigimonTable{
	constructor(digi, index){
		super(digi, index);
	}
}
class RuleCheckerDiv extends HTMLDivElement{
	constructor(){
		super();
		this.style.margin = "auto";
		this.style.width = "400px";
		this.style.textAlign = "center";
	}
	updateRuleText(str){
		this.innerHTML = str;
	}
}
