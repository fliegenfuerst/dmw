class GUI{
	constructor(memcardReader, container){
		this.container = container;
		this.contentDiv = document.createElement("DIV");
		this.contentDiv.style = "clear: both;";
		this.container.appendChild(this.contentDiv);
		this.ruleCheckerDiv = new RuleCheckerDiv();
	}
	showRegisteredDigimonView(){
		this.contentDiv.innerHTML = "";
		this.contentDiv.appendChild(new NameTable(memcardReader.saveSlots[0]));
		this.contentDiv.appendChild(new RegisteredDigimonTable(memcardReader.saveSlots[0].registeredDigimon[0], 0));
		this.contentDiv.appendChild(this.ruleCheckerDiv);
	}
	getUpdatedMemoryCard(){
		return memcardReader.getDigimonSavesBlob();
	}
	updateRuleCheckerDiv(str, isValid){
		this.ruleCheckerDiv.updateRuleText(str);
		if(isValid){
			//this.ruleCheckerDiv.style.backgroundColor = "LightGreen";
		}else{
			this.ruleCheckerDiv.style.backgroundColor = "Coral";
		}
	}
}
