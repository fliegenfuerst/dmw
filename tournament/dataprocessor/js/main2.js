const participants = [];
participants.contains = function(participant){
	for(let existingParticipant of this){
		if(existingParticipant.screenName != undefined && existingParticipant.screenName == participant.screenName){
			return true;
		}
	}
	return false;
};
const container = document.getElementById("container");
const participantTable = document.getElementById("participantTable");
const entryInputTextArea = document.getElementById("entryInputTextArea");
const groupSizesCheckBoxesSpan = document.getElementById("groupSizesCheckBoxesSpan");
const onlyAvailableWhenGroupableButtons = document.getElementsByClassName("onlyAvailableWhenGroupable");
const onlyAvailableWhenGroupedButtons = document.getElementsByClassName("onlyAvailableWhenGrouped");
const groupsMemoryCards = [];
var selectedGroupSize = 4;
var order;

function parseLink(url){
	if(url.indexOf("#!") == -1){
		return alert("invalid link: " + url + "does not contain hashbang (#!)");
	}
	let arr = url.split("#!")[1];
	arr = arr.split("/");
	if(arr.length != 14){
		return alert("invalid link: " + url + "length does not match");
	}
	let screenName = arr[0];
	//let tamerName = helper.unbase64url(arr[1]);
	let tamerName = screenName.substring(0, 6);
	let digiData = digimonAlphabetical[helper.urlToInt(arr[4])];
	let digiStats = digimonStats[digiData.id];
	let moves = [];
	for(let i = 0; i < digiStats.moves.length; i++){
		if(digiStats.moves[i] != "None" && digiStats.moves[i] != digiStats.finisher){
			moves.push([digiStats.moves[i], i]);
		}
	}
	let digi = {
		"name": helper.unbase64url(arr[3]),
		"type": digiData.id,
		"maxHp": helper.urlToInt(arr[5]),
		"maxMp": helper.urlToInt(arr[6]),
		"offense": helper.urlToInt(arr[7]),
		"defense": helper.urlToInt(arr[8]),
		"speed": helper.urlToInt(arr[9]),
		"brains": helper.urlToInt(arr[10])
	};
	let moveId = "";
	for(let i = 11; i < 14; i++){
		moveId = helper.urlToInt(arr[i]);
		if(moveId == moves.length){
			digi[`move${i-10}`] = 0xFF;
		}else{
			digi[`move${i-10}`] = moveId + 0x2E;
		}
	}
	return new Participant(screenName, tamerName, digi);
}
class Participant{
	constructor(screenName, tamerName, digi){
		this.screenName = screenName;
		this.tamerName = tamerName;
		this.digi = digi;
		this.groupChooserCell = document.createElement("TD");
		this.getTableRow();
		this.groupName = false;
		this.presetGroup = false;
		this.chooserCheckBoxGroup = [];
		this.originalIndex = -1;
	}
	getTableRow(){
		this.tableRow = document.createElement("TR");
		let tableCell = document.createElement("TD");
		tableCell.innerText = this.screenName;
		this.tableRow.appendChild(tableCell);
		tableCell = document.createElement("TD");
		tableCell.innerText = this.tamerName;
		this.tableRow.appendChild(tableCell);
		for(let property in this.digi){
			tableCell = document.createElement("TD");
			if(property == "type"){
				tableCell.innerText  = digimonStats[this.digi[property]].name;
				tableCell.style.textAlign = "center";
			}else if(property.indexOf("move") != -1){
				tableCell.style.textAlign = "center";
				if(this.digi[property] == 0xFF){
					tableCell.innerText = "empty";
				}else{
					tableCell.innerText = digimonStats[this.digi.type].moves[this.digi[property] - 0x2E];
				}
			}else{
				tableCell.innerText = this.digi[property];
				if(Number.isInteger(this.digi[property])){
					tableCell.style.textAlign = "right";
				}else{
					tableCell.style.textAlign = "left";
				}
			}
			this.tableRow.appendChild(tableCell);
		}
		this.tableRow.appendChild(this.groupChooserCell);
	}
	setGroupOptions(groupNames){
		let chooserCheckBoxGroup = [];
		this.groupChooserCell.innerHTML = "";
		let chooserCheckBoxSpan;
		let chooserCheckBox;
		for(let groupName of groupNames){
			chooserCheckBoxSpan = document.createElement("SPAN");
			chooserCheckBoxSpan.innerText = groupName;
			chooserCheckBox = document.createElement("INPUT");
			chooserCheckBox.type = "checkbox";
			chooserCheckBoxSpan.appendChild(chooserCheckBox);
			chooserCheckBoxGroup.push(chooserCheckBox);
			chooserCheckBox.target = this;
			chooserCheckBox.onclick = function(){
				if(groupName == chooserCheckBox.target.presetGroup){
					chooserCheckBox.target.presetGroup = false;
				}else{
					for(let checkBox of chooserCheckBoxGroup){
						checkBox.checked = false;
					}
					this.checked = true;
					chooserCheckBox.target.presetGroup = groupName;
					if(!order.groups[groupName].switchParticipant(this.target)){
						this.checked = false;
						chooserCheckBox.target.presetGroup = false;
					}
				}
			};
			if(this.presetGroup == groupName){
				chooserCheckBox.checked = true;
			}
			this.groupChooserCell.appendChild(chooserCheckBoxSpan);
		}
		this.chooserCheckBoxGroup = chooserCheckBoxGroup;
	}
	setGroupName(groupName){
		this.groupName = groupName;
	}
	getEntriesSpreadSheetString(){
		return `${this.screenName}\t${this.tamerName}\t${this.digi.name}\t${digimonStats[this.digi.type].name}`;
	}
	getKlixuzSpreadSheetData(){
		let retStr = `${this.screenName}\t${this.digi.name}\t${digimonStats[this.digi.type].name}\t=A${this.originalIndex+1}\t${this.digi.maxHp}\t${this.digi.maxMp}\t${this.digi.offense}\t${this.digi.defense}\t${this.digi.speed}\t${this.digi.brains}`;
		for(let i = 1; i < 4; i++){
			if(this.digi["move" + i] == 0xFF){
				retStr += "\tempty";
			}else{
				retStr += `\t${digimonStats[this.digi.type].moves[this.digi["move" + i] - 0x2E]}`;
			}
		}
		return retStr;
	}
}
class GroupsMemoryCard{
	constructor(groups){
		this.groups = groups;
		this.memcardReader = new MemoryCardReader(selectedGroupSize * 2);
		this.updateName();
		this.gui = new GUI(this.memcardReader, container, this.name);
		this.updateMembers();
		this.toMemoryCard();
	}
	updateMembers(){
		this.members = [];
		for(let group of this.groups){
			this.members.push(...group.members);
		}
	}
	updateName(){
		let names = [];
		for(let group of this.groups){
			names.push(group.name);
		}
		this.name = names.join("&");
	}
	toMemoryCard(){
		let index;
		for(let member of this.members){
			index = this.memcardReader.addDigimonSave();
			if(index != -1){
				this.memcardReader.saveSlotArray[index].updatePlayerName(member.tamerName);
				this.memcardReader.saveSlotArray[index].registerDigimonfromLinkData(member.digi);
				this.memcardReader.saveSlotArray[index].updateSaveName(member.tamerName, digimonStats[member.digi.type].name);
				this.memcardReader.saveSlotArray[index].setScreenName(member.screenName);
				this.gui.updateSlotButtons();
			}
		}
	}
	updateMemoryCard(){
		this.updateMembers();
		this.updateName();
		this.memcardReader.wipeMemoryCard();
		this.toMemoryCard();
	}
}
class Group{
	constructor(size, name){
		this.size = size;
		this.name = name;
		this.members = [];
	}
	addMember(participant){
		this.members.push(participant);
		participant.setGroupName(this.name);
	}
	isFull(){
		return this.members.length == this.size;
	}
	shuffle(){
		this.members = this.members
			.map(value => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);
	}
	switchParticipant(participant){
		let hasNoMoveAbleParticipant = true;
		for(let currentParticipant of this.members){
			if(currentParticipant.presetGroup == false){
				hasNoMoveAbleParticipant = false;
			}
		}
		if(hasNoMoveAbleParticipant){
			alert("all slots in this group have been preset, unset other entries to make space");
			return false;
		}
		let originalParticipantIndex = order.groups[participant.groupName].members.indexOf(participant);
		let participantTargetIndex = Math.floor(Math.random() * this.members.length);
		while(this.members[participantTargetIndex].presetGroup != false){
			participantTargetIndex = Math.floor(Math.random() * this.members.length);
		}
		let participantToReplace = this.members.splice(participantTargetIndex, 1, participant)[0];
		participantToReplace.setGroupName(participant.groupName);
		participant.setGroupName(this.name);
		order.groups[participantToReplace.groupName].members.splice(originalParticipantIndex, 1, participantToReplace);
		updateGroupsMemoryCards();
		return true;
	}
}
class Order{
	constructor(participants, participantsPerGroup){
		let amountOfGroups = participants.length / participantsPerGroup;
		let groupLetter;
		this.groups = {};
		this.freeGroups = [];
		for(let i = 0; i < amountOfGroups; i++){
			groupLetter = String.fromCharCode(i + 65);
			this.groups[groupLetter] = new Group(participantsPerGroup, groupLetter);
			this.freeGroups.push(groupLetter);
		}
		this.groupNames = [...this.freeGroups];
		for(let participant of participants){
			this.addParticipant(participant);
		}
	}
	addParticipant(participant){
		let targetGroup = "";
		participant.setGroupOptions(this.groupNames);
		if(this.freeGroups.length > 0){
			if(this.freeGroups.length == 1){
				targetGroup = this.freeGroups[0];
			}else{
				targetGroup = this.freeGroups[Math.floor(Math.random() * this.freeGroups.length)];
			}
		}
		this.groups[targetGroup].addMember(participant);
		if(this.groups[targetGroup].isFull()){
			this.freeGroups.splice(this.freeGroups.indexOf(targetGroup), 1);
		}
	}
	getKlixuzSpreadSheetData(){
		let retArr = [];
		for(let participant of participants){
			console.log(participant);
			retArr.push(participant.getKlixuzSpreadSheetData());
		}
		navigator.clipboard.writeText(retArr.join("\n"));
	}
	getKlixuzSpreadSheetGroupIDs(){
		let retArr = [];
		for(let i = 0; i < this.groups[this.groupNames[0]].members.length; i++){
			retArr[i] = [];
		}
		for(let i = 0; i < this.groupNames.length; i++){
			for(let j = 0; j < this.groups[this.groupNames[i]].members.length; j++){
				retArr[j].push(this.groups[this.groupNames[i]].members[j].originalIndex + 1);
			}
		}
		for(let i = 0; i < retArr.length; i++){
			retArr[i] = retArr[i].join("\t");
		}
		navigator.clipboard.writeText(retArr.join("\n"));
	}
}
const possibleGroupSizes = [4, 5, 6];
const possibleTournamentSizes = [8, 10, 12, 15, 16, 18, 20, 24, 25, 28, 30, 32, 35, 36, 40, 42];
function groupParticipants(){
	container.innerHTML = "";
	order = new Order(participants, selectedGroupSize);
	getGroupsMemoryCards();
	for(let participant of participants){
		if(participant.presetGroup != false){
			order.groups[participant.presetGroup].switchParticipant(participant);
		}
	}
	for(let onlyAvailableWhenGroupedButton of onlyAvailableWhenGroupedButtons){
		onlyAvailableWhenGroupedButton.disabled = false;
	}
}
function addEntriesToParticipantTable(){
	participantTable.classList.remove("hidden");
	let data = entryInputTextArea.value.split(/\n/);
	let participant;
	for(let i = 0; i < data.length; i++){
		if(data[i] != ""){
			participant = parseLink(data[i].trim());
			if(!participants.contains(participant)){
				participant.originalIndex = participants.length;
				participants.push(participant);
				participantTable.appendChild(participant.tableRow);
			}
		}
	}
	if(possibleTournamentSizes.indexOf(participants.length) == -1){
		for(let onlyAvailableWhenGroupableButton of onlyAvailableWhenGroupableButtons){
			onlyAvailableWhenGroupableButton.disabled = true;
		}
		for(let onlyAvailableWhenGroupedButton of onlyAvailableWhenGroupedButtons){
			onlyAvailableWhenGroupedButton.disabled = true;
		}
	}else{
		for(let onlyAvailableWhenGroupableButton of onlyAvailableWhenGroupableButtons){
			onlyAvailableWhenGroupableButton.disabled = false;
		}
	}
	getPossibleGroupSizes();
}
function getPossibleGroupSizes(){
	groupSizesCheckBoxesSpan.innerHTML = `${participants.length} entries. Available group sizes: `;
	let sizes = [];
	let sizeOptionCheckBox;
	let sizeOptionCheckBoxSpan;
	let sizeOptionCheckBoxGroup = [];
	for(let groupSize of possibleGroupSizes){
		if(participants.length % groupSize == 0){
			sizes.push(groupSize);
			sizeOptionCheckBoxSpan = document.createElement("SPAN");
			sizeOptionCheckBoxSpan.innerText = groupSize;
			sizeOptionCheckBox = document.createElement("INPUT");
			sizeOptionCheckBox.type = "checkbox";
			sizeOptionCheckBoxGroup.push(sizeOptionCheckBox);
			sizeOptionCheckBox.onclick = function(){
				for(let checkBox of sizeOptionCheckBoxGroup){
					checkBox.checked = false;
				}
				this.checked = true;
				selectedGroupSize = groupSize;
			}
			sizeOptionCheckBoxSpan.appendChild(sizeOptionCheckBox);
			groupSizesCheckBoxesSpan.appendChild(sizeOptionCheckBoxSpan);
		}
	}
	if(sizeOptionCheckBoxGroup.length == 0){
		groupSizesCheckBoxesSpan.innerHTML += "None, add more participants.";
	}else{
		sizeOptionCheckBoxGroup[0].click();
	}
}
function getGroupsMemoryCards(){
	groupsMemoryCards.splice(0, groupsMemoryCards.length)
	for(let i = 0; i < order.groupNames.length; i++){
		if(i == (order.groupNames.length - 1)){
			groupsMemoryCards.push(new GroupsMemoryCard([order.groups[order.groupNames[i]]]));
		}else{
			groupsMemoryCards.push(new GroupsMemoryCard([order.groups[order.groupNames[i++]], order.groups[order.groupNames[i]]]));
		}
	}
}
function updateGroupsMemoryCards(){
	for(let groupsMemoryCard of groupsMemoryCards){
		groupsMemoryCard.updateMemoryCard();
	}
}
function getEntriesSpreadSheetString(){
	let textToCopyArr = [];
	for(let participant of participants){
		textToCopyArr.push(participant.getEntriesSpreadSheetString());
	}
	navigator.clipboard.writeText(textToCopyArr.join("\n"));	
}
function getKlixuzSpreadSheetListString(){
	order.getKlixuzSpreadSheetData();
}
function getKlixuzSpreadSheetGroupString(){
	order.getKlixuzSpreadSheetGroupIDs();
}
