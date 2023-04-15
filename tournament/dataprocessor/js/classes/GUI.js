class GUI{
	constructor(memcardReader, container, groupName){
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
		let memcardName =`Group_${groupName}`;
		this.downloadMemoryCardButton.innerHTML = `<b>download<br>${memcardName}</b>`;
		this.downloadMemoryCardButton.memcardReader = memcardReader;
		this.downloadMemoryCardButton.onclick = function(){
			let link = document.createElement('a');
			link.style.display = 'none';
			document.body.appendChild(link);
			link.href = URL.createObjectURL(this.memcardReader.getDigimonSavesBlob());
			link.download = `${new Date().toISOString().slice(0, 16).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "")}_${memcardName}.mcr`;
			link.click();
			document.body.removeChild(link);
		};
		//this.downloadMemoryCardButton.style = "float: left";
		this.div.appendChild(this.downloadMemoryCardButton);
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

