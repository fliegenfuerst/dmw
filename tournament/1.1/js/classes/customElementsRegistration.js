var imageSelectList = [];
const babyDigimon = ["Yuramon", "Tsunomon", "Tokomon", "Tanemon", "Punimon", "Poyomon", "Koromon", "Botamon"];
const unplayable = ["WereGarurumon", "Tinmon", "ShogunGekomon", "Master Tyrannomon", "Market Manager", "King of Sukamon", "Jijimon", "Hiro", "Hagurumon", "DemiMeramon", "Cherrymon", "Brachiomon", "Analogman", ""];
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
		if(this.value == ""){
			this.value = 0;
		}
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
		this.style.backgroundColor = "coral";
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
		this.applyChange();
	}
	applyChange(){
		if(this.value != ""){
			this.style.backgroundColor = "";
		}else{
			this.style.backgroundColor = "coral";
		}
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
		this.style.backgroundColor = "coral";
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
		}else{
			this.isSet = false;
		}
		if(this.isSet){
			this.style.backgroundColor = "";
		}else{
			this.style.backgroundColor = "coral";
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
		this.style.width = "170px";
		this.style.float = "right";
		this.className = 'original-image-select';
		this.onchange = this.applyChange;
		for(let i = 0; i < digimonAlphabetical.length; i++){
			this.appendChild(new DigimonOption(digimonAlphabetical[i], 170));
			if(this.digi[this.statName].value == digimonAlphabetical[i].id){
				this.selectedIndex = i;
			}
		}
		this.getOptionDiv = getDigimonOptionDiv;
		//imageSelectList.push(this);
	}
	applyChange(){
		this.digi[this.statName].value = parseInt(this.selectedOptions[0].value);
		this.owner.setMoveSelectOptions();
		ruleChecker.check(0);
	}
}
function getBasicOptionDiv(width, imgSrc){
	let listItemDiv = document.createElement("DIV");
	listItemDiv.disabled = false;
	listItemDiv.className = "list-item-div";
	let sprite = document.createElement("SPAN");
	sprite.classList.add("sprite");
	listItemDiv.img = document.createElement("IMG");
	listItemDiv.img.classList.add("animated-sprite");
	listItemDiv.img.src = imgSrc;
	let imgContainer=document.createElement("SPAN");
	imgContainer.className = "imgContainer";
	imgContainer.appendChild(listItemDiv.img);
	sprite.appendChild(imgContainer);
	listItemDiv.nameSpan = document.createElement("SPAN");
	listItemDiv.nameSpan.classList.add("name-span");
	listItemDiv.nameSpan.style.width = width + "px";
	listItemDiv.appendChild(sprite);
	listItemDiv.appendChild(listItemDiv.nameSpan);
	return listItemDiv;
}
function getDigimonOptionDiv(width){
	let listItemDiv = getBasicOptionDiv(width, "1.1/css/digisprites.png");
	listItemDiv.update = function(id, name){
		this.index = id;
		this.name = name;
		this.img.alt = name;
		this.img.spriteSheetOffset = id * 32;
		this.img.style.objectPosition = "-" + this.img.spriteSheetOffset + "px 0px";
		this.nameSpan.innerText = name;
		if(babyDigimon.indexOf(name) != -1){
			this.nameSpan.classList.add("baby");
		}else if(id > 0 && id < 66 && id != 62){
			this.nameSpan.classList.add("obtainable");
		}else if(unplayable.indexOf(name) != -1){
			this.nameSpan.classList.add("unplayable");
		}else if(name == "Otamamon"){
			this.nameSpan.classList.add("otamamon");
		}else{
			this.nameSpan.classList.add("unobtainable");
		}
	}
	return listItemDiv;
}
class DigimonOption extends HTMLOptionElement{
	constructor(value, width){
		super();
		this.id = `digimonOption-${value.id}`;
		this.name = value.name;
		this.value = value.id;
		this.innerHTML = value.name;
		this.listItemDiv = getDigimonOptionDiv(width - 43);
		this.listItemDiv.update(value.id, value.name);
	}
}
class MoveSelect extends HTMLSelectElement{
	constructor(digi, index, options, registeredDigiId, owner){
		super();
		this.digi = digi;
		this.index = index;
		this.owner = owner;
		this.id = `registeredDigi-${registeredDigiId}-moveSelect-${index}`;
		this.width;
		this.style.width = "170px";
		this.style.float = "right";
		this.className = 'original-image-select';
		this.moveOptions = options;
		this.onchange = this.applyChange;
		this.selectedMoveIndexes = [this.digi.move1.value - 0x2E, this.digi.move2.value - 0x2E, this.digi.move3.value - 0x2E];
		this.updateOptions();
		this.getOptionDiv = getMoveOptionDiv;
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
			let moveOption = new MoveOption(this.moveOptions[i], this.width - 43)
			if(this.selectedMoveIndexes.indexOf(i) != -1){
				moveOption.disabled = true;
				moveOption.listItemDiv.disable();
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
const specialities = {"FIRE": 0, "AIR": 1, "ICE": 2, "MECH": 3, "EARTH": 4, "BATTLE": 5, "FILTH": 6};
function getMoveOptionDiv(width){
	let listItemDiv = getBasicOptionDiv(width, "1.1/css/specialities.png");
	listItemDiv.update = function(id, name){
		let move = findMoveByName(name);
		let specialityId = 7;
		if(name != "empty"){
			specialityId = specialities[move.speciality];
			if(move.effect != undefined){
				this.classList.add('has-tooltip');
				let toolTipDiv = document.createElement("DIV");
				toolTipDiv.classList.add('is-tooltip');
				toolTipDiv.innerText = `${move.effect.chance}% chance to cause ${move.effect.type.toLowerCase()} effect`;
				this.appendChild(toolTipDiv);
				let effectImg = document.createElement("IMG");
				effectImg.src = `1.1/css/${move.effect.type}.png`;
				effectImg.classList.add('effect-img');
				this.appendChild(effectImg);
			}
		}
		this.index = id;
		this.name = name;
		this.img.alt = name;
		this.img.spriteSheetOffset = specialityId * 32;
		this.img.style.objectPosition = "-" + this.img.spriteSheetOffset + "px 0px";
		this.nameSpan.innerText = name;
	}
	listItemDiv.disable = function(){
		this.disabled = true;
	}
	return listItemDiv;
}
class MoveOption extends HTMLOptionElement{
	constructor(value, width){
		super();
		this.id = `moveOption-${value[1]}`;
		this.value = value[1];
		this.innerHTML = value[0];
		this.listItemDiv = getMoveOptionDiv(width);
		this.listItemDiv.update(value[1], value[0]);
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
		col.innerText = "Stat Point Limit";
		row.appendChild(col);
		col = document.createElement("TD");
		col.appendChild(new MaxCombinedStatsNumberInput());
		row.appendChild(col);
		this.appendChild(row);
		//this.style.width = "293px";
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
		this.finisherCell = document.createElement("TD");;
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
		this.appendChild(this.getFinisherRow(digiStats.finisher));
		this.appendChild(this.getMoveStatRow(0, availableMoves));
		this.appendChild(this.getMoveStatRow(1, availableMoves));
		this.appendChild(this.getMoveStatRow(2, availableMoves));
	}
	getFinisherRow(finisher){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = 'Finisher';
		row.appendChild(col);
		this.finisherCell.innerText = finisher;
		this.finisherCell.style.textAlign = "right";
		row.appendChild(this.finisherCell);
		return row;
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
		this.finisherCell.innerText = digiStats.finisher;
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

var anySelectOpen = false;
function removeImageSelects(){
	let oldSelectList = document.querySelectorAll('.image-select')
	for(let oldSelect of oldSelectList){
		oldSelect.remove();
	}
	oldSelectList = document.querySelectorAll('.original-image-select')
	for(let oldSelect of oldSelectList){
		oldSelect.style.display = "block";
	}
}
function decorateSelects(){
	let selectList = document.getElementsByClassName('original-image-select');
	for(let imageSelect of selectList){
		let originalWidth = parseInt(imageSelect.style.width.split('px')[0]);
		let imageSelectContainerDiv = document.createElement("DIV");
		imageSelectContainerDiv.className = "image-select";
		let imageSelectButton = document.createElement("BUTTON");
		imageSelectButton.value = "";
		imageSelectButton.className = "image-select-button";
		imageSelectButton.appendChild(imageSelect.getOptionDiv(originalWidth - 43));
		imageSelectButton.firstChild.update(imageSelect.selectedOptions[0].value, imageSelect.selectedOptions[0].innerText);
		imageSelectButton.onclick = function(){
			if(anySelectOpen == this){
				imageSelectListContainerDiv.toggle();
				anySelectOpen = false;
			}else{
				hideAllSelectListContainers();
				imageSelectListContainerDiv.toggle();
				anySelectOpen = this;
			}
		}
		imageSelectButton.onkeypress = function(event){
			for(let i = 0; i < digimonAlphabetical.length; i++){
				if(digimonAlphabetical[i].name.charAt(0).toLowerCase() == event.key.toLowerCase()){
					imageSelect.selectedIndex = i;
					imageSelectListContainerDiv.scrollTop = i * 18;
					break;
				}
			}
		}
		for(let style of imageSelect.style){
			imageSelectButton.style[style] = imageSelect.style[style];
		}
		let imageSelectListContainerDiv = document.createElement("DIV");
		imageSelectListContainerDiv.className = "image-select-list-container";
		imageSelectListContainerDiv.visible = false;
		imageSelectListContainerDiv.style.display = "none";
		imageSelectListContainerDiv.style.width = (originalWidth - 2) + "px";
		imageSelectListContainerDiv.toggle = function(){
			if(this.visible){
				this.style.display = "none";
				this.visible = false;
			}else{
				this.style.display = "block";
				this.visible = true;
			}
		};
		imageSelectListContainerDiv.hide = function(){
			this.style.display = "none";
			this.visible = false;
		};
		let imageSelectListDiv = document.createElement("DIV");
		imageSelectListDiv.className = "image-select-list";
		imageSelectContainerDiv.appendChild(imageSelectButton);
		imageSelectListContainerDiv.appendChild(imageSelectListDiv);
		let totalHeight = imageSelect.options.length * 18;
		if(totalHeight > 400){
			totalHeight = 400;
			imageSelectListContainerDiv.style.overflowY = "scroll";
		}
		imageSelectListContainerDiv.style.height = totalHeight + "px";
		imageSelectContainerDiv.appendChild(imageSelectListContainerDiv);
		imageSelect.parentNode.appendChild(imageSelectContainerDiv);
		let optionArray = [];
		for(let imageSelectOption of imageSelect.options){
			let listItem = document.createElement("LI");
			listItem.appendChild(imageSelectOption.listItemDiv);
			imageSelectListDiv.appendChild(listItem);
			if(imageSelectOption.listItemDiv.disabled){
				//imageSelectOption.listItemDiv.style.pointerEvents = imageSelectOption.style.pointerEvents = "none";
				imageSelectOption.listItemDiv.style.cursor = imageSelectOption.style.cursor = "not-allowed";
				imageSelectOption.listItemDiv.style.color = "grey";
			}else{
				imageSelectOption.listItemDiv.onclick = function(){
					imageSelectButton.firstChild.update(this.index, this.name);
					imageSelectListContainerDiv.toggle();
					imageSelect.selectedOptions[0].value = imageSelectOption.value;
					imageSelect.selectedOptions[0].innerText = imageSelectOption.innerText;
					imageSelect.applyChange();
					removeImageSelects();
					decorateSelects();
					hideAllSelectListContainers();
				};
			}
		}
		imageSelect.style.display = "none";
		//imageSelect.style.zIndex = "-1";
	}
	
}
function hideAllSelectListContainers(){
	let imageSelectListContainers = document.getElementsByClassName("image-select-list-container");
	for(let i = 0; i < imageSelectListContainers.length; i++){
		imageSelectListContainers[i].hide();
	}
	anySelectOpen = false;
}
function closeAllImageSelectListContainers(evt){
	if(!evt.target.classList.contains('list-item-div') && !evt.target.classList.contains('image-select-button')){
		hideAllSelectListContainers();
	}
	
}
document.addEventListener("click", closeAllImageSelectListContainers, false);
