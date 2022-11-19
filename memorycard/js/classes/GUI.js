class GUI{
	constructor(memcardReader, container){
		this.container = container;
		this.slotButtonContainer = document.createElement("DIV");
		this.contentDiv = document.createElement("DIV");
		this.contentDiv.style.clear = "both";
		this.contentDiv.style.height = "700px";
		this.contentDiv.style.overflowY = "scroll";
		this.contentDiv.id = "content-div";
		this.menuDiv = new TabButtonsDiv();
		this.selectedSlotIndex = -1;
		this.container.appendChild(this.slotButtonContainer);
		this.container.appendChild(this.menuDiv);
		this.container.appendChild(this.contentDiv);
		this.currentSave = null;
		this.slotButtons = [];
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
		slotButton.disabled = true;
		this.slotButtons[index] = slotButton;
		return slotButton;
	}
	slotButtonClicked(){
		if(!this.disabled){
			gui.selectedSlotIndex = this.id.split("-")[1];
			gui.showSlot();
		}
	}
	showSlot(){
		this.loadSave();
		switch(this.selectedTabIndex){
			case 0:
				this.showCurrentDigimonView();
				break;
			case 1:
				this.showRegisteredDigimonView();
				break;
			case 2:
				this.showPlayerView();
				break;
			case 3:
				this.showWorldView();
				break;
			case 4:
				this.showInventoryView();
				break;
			case 5:
				this.showItemBankView();
				break;
			case 6:
				this.showRecycleShopView();
				break;
			case 7:
				this.showCardView();
				break;
			case 8:
				this.showTriggerView();
				break;
			case 9:
				this.showGameStateView();
				break;
			/*case :
				
				break;*/
			default:
				this.showCurrentDigimonView();
				break;
		}
	}
	loadSave(){
		this.currentSave = memcardReader.saveSlotArray[this.selectedSlotIndex];
	}
	addRegisteredDigimon(){
		memcardReader.saveSlotArray[this.selectedSlotIndex].createRegisteredDigimon();
		this.showRegisteredDigimonView();
	}
	registerCurrentDigimon(){
		memcardReader.saveSlotArray[this.selectedSlotIndex].registerCurrentDigimon();
		this.showRegisteredDigimonView();
	}
	showCurrentDigimonView(){
		this.contentDiv.innerHTML = "";
		let registerCurrentDigimonButton = new RegisterCurrentDigimonButton();
		if(memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon.indexOf(-1) == -1){
			registerCurrentDigimonButton.disabled = true;
		}
		this.contentDiv.appendChild(registerCurrentDigimonButton);
		this.contentDiv.appendChild(new CurrentDigimonTable(memcardReader.saveSlotArray[this.selectedSlotIndex].currentDigimon));
		this.updateTabIndex(0);
	}
	showRegisteredDigimonView(){
		this.contentDiv.innerHTML = "";
		let addDigimonButton = new AddRegisteredDigimonButton();
		if(memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon.indexOf(-1) == -1){
			addDigimonButton.disabled = true;
		}
		this.contentDiv.appendChild(addDigimonButton);
		for(let i = 0; i < memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon.length; i++){
			if(memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon[i] != -1){
				this.contentDiv.appendChild(new RegisteredDigimonTable(memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon[i], i));
			}
		}
		this.updateTabIndex(1);
	}
	showPlayerView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new PlayerTable(memcardReader.saveSlotArray[this.selectedSlotIndex].player));
		this.updateTabIndex(2);
	}
	showWorldView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new WorldTable(memcardReader.saveSlotArray[this.selectedSlotIndex].world));
		this.updateTabIndex(3);
	}
	showInventoryView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new InventoryTable(memcardReader.saveSlotArray[this.selectedSlotIndex].inventory));
		this.updateTabIndex(4);
	}
	showItemBankView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new ItemBankTable(memcardReader.saveSlotArray[this.selectedSlotIndex].itemBank));
		this.updateTabIndex(5);
	}
	showRecycleShopView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new RecycleShopTable(memcardReader.saveSlotArray[this.selectedSlotIndex].recycleShop));
		this.updateTabIndex(6);
	}
	showCardView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new CardTable(memcardReader.saveSlotArray[this.selectedSlotIndex].cards));
		this.updateTabIndex(7);
	}
	showTriggerView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new TriggerTable(memcardReader.saveSlotArray[this.selectedSlotIndex].triggers));
		this.updateTabIndex(8);
	}
	showGameStateView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new GameStateTable(memcardReader.saveSlotArray[this.selectedSlotIndex].gameStates));
		this.updateTabIndex(9);
	}
	updateSlotButtons(){
		this.selectedSlotIndex = -1;
		for(let i = 0; i < memcardReader.saveSlotArray.length; i++){
			if(memcardReader.saveSlotArray[i] == "empty" || memcardReader.saveSlotArray[i] == "unknown"){
				this.slotButtons[i].innerHTML = `Slot ${i+1}<br/>${memcardReader.saveSlotArray[i]}`;
				this.slotButtons[i].disabled = true;
			}else{
				if(this.selectedSlotIndex == -1){
					this.selectedSlotIndex = i;
				}
				this.slotButtons[i].innerHTML = `Slot ${i+1}<br/>${memcardReader.saveSlotArray[i].name}`;
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
		return memcardReader.getDigimonSavesBlob();
	}
	deleteRegisteredDigimon(index){
		memcardReader.saveSlotArray[this.selectedSlotIndex].registeredDigimon[index] = -1;
		this.showRegisteredDigimonView();
	}
	duplicateRegisteredDigimon(index){
		memcardReader.saveSlotArray[this.selectedSlotIndex].duplicateRegisteredDigimon(index);
		this.showRegisteredDigimonView();
	}
}

