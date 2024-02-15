function allowDrop(event) {
	event.preventDefault();
}

function drag(event){
	console.log(order);
	event.dataTransfer.setData("text", event.target.id);
}
function drop(event) {
	let data = event.dataTransfer.getData("text");
	if(!event.target.disabled && !(data == event.target.id)){
	console.log("dropped");
		console.log(order);
	console.log("dropped");
		event.preventDefault();

		order.swapParticipants(document.getElementById(data).member, event.target.member);
	}
}

class GUI{
	constructor(memcardReader, container, groupsMemoryCard){
		this.memcardReader = memcardReader;
		this.container = container;
		this.div = document.createElement("DIV");
		this.div.style.border = "solid DarkGrey";
		this.slotButtonContainer = document.createElement("DIV");
		this.menuDiv = new TabButtonsDiv(this);
		this.menuDiv.classList.add("hidden");
		this.contentDiv = document.createElement("DIV");
		this.contentDiv.style.clear = "both";
		this.contentDiv.style.overflowY = "scroll";
		this.contentDiv.id = "content-div";
		this.contentDiv.classList.add("hidden");
		this.selectedSlotIndex = -1;
		this.container.appendChild(this.div);
		this.currentSave = null;
		this.slotButtons = [];
		this.downloadMemoryCardButton = document.createElement("BUTTON");
		this.downloadFirstGroupMemoryCardButton = document.createElement("BUTTON");
		this.downloadSecondGroupMemoryCardButton = document.createElement("BUTTON");
		let memcardName =`Group_${groupsMemoryCard.name}`;
		this.downloadMemoryCardButton.innerHTML = `<b>download<br>${memcardName}</b>`;
		this.downloadMemoryCardButton.memcardReader = memcardReader;
		this.downloadMemoryCardButton.onclick = function(){
			groupsMemoryCard.downloadFullMemoryCard();
		};
		this.div.appendChild(this.downloadMemoryCardButton);
		if(groupsMemoryCard.groups.length == 2){
			this.downloadFirstGroupMemoryCardButton.innerHTML = `<b>download<br>Group_${groupsMemoryCard.groups[0].name}</b>`;
			this.downloadFirstGroupMemoryCardButton.memcardReader = memcardReader;
			this.downloadFirstGroupMemoryCardButton.onclick = function(){
				groupsMemoryCard.downloadHalfMemoryCard(0);
			};
			this.div.appendChild(this.downloadFirstGroupMemoryCardButton);
			
			this.downloadSecondGroupMemoryCardButton.innerHTML = `<b>download<br>Group_${groupsMemoryCard.groups[1].name}</b>`;
			this.downloadSecondGroupMemoryCardButton.memcardReader = memcardReader;
			this.downloadSecondGroupMemoryCardButton.onclick = function(){
				groupsMemoryCard.downloadHalfMemoryCard(1);
			};
			this.div.appendChild(this.downloadSecondGroupMemoryCardButton);
		}
		//this.downloadMemoryCardButton.style = "float: left";
		this.div.appendChild(this.slotButtonContainer);
		this.div.appendChild(this.menuDiv);
		this.div.appendChild(this.contentDiv);
		this.getSlotButtons();
		this.selectedTabIndex = 0;
	}
	getSlotButtons(){
		for(let i = 0; i < 15; i++){
			this.slotButtonContainer.appendChild(this.getSlotButton(i));
		}
	}
	getSlotButton(index){
		let slotButton = document.createElement("button");
		slotButton.gui = this;
		slotButton.className = "slotButton";
		slotButton.id = `slot-${index}`;
		slotButton.innerHTML = `Slot ${index+1}<br/>empty`;
		slotButton.onclick = this.slotButtonClicked;
		slotButton.gui = this;
		slotButton.disabled = true;
		slotButton.index = index;
		slotButton.draggable = true;
		slotButton.ondragstart = drag;
		slotButton.ondragover = allowDrop;
		slotButton.ondrop = drop;
		this.slotButtons[index] = slotButton;
		return slotButton;
	}
	slotButtonClicked(){
		if(!this.disabled){
			if(this.classList.contains("slot-button-selected")){
				this.gui.contentDiv.classList.add("hidden");
				this.gui.menuDiv.classList.add("hidden");
				this.classList.remove("slot-button-selected");
				this.gui.selectedSlotIndex = -1;
			}else{
				this.gui.contentDiv.classList.remove("hidden");
				this.gui.menuDiv.classList.remove("hidden");
				for(let slotButton of this.gui.slotButtons){
					slotButton.classList.remove("slot-button-selected");
				}
				this.classList.add("slot-button-selected");
				this.gui.selectedSlotIndex = this.id.split("-")[1];
				this.gui.showSlot();
			}
		}
	}
	showSlot(){
		this.loadSave();
		switch(this.selectedTabIndex){
			/*case 0:
				this.showCurrentDigimonView();
				this.menuDiv.children[0].classList.add("button-selected");
				break;*/
			case 0:
				this.showRegisteredDigimonView();
				this.menuDiv.children[0].classList.add("button-selected");
				break;
			case 1:
				this.showPlayerView();
				this.menuDiv.children[1].classList.add("button-selected");
				break;
			default:
				this.showRegisteredDigimonView();
				this.menuDiv.children[0].classList.add("button-selected");
				/*this.showCurrentDigimonView();
				this.menuDiv.children[0].classList.add("button-selected");*/
				break;
		}
	}
	loadSave(){
		this.currentSave = this.memcardReader.saveSlotArray[this.selectedSlotIndex];
	}
	showRegisteredDigimonView(){
		this.contentDiv.innerHTML = "";
		for(let i = 0; i < this.memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon.length; i++){
			if(this.memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon[i] != -1){
				this.contentDiv.appendChild(new RegisteredDigimonTable(this.memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon[i], i));
			}
		}
		this.updateTabIndex(0);
	}
	showPlayerView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new PlayerTable(this.memcardReader.saveSlotArray[this.selectedSlotIndex].player));
		this.updateTabIndex(1);
	}
	updateSlotButtons(){
		this.selectedSlotIndex = -1;
		for(let i = 0; i < this.memcardReader.saveSlotArray.length; i++){
			if(this.memcardReader.saveSlotArray[i] == "empty" || this.memcardReader.saveSlotArray[i] == "unknown"){
				this.slotButtons[i].innerHTML = `Slot ${i+1}<br/>${this.memcardReader.saveSlotArray[i]}`;
				this.slotButtons[i].disabled = true;
			}else{
				if(this.selectedSlotIndex == -1){
					this.selectedSlotIndex = i;
				}
				this.slotButtons[i].innerHTML = `Slot ${i+1}<br/>${this.memcardReader.saveSlotArray[i].name}`;
				this.slotButtons[i].disabled = false;
				if(this.memcardReader.saveSlotArray[i].member == 0){alert("what")}
				this.slotButtons[i].member = this.memcardReader.saveSlotArray[i].member;
			}
		}
		if(this.selectedSlotIndex != -1){
			this.showSlot();
		}
	}
	updateTabIndex(index){
		if(this.selectedTabIndex != index){
			this.contentDiv.scrollTop = 0;
		}
		this.selectedTabIndex = index;
	}
	getUpdatedMemoryCard(){
		return this.memcardReader.getDigimonSavesBlob();
	}
}
