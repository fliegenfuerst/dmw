class GUI{
	constructor(memcardReader, container){
		this.container = container;
		this.contentDiv = document.createElement("DIV");
		this.contentDiv.style = "clear: both;";
		this.container.appendChild(this.contentDiv);
		this.RuleCheckerUL = new RuleCheckerUL();
	}
	showRegisteredDigimonView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new NameTable(memcardReader.saveSlots[0]));
		this.contentDiv.appendChild(new RegisteredDigimonTable(memcardReader.saveSlots[0].registeredDigimon[0], 0));
		this.contentDiv.appendChild(this.RuleCheckerUL);
		decorateSelects();
		hashManager.locationHashHasChanged();
	}
	getUpdatedMemoryCard(){
		return memcardReader.getDigimonSavesBlob();
	}
	updateRuleCheckerDiv(str, isValid){
		if(isValid){
			this.RuleCheckerUL.style.backgroundColor = "White";
			str = "<li>Your Entry is valid.</li>" + str;
		}else{
			this.RuleCheckerUL.style.backgroundColor = "Coral";
		}
		this.RuleCheckerUL.updateRuleText(str);
	}
}
