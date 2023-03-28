/*const rulesSpreadsheet = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTMxg6BRqV6JDFEyS246inLIPHp30f4Nc1o_E6dZOYy5m6UlNCfcqIYqj1jnvkkDk5fdSnGCAM02aSJ/pubhtml";
const rulesJSON = helper.getJSON(
	"https://spreadsheets.google.com/feeds/cells/1X03vl2sHWJ0vlnrwXmehxoVCydCvkpvgs7o1JjOWWSs/od6/public/values?alt=json-in-script",
	function(err, data) {
		if (err !== null) {
			alert('Something went wrong: ' + err);
		} else {
			alert('Your query count: ' + data.query.count);
		}
	}
);
console.log(rulesJSON);*/
const minimumStats = {"hp": 500, "mp": 500, "offense": 50, "defense": 50, "speed": 50, "brains": 50};
const statNames = ["hp", "mp", "offense", "defense", "speed", "brains"];
const simpleRuleTypes = ["maxOffense", "maxDefense", "maxSpeed", "maxBuffMoves", "effectChanceCeiling"];

//const maxCombinedStats = 3000;
function countCombinedStats(digi){
	let sum = Math.round(digi.hp.value / 10);
	sum += Math.round(digi.mp.value / 10);
	sum += Math.round(digi.offense.value);
	sum += Math.round(digi.defense.value);
	sum += Math.round(digi.speed.value);
	sum += Math.round(digi.brains.value);
	return sum;
}
function checkBrainsToSpeedRatio(digi){
	let difference = Math.round(digi.speed.value/2) - digi.brains.value;
	if(difference <= 0){
		return "ruleFulfilled";
	}else if(difference > 0){
		return `put at least ${difference} more points into your brains stat to have this much speed`;
	}
}
function checkMinimumStats(digi){
	let retArr = [];
	for(let statName in statNames){
		if(digi[statName] < minimumStats[statName].value){
			retArr.push(`put at least ${minimumStats[statName] - digi[statName].value} points into your ${statName} stat`);
		}
	}
	return retArr;
}
function countEmptySlots(digi){
	let counter = 0;
	for(let i = 1; i < 4; i++){
		if(digi[`move${i}`].value == digi[`move${i}`].length - 1){
			counter++;
		}
	}
	return counter;
}
function getMoveList(digi){
	
}
const buffMoveNames = ["Aqua Magic", "Full Potential", "Mass Morph", "Muscle Charge", "War Cry"];
function filterBuffMoves(moves){
	let buffMoves = [];
	for(let move of moves){
		if(buffMoveNames.indexOf(move.name) != -1){
			buffMoves.push(move);
		}
	}
	return buffMoves;
}
function filterNonPoisonEffectMoves(moves){
	let nonPoisonEffectMoves = [];
	for(let move of moves){
		if(move.effect != undefined && move.effect.type != "POISON"){
			nonPoisonEffectMoves.push(move);;
		}
	}
	return nonPoisonEffectMoves;
}
function filterPoisonEffectMoves(moves){
	let poisonEffectMoves = [];
	for(let move of moves){
		if(move.effect != undefined && move.effect.type == "POISON"){
			poisonEffectMoves.push(move);;
		}
	}
	return poisonEffectMoves;
}
function filterNonPoisonAboveEffectChanceCeilingMoves(moves, ceiling){
	let aboveCeilingMoves = [];
	for(let move of moves){
		if(move.effect != undefined && move.effect != "POISON" && move.effect.chance > ceiling){
			aboveCeilingMoves.push(move);
		}
	}
	return aboveCeilingMoves;
}
const moveRules = [
{"name": "Muscle Charge", "maxDefense": 955, "reduceTotalStatsBy": 150, "maxBuffMoves": 1},
{"name": "Full Potential", "maxOffense": 840, "maxDefense": 840, "maxSpeed": 840, "reduceTotalStatsBy": 150, "maxBuffMoves": 1},
{"name": "Ice Statue", "maxOffense": 840, "maxSpeed": 190, "effectChanceCeiling": 40},
{"name": "Megalo Spark", "maxOffense": 850, "maxSpeed": 240},
{"name": "Insect Plague", "maxDefense": 910, "maxSpeed": 200},
{"name": "Poison Powder", "maxDefense": 940, "maxSpeed": 250},
{"name": "Thunder Justice", "maxOffense": 900, "maxSpeed": 275},
{"name": "Wind Cutter", "maxSpeed": 290},
{"name": "Meltdown", "maxSpeed": 290},
{"name": "Bug", "isBanned": true},
{"name": "Counter", "isBanned": true}
];
 
class Rules{
	constructor(){
		this.reset();
	}
	reset(){
		this.maxOffense = 999;
		this.maxOffenseReason = false;
		this.maxDefense = 999;
		this.maxDefenseReason = false;
		this.maxSpeed = 999;
		this.maxSpeedReason = false;
		this.minBrains = 50;
		this.minBrainsReason = false;
		this.maxBuffMoves = 2;
		this.maxBuffMovesReason = "you cannot equip more than two buff moves";
		this.maxPoisonMoves = 1;
		this.maxNonPoisonEffectMoves = 2;
		this.maxNonPoisonEffectMovesReason = false;
		this.effectChanceCeiling = 100;
		this.effectChanceCeilingReason = false;
		this.reduceTotalStatsBy = 0;
		this.reduceTotalStatsByReason = [];
		this.bannedMoves = [];
		this.poisonEffectMovesEquipped = [];
		this.nonPoisonEffectMovesEquipped = [];
		this.buffMovesEquipped = [];
		this.amountOfEmptyMoveSlots = 0;
		this.aboveCeilingMoves = [];
		this.moves = [];
	}
	checkRules(digi){
		this.reset();
		let digiStats = digimonStats[digi.type.value];
		this.moves = [];
		for(let i = 1; i < 4; i++){
			if(digi[`move${i}`].value != 255){
				this.moves.push(findMoveByName(digiStats.moves[digi[`move${i}`].value - 0x2E]));
			}
		}
		if(this.moves.length == 2){
			this.minBrains = 200;
			this.minBrainsReason = "only two moves";
			this.maxBuffMoves = 0;
			this.maxBuffMovesReason = "only two moves";
		}
		this.poisonEffectMovesEquipped = filterPoisonEffectMoves(this.moves);
		if(this.poisonEffectMovesEquipped.length > 0){
			this.effectChanceCeiling = 30;
			this.effectChanceCeilingReason = "a poison move";
			this.maxNonPoisonEffectMoves = 1;
			this.maxNonPoisonEffectMovesReason = "a poison move";
		}
		this.nonPoisonEffectMovesEquipped = filterNonPoisonEffectMoves(this.moves);
		this.buffMovesEquipped = filterBuffMoves(this.moves);
		for(let move of this.moves){
			for(let moveRule in moveRules){
				if(move.name == moveRule.name){
					for(let simpleRuleType in simpleRuleTypes){
						if(moveRule[simpleRuleType] != undefined){
							if(this[simpleRuleType] > moveRule[simpleRuleType]){
								this[simpleRuleType] = moveRule[simpleRuleType];
								this[`${simpleRuleType}Reason`] = moveRule.name;
							}
						}
					}/*
					if(moveRule.maxOffense != undefined){
						if(this.maxOffense > moveRule.maxOffense){
							this.maxOffense = moveRule.maxOffense;
							this.maxOffenseReason = moveRule.name;
						}
					}
					if(moveRule.maxDefense != undefined){
						if(this.maxDefense > moveRule.maxDefense){
							this.maxDefense = moveRule.maxDefense;
							this.maxDefenseReason = moveRule.name;
						}
					}
					if(moveRule.maxSpeed != undefined){
						if(this.maxSpeed > moveRule.maxSpeed){
							this.maxSpeed = moveRule.maxSpeed;
							this.maxSpeedReason = moveRule.name;
						}
					}
					if(moveRule.maxBuffMoves != undefined){
						if(this.maxBuffMoves > moveRule.maxBuffMoves){
							this.maxBuffMoves = moveRule.maxBuffMoves;
						}
					}
					if(moveRule.effectChanceCeiling != undefined){
						if(this.effectChanceCeiling > moveRule.effectChanceCeiling){
							this.effectChanceCeiling = moveRule.effectChanceCeiling;
							this.reduceTotalStatsByReason.push(moveRule.name);
						}
					}*/
					if(moveRule.reduceTotalStatsBy != undefined){
						if(this.reduceTotalStatsBy < moveRule.reduceTotalStatsBy){
							this.reduceTotalStatsBy = moveRule.reduceTotalStatsBy;
							this.reduceTotalStatsByReason.push(moveRule.name);
						}
					}
					if(moveRule.isBanned != undefined){
						this.bannedMoves.push(moveRule.name);
					}
				}
			}
		}
		this.aboveCeilingMoves = filterNonPoisonAboveEffectChanceCeilingMoves(this.moves, this.effectChanceCeiling);
	}
	getRulesString(digi){
		this.checkRules(digi);
		let retArr = [];
		let tempStr = "";
		let statsDifference = (maxCombinedStats - this.reduceTotalStatsBy) - countCombinedStats(digi);
		if(statsDifference < 0){
			retArr.push(`your entry is ${Math.abs(statsDifference)} ${(statsDifference == -1) ? "point" : "points"} over the stat point limit`);
		}
		if(this.reduceTotalStatsBy != 0){
			retArr.push(`your stat point limit is reduced to ${maxCombinedStats - this.reduceTotalStatsBy} because you have ${this.reduceTotalStatsByReason} equipped`);
		}
		if(this.moves.length == 1){
			retArr.push(`you need to equip at least one more move`);
		}
		if(digi.brains.value < this.minBrains){
			tempStr = `you need to raise your brains to ${this.minBrains}`;
			if(this.minBrainsReason != false){
				tempStr += ` because you have ${this.minBrainsReason} equipped`;
			}
			retArr.push(tempStr);
		}
		if(digi.offense.value > this.maxOffense){
			tempStr = `you need to lower your offense to ${this.maxOffense}`;
			if(this.maxOffenseReason != false){
				tempStr += ` because you have ${this.maxOffenseReason} equipped`;
			}
			retArr.push(tempStr);
		}
		if(digi.defense.value > this.maxDefense){
			tempStr = `you need to lower your defense to ${this.maxDefense}`;
			if(this.maxDefenseReason != false){
				tempStr += ` because you have ${this.maxDefenseReason} equipped`;
			}
			retArr.push(tempStr);
		}
		if(digi.speed.value > this.maxSpeed){
			tempStr = `you need to lower your offense to ${this.maxSpeed}`;
			if(this.maxSpeedReason != false){
				tempStr += ` because you have ${this.maxSpeedReason} equipped`;
			}
			retArr.push(tempStr);
		}
		for(let bannedMove in this.bannedMoves){
			retArr.push(`you need to unequip ${bannedMove} for it is banned`);
		}
		if(this.buffMovesEquipped.length > this.maxBuffMoves){
			retArr.push(`you need to reduce the amount of equipped buff moves to ${this.maxBuffMoves} because you have ${this.maxBuffMovesReason} equipped`);
		}
		if(this.poisonEffectMovesEquipped.length > 1){
			retArr.push(`you need to unequip all but one poison effect moves, you may only equip one poison move`);
		}else if(this.poisonEffectMovesEquipped.length == 1){
			if(this.nonPoisonEffectMovesEquipped.length > 1){
				retArr.push(`you need to unequip either ${helper.getOrSentenceFromMoveArr(this.nonPoisonEffectMovesEquipped)} because you already have a poison move equipped`);
			}
		}else if(this.nonPoisonEffectMovesEquipped.length >= this.maxNonPoisonEffectMoves){
			if(this.nonPoisonEffectMovesEquipped.length == 3){
				retArr.push(`you are not allowed to equip more than two status effect moves`);
			}else if(this.nonPoisonEffectMovesEquipped[0].effect.type != this.nonPoisonEffectMovesEquipped[1].effect.type){
				retArr.push(`you are not allowed to equip multiple moves different nonpoison status effects, unequip either ${helper.getOrSentenceFromMoveArr(this.nonPoisonEffectMovesEquipped)}`); 
			}
		}
		if(this.aboveCeilingMoves.length != 0){
			tempStr = `you need to unequip ${helper.getAndSentenceFromMoveArr(this.aboveCeilingMoves)}`;
			if(this.effectChanceCeilingReason != false){
				tempStr += ` because you have ${this.effectChanceCeilingReason} equipped`;
			}
			retArr.push(tempStr);
		}
		return retArr.join("<br>");
	}
}
/*class Rule{
	constructor(condition){
		this.condition = condition;
	}
	check(digi){
		
	}
}
class MoveRule extends Rule{
	constructor(moveName, conditions){
		this.moveName = moveName;
	}
	check(moveName){
		if(this.moveName == moveName){
		if(conditions = "BANNED"){
			return "this move is banned";
		}
	}*/
class RuleChecker{
	constructor(maximumCombinedStats){
		this.isValid = false;
		this.retStr = [];
		this.rules = new Rules();
	}
	setMaximumCombinedStats(limit){
		this.maximumCombinedStats = limit;
		this.check();
	}
	checkMaxCombinedStats(digi){
		let tempMaxStats = maxCombinedStats;
		let retStr;
		let buffStr = [];
		let muscleChargeUsed = false;
		let fullPotentialUsed = false;
		let buffMultiplier = 1;
		let digiStats = digimonStats[digi.type.value];
		if(digi.brains.value > 250 && digi.brains.value <= 500){
			buffMultiplier = 2;
		}else if(digi.brains.value > 500 && digi.brains.value <= 750){
			buffMultiplier = 3;
		}else if(digi.brains.value > 750){
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
			if(buffMultiplier > 1){
				buffStr.push(`due to your selection of Muscle Charge, your Stat Point Limit is reduced by ${160} x${buffMultiplier} (${160*buffMultiplier})`);
			}else{
				buffStr.push(`due to your selection of Muscle Charge, your Stat Point Limit is reduced by ${160}`);
			}
		}
		if(fullPotentialUsed){
			tempMaxStats -= 250 * buffMultiplier;
			if(buffMultiplier > 1){
				buffStr.push(`due to your selection of Full Potential, your Stat Point Limit is reduced by ${250} x${buffMultiplier} (${250*buffMultiplier})`);
			}else{
				buffStr.push(`due to your selection of Full Potential, your Stat Point Limit is reduced by ${250}`);
			}
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
		if(buffStr.length != 0){
			return retStr + '<p style="margin:0; border: solid red;">' + buffStr.join("<br>") + '</p>';
		}else{
			return retStr;
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
		let ruleString = "";
		this.retStr = [];
		this.isValid = true;
		if(screenName.length < 2){
			this.isValid = false;
			this.retStr.push("please enter a screen name with at least two characters");
		}
		if(maxCombinedStats != 0){
			this.retStr.push(this.checkMaxCombinedStats(memcardReader.saveSlots[0].registeredDigimon[0]));
			ruleString += "<br>" + this.rules.getRulesString(memcardReader.saveSlots[0].registeredDigimon[0]);
		}else{
			this.isValid = false;
			this.retStr.push("please enter the maximum combined stats value for the given tournament.");
		}
		if(this.isValid){
			downloadButton.disabled = false;
			getEntryButton.disabled = false;
		}else{
			downloadButton.disabled = true;
			getEntryButton.disabled = true;
		}
		gui.updateRuleCheckerDiv(this.retStr.join("<br>") + ruleString, this.isValid);
	}
}
const ruleChecker = new RuleChecker();