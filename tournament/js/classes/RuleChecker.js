const minStats = {hp: 500, mp: 500, offense: 50, defense: 50, speed: 50, brains: 50};
const maxStats = {hp: 65535, mp: 65535, offense: 65535, defense: 65535, speed: 65535, brains: 65535};
const bannedMoves = ["Counter"];
const restrictedMoves = [
	{name: "Muscle Charge", minStats: [["brains", 165]], maxStats: []},
	{name: "Full Potential", minStats: [["brains", 270]], maxStats: []},
	//{name: "", minStats: [["brains", 165]], maxStats: []},
	{name: "Ice Statue", minStats: [], maxStats: [["speed", 225], ["offense", 900]]},
	{name: "Megalo Spark", minStats: [], maxStats: [["speed", 215], ["offense", 900]]},
	{name: "Bug", minStats: [], maxStats: [["speed", 175], ["offense", 860]]},
	{name: "Meltdown", minStats: [], maxStats: [["speed", 260]]},
	{name: "Insect Plague", minStats: [], maxStats: [["speed", 135], ["defense", 670]]},
	{name: "Poison Powder", minStats: [], maxStats: [["speed", 235], ["defense", 79]]},
	//{name: "", minStats: [], maxStats: [["speed", 225, offense", 900]]},
	{name: "Thunder Justice", minStats: [], maxStats: [["speed", 270]]}
];

/*Muscle Charge	165 or more Brains
Full Potential	270 or more Brains
Ice Statue		225 or less Speed, 900 or less Offense
Megalo Spark	215 or less Speed, 900 or less Offense
Bug			175 or less Speed, 860 or less Offense
Meltdown		260 or less Speed
Insect Plague	135 or less Speed, 670 or less Defense
Poison Powder	235 or less Speed, 790 or less Defense
Thunder Justice	270 or less Speed
*/
class RuleChecker{
	constructor(maximumCombinedStats, minimumIndividualStats, bannedMoves){
		this.maximumCombinedStats = 3600;//maximumCombinedStats;
		this.minimumIndividualStats = JSON.parse(JSON.stringify(minStats));
		this.maximumIndividualStats = JSON.parse(JSON.stringify(maxStats));
		this.bannedMoves = bannedMoves;
		this.isValid = false;
	}
	checkMaxCombinedStats(digi){
		let sum = Math.round(digi.maxHp.value/10);
		sum += Math.round(digi.maxMp.value/10);
		sum += Math.round(digi.offense.value);
		sum += Math.round(digi.defense.value);
		sum += Math.round(digi.speed.value);
		sum += Math.round(digi.brains.value);
		sum = this.maximumCombinedStats - sum;
		if(sum > 0){
			return `you can still use ${sum} more points in your stats`;
		}else if(sum < 0){
			return `you need to reduce the points you put in your stats by ${Math.abs(sum)}`;
			this.isValid = false;
		}else{
			return `your combined stats match the maximum as per the current rules`;
		}
	}
	checkHasBeyondBoundaryStat(digi){
		if(digi.maxHp.value > 9999) return true;
		if(digi.maxMp.value > 9999) return true;
		if(digi.offense.value > 999) return true;
		if(digi.defense.value > 999) return true;
		if(digi.speed.value > 999) return true;
		if(digi.brains.value > 999) return true;
		return false;
	}
	checkMinimumIndividualStats(digi){
		let under = [];
		if(digi.maxHp.value < this.minimumIndividualStats.hp) under.push("hp");
		if(digi.maxMp.value < this.minimumIndividualStats.mp) under.push("mp");
		if(digi.offense.value < this.minimumIndividualStats.offense) under.push("offense");
		if(digi.defense.value < this.minimumIndividualStats.defense) under.push("defense");
		if(digi.speed.value < this.minimumIndividualStats.speed) under.push("speed");
		if(digi.brains.value < this.minimumIndividualStats.brains) under.push("brains");
		if(under.length == 0){
			return `all your stats are above the minimum`;
		}else{
			return `your ${this.toSentence(under)} below the minimum requirements`;
			this.isValid = false;
		}
	}
	checkMaximumIndividualStats(digi){
		let over = [];
		if(digi.maxHp.value > this.maximumIndividualStats.hp) over.push("hp");
		if(digi.maxMp.value > this.maximumIndividualStats.mp) over.push("mp");
		if(digi.offense.value > this.maximumIndividualStats.offense) over.push("offense");
		if(digi.defense.value > this.maximumIndividualStats.defense) over.push("defense");
		if(digi.speed.value > this.maximumIndividualStats.speed) over.push("speed");
		if(digi.brains.value > this.maximumIndividualStats.brains) over.push("brains");
		if(over.length == 0){
			return `all your stats are below the maximum`;
		}else{
			return `your ${this.toSentence(over)} above the maximum requirements`;
			this.isValid = false;
		}
	}
	checkBrainsSpeedRule(digi){
		let difference = digi.speed.value/2 - digi.brains.value;
		if(difference > 0){
			return `you have to put ${Math.round(difference)} more points into brains or reduce speed by ${Math.abs(difference) * 2}`;
			this.isValid = false;
		}else if(difference < 0){
			return `you are allowed to put ${Math.round(Math.abs(difference*2))} more points into your speed stat`;
		}else{
			return `your brains and speed stats match the current rules`;
		}
	}
	checkMinMaxSettings(move){
		for(let i = 0; i < restrictedMoves.length; i++){
			if(restrictedMoves[i].name == move){
				for(let j = 0; j < restrictedMoves[i].minStats.length; j++){
					if(this.minimumIndividualStats[restrictedMoves[i].minStats[j][0]] < restrictedMoves[i].minStats[j][1]){
						this.minimumIndividualStats[restrictedMoves[i].minStats[j][0]] = restrictedMoves[i].minStats[j][1];
					}
				}
				for(let j = 0; j < restrictedMoves[i].maxStats.length; j++){
					if(this.maximumIndividualStats[restrictedMoves[i].maxStats[j][0]] > restrictedMoves[i].maxStats[j][1]){
						this.maximumIndividualStats[restrictedMoves[i].maxStats[j][0]] = restrictedMoves[i].maxStats[j][1];
					}
				}
				break;
			}
		}
		//return `${this.checkMaximumIndividualStats(digi)}<br>${this.checkMinimumIndividualStats(digi)}`;
	}
	checkDoesDigimonHaveBuffmove(digiStats){
		let tempMove;
		for(let i = 0; i < digiStats.moves.length; i++){
			tempMove = this.findMove(digiStats.moves[i]);
			if(tempMove.range == "SELF"){
				return true;
			}
		}
		return false;
	}
	findMove(moveName){
		for(let i = 0; i < movesFull.length; i++){
			if(movesFull[i].name == moveName){
				return movesFull[i];
			}
		}
		return -1;
	}
	checkMoves(digi){
		this.minimumIndividualStats = JSON.parse(JSON.stringify(minStats));
		this.maximumIndividualStats = JSON.parse(JSON.stringify(maxStats));
		let retArr = [];
		let emptyCounter = 0;
		let buffCounter = 0;
		let effect = "";
		let hasTooManyEffects = false;
		let temp;
		let digiStats = digimonStats[digi.type.value];
		let tempMove;
		if(this.checkIsGameBreaking(digiStats)){
			retArr.push("the digimon you selected has no attack animations");
			this.isValid = false;
		}
		for(let i = 1; i < 4; i++){
			temp = digi[`move${i}`].value - 0x2E;
			if(temp == 0xD1){
				emptyCounter++;
				continue;
			}else if(bannedMoves.indexOf(digiStats.moves[temp]) > -1){
				retArr.push(`you need to unequip ${digiStats.moves[temp]}, as it is banned`);
				this.isValid = false;
			}else{
				this.checkMinMaxSettings(digiStats.moves[temp]);
			}
			tempMove = this.findMove(digiStats.moves[temp]);
			if(tempMove.effect != undefined){
				if(effect == ""){
					effect = tempMove.effect.type;
				}else{
					if(tempMove.effect.type != effect){
						hasTooManyEffects = true;
					}
				}
			}
			if(tempMove.range == "SELF"){
				buffCounter++;
			}
		}
		if(hasTooManyEffects){
			retArr.push("you are not allowed to equip moves with different status effects");
			this.isValid = false;
		}
		if(buffCounter > 1){
			retArr.push("you have equipped too many buff moves");
			this.isValid = false;
		}
		if(emptyCounter == 1){
			if(!this.checkDoesDigimonHaveBuffmove(digiStats) || buffCounter > 0){
				retArr.push("you may not have an empty move slot without foregoing equipping a buff move");
				this.isValid = false;
			}else if(this.checkDoesDigimonHaveBuffmove(digiStats)){
				this.minimumIndividualStats.brains = 270;
			}
		}else if(emptyCounter > 1){
			retArr.push("you have too many empty move slots");
			this.isValid = false;
		}
		retArr.push(this.checkMaximumIndividualStats(digi));
		retArr.push(this.checkMinimumIndividualStats(digi));
		return retArr.join("<br>");
	}
	toSentence(arr){
		if(arr.length == 0){
			return "";
		}else if(arr.length == 1){
			return arr[0] + " stat is";
		}
		return `${arr.slice(0, -1).join(", ")} and ${arr.slice(-1)} stats are`;
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
	check(index){
		this.isValid = true;
		let digi = memcardReader.saveSlots[0].registeredDigimon[index];
		let retStr = `${this.checkMaxCombinedStats(digi)}<br>${this.checkBrainsSpeedRule(digi)}<br><br>${this.checkMoves(digi)}<br><br>`;
		if(this.checkHasBeyondBoundaryStat(digi)){
			retStr += "your stats are out of bounds, problems might occur, but not necessarily<br><br>";
		}
		if(this.isValid){
			retStr += "your digimon entry is valid according to the current rules";
		}else{
			retStr += "your digimon entry is invalid according to the current rules";
		}
		gui.updateRuleCheckerDiv(retStr, this.isValid);
	}
}
const ruleChecker = new RuleChecker();
