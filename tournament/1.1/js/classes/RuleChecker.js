
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
		let tempMaxStats = maxCombinedStats;
		let retStr;
		let buffStr = '';
		let muscleChargeUsed = false;
		let fullPotentialUsed = false;
		let buffMultiplier = 1;
		let digiStats = digimonStats[digi.type.value];
		if(digi.brains.value > 250 && digi.brains.value <= 500){
			buffMultiplier = 2;
		}else if(digi.brains.value > 500 && digi.brains.value <= 750){
			buffMultiplier = 3;
		}else if(digi.brains.value > 750 && digi.brains.value <= 1000){
			buffMultiplier = 4;
		}
		for(let i = 1; i < 4; i++){
			if(digiStats.moves[digi[`move${i}`].value - 0x2E] == "Muscle Charge"){
				muscleChargeUsed = true;
			}else if(digiStats.moves[digi[`move${i}`].value - 0x2E] == "Full Potential"){
				fullPotentialUsed = true;
			}
		}
		let sum = Math.round(digi.hp.value / 10);
		sum += Math.round(digi.mp.value / 10);
		sum += Math.round(digi.offense.value);
		sum += Math.round(digi.defense.value);
		sum += Math.round(digi.speed.value);
		sum += Math.round(digi.brains.value);

		if(muscleChargeUsed){
			tempMaxStats -= 160 * buffMultiplier;
			buffStr +=`<br>due to your selection of Muscle Charge, your Stat Point Limit is reduced by ${160 * buffMultiplier}`;
		}
		if(fullPotentialUsed){
			tempMaxStats -= 250 * buffMultiplier;
			buffStr += `<br>due to your selection of Full Potential, your Stat Point Limit is reduced by ${250 * buffMultiplier}`;
		}
		
		sum = tempMaxStats - sum;
		if(sum > 0){
			retStr = `you can still use ${sum} more points in your stats`;
		}else if(sum < 0){
			retStr = `you need to reduce the points you put in your stats by ${Math.abs(sum)}`;
			//this.isValid = false;
		}else{
			retStr = `your combined stats match the maximum as per the current rules`;
		}
		return retStr + buffStr;
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
