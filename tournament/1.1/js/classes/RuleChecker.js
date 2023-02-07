
class RuleChecker{
	constructor(maximumCombinedStats){
		this.isValid = false;
		this.retStr = [];
	}
	setMaximumCombinedStats(limit){
		this.maximumCombinedStats = limit;
		this.check();
	}
	checkMaxCombinedStats(digi){
		let sum = Math.round(digi.hp.value/10);
		sum += Math.round(digi.mp.value/10);
		sum += Math.round(digi.offense.value);
		sum += Math.round(digi.defense.value);
		sum += Math.round(digi.speed.value);
		sum += Math.round(digi.brains.value);
		sum = maxCombinedStats - sum;
		if(sum > 0){
			return `you can still use ${sum} more points in your stats`;
		}else if(sum < 0){
			return `you need to reduce the points you put in your stats by ${Math.abs(sum)}`;
			this.isValid = false;
		}else{
			return `your combined stats match the maximum as per the current rules`;
		}
	}
	checkIsGameBreaking(digiStats){
		let moves = [];
		for(let i = 0; i < digiStats.moves.length; i++){
			if(moves.indexOf(digiStats.moves[i]) == -1){
				moves.push(digiStats.moves[i]);
			}
		}
		if(moves.length < 3){
			return true;
		}
		return false;
	}
	check(){
		this.retStr = [];
		this.isValid = true;
		if(screenName.length < 2){
			this.isValid = false;
			this.retStr.push("please enter a screen name with at least two characters");
		}
		if(maxCombinedStats != 0){
			this.retStr.push(this.checkMaxCombinedStats(memcardReader.saveSlots[0].registeredDigimon[0]));
		}else{
			this.isValid = false;
			this.retStr.push("please enter the maximum combined stats value for the given tournament.");
		}
		if(this.isValid){
			downloadButton.disabled = false;
		}else{
			downloadButton.disabled = true;
		}
		gui.updateRuleCheckerDiv(this.retStr.join("<br>"), this.isValid);
	}
}
const ruleChecker = new RuleChecker();