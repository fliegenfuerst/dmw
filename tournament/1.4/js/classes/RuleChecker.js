const minimumStats = {"hp": 500, "mp": 500, "offense": 50, "defense": 50, "speed": 50, "brains": 50};
const statNames = ["hp", "mp", "offense", "defense", "speed", "brains"];
const simpleRuleTypes = ["maxOffense", "maxDefense", "maxSpeed", "maxBuffMoves", "effectChanceCeiling"];

function countCombinedStats(digi){
	let sum = Math.round(digi.hp.value / 10);
	sum += Math.round(digi.mp.value / 10);
	sum += digi.offense.value;
	sum += digi.defense.value;
	sum += digi.speed.value;
	sum += digi.brains.value;
	return sum;
}
function checkBrainsToSpeedRatio(digi){
	let difference = Math.round(digi.speed.value / 2) - digi.brains.value;
	if(difference <= 0){
		return "ruleFulfilled";
	}else if(difference > 0){
		return `Put at least ${difference} more points into your brains stat to have this much speed.`;
	}
}
function checkMinimumStats(digi){
	let retArr = [];
	for(let statName in statNames){
		if(digi[statName] < minimumStats[statName].value){
			retArr.push(`Put at least ${minimumStats[statName] - digi[statName].value} points into your ${statName} stat.`);
		}
	}
	return retArr;
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
function filterStatusEffects(moves){
	let effects = {};
	for(let move of moves){
		if(move.effect != undefined){
			if(effects[move.effect.type] == undefined){
				effects[move.effect.type] = 1;
			}else{
				effects[move.effect.type]++;
			}
		}
	}
	return effects;
}
function filterNonPoisonAboveEffectChanceCeilingMoves(moves, ceiling){
	let aboveCeilingMoves = [];
	for(let move of moves){
		if(move.effect != undefined && move.effect.type != "POISON" && move.effect.chance > ceiling){
			aboveCeilingMoves.push(move);
		}
	}
	return aboveCeilingMoves;
}
const moveRules = [
{"name": "Aqua Magic", "reduceTotalStatsBy": 45},
{"name": "Mass Morph", "reduceTotalStatsBy": 95},
{"name": "War Cry", "reduceTotalStatsBy": 50},
{"name": "Muscle Charge", "maxDefense": 955, "reduceTotalStatsBy": 135, "maxBuffMoves": 1},
{"name": "Full Potential", "maxOffense": 840, "maxDefense": 840, "maxSpeed": 840, "reduceTotalStatsBy": 200, "maxBuffMoves": 1},
{"name": "Ice Statue", "maxOffense": 910, "maxSpeed": 190, "effectChanceCeiling": 40},
{"name": "Megalo Spark", "maxOffense": 925, "maxSpeed": 265},
{"name": "Insect Plague", "maxDefense": 910, "maxSpeed": 250},
{"name": "Poison Powder", "maxDefense": 940, "maxSpeed": 290},
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
		this.isValid = true;
		this.maxOffense = 999;
		this.maxOffenseReason = false;
		this.maxDefense = 999;
		this.maxDefenseReason = false;
		this.maxSpeed = 999;
		this.maxSpeedReason = false;
		this.minBrains = 50;
		this.minBrainsReason = false;
		this.maxBuffMoves = 2;
		this.maxBuffMovesReason = "You cannot equip more than two buff moves.";
		this.effectChanceCeiling = 100;
		this.effectChanceCeilingReason = false;
		this.reduceTotalStatsBy = 0;
		this.reduceTotalStatsByReason = [];
		this.moves = [];
		this.bannedMoves = [];
		this.buffMovesEquipped = [];
		this.aboveCeilingMoves = [];
		this.statusEffects = 0;
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
		this.statusEffects = filterStatusEffects(this.moves);
		if(this.statusEffects.POISON != undefined){
			this.effectChanceCeiling = 30;
			this.effectChanceCeilingReason = "a poison move";
		}
		this.buffMovesEquipped = filterBuffMoves(this.moves);
		for(let move of this.moves){
			for(let moveRule of moveRules){
				if(move.name == moveRule.name){
					for(let simpleRuleType of simpleRuleTypes){
						if(moveRule[simpleRuleType] != undefined){
							if(this[simpleRuleType] > moveRule[simpleRuleType]){
								this[simpleRuleType] = moveRule[simpleRuleType];
								this[`${simpleRuleType}Reason`] = moveRule.name;
							}
						}
					}
					if(moveRule.reduceTotalStatsBy != undefined){
						this.reduceTotalStatsBy += moveRule.reduceTotalStatsBy;
						this.reduceTotalStatsByReason.push(`${moveRule.name} (reduced by ${moveRule.reduceTotalStatsBy}).`);
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
		let brainsSpeedRule = checkBrainsToSpeedRatio(digi);
		let brainsBuffReduction = 0;
		if(this.buffMovesEquipped.length != 0 && digi.brains.value >= 100){
			this.reduceTotalStatsBy += 50 * Math.floor(digi.brains.value / 100);
			this.reduceTotalStatsByReason.unshift(`${digi.brains.value} brains (reduced by ${50 * Math.floor(digi.brains.value / 100)})`);
		}
		if(brainsSpeedRule != "ruleFulfilled"){
			retArr.push(brainsSpeedRule);
		}
		let tempStr = "";
		let statsDifference = maxCombinedStats - this.reduceTotalStatsBy - countCombinedStats(digi);
		if(statsDifference < 0){
			retArr.push(`Your entry is ${Math.abs(statsDifference)} ${(statsDifference == -1) ? "point" : "points"} over the stat point limit.`);
			this.isValid = false;
		}else if(statsDifference != 0){
			retArr.push(`You may still use ${Math.abs(statsDifference)} ${(statsDifference == 1) ? "point" : "points"} more for your entry.`);
		}
		if(this.reduceTotalStatsBy != 0){
			retArr.push(`<div style="margin-left: -6px; padding-left: 3px;border: solid; border-color: red">Your stat point limit is reduced to ${maxCombinedStats - this.reduceTotalStatsBy} because you have ${helper.getAndSentenceFromStringArr(this.reduceTotalStatsByReason)} equipped.</div>`);
		}
		if(this.moves.length == 1){
			retArr.push(`You need to equip at least one more move.`);
			this.isValid = false;
		}
		if(digi.brains.value < this.minBrains){
			tempStr = `You need to raise your brains to ${this.minBrains}`;
			if(this.minBrainsReason != false){
				tempStr += ` because you have ${this.minBrainsReason} equipped.`;
			} else {
				tempStr += `.`;
			}
			retArr.push(tempStr);
			this.isValid = false;
		}
		if(digi.offense.value > this.maxOffense){
			tempStr = `You need to lower your offense to ${this.maxOffense}`;
			if(this.maxOffenseReason != false){
				tempStr += ` because you have ${this.maxOffenseReason} equipped.`;
			}
			retArr.push(tempStr);
			this.isValid = false;
		}
		if(digi.defense.value > this.maxDefense){
			tempStr = `You need to lower your defense to ${this.maxDefense}`;
			if(this.maxDefenseReason != false){
				tempStr += ` because you have ${this.maxDefenseReason} equipped.`;
			}
			retArr.push(tempStr);
			this.isValid = false;
		}
		if(digi.speed.value > this.maxSpeed){
			tempStr = `You need to lower your speed to ${this.maxSpeed}`;
			if(this.maxSpeedReason != false){
				tempStr += ` because you have ${this.maxSpeedReason} equipped.`;
			}
			retArr.push(tempStr);
			this.isValid = false;
		}
		for(let bannedMove of this.bannedMoves){
			retArr.push(`You need to unequip ${bannedMove} for it is banned.`);
			this.isValid = false;
		}
		if(this.buffMovesEquipped.length > this.maxBuffMoves){
			retArr.push(`You need to reduce the amount of equipped buff moves to ${this.maxBuffMoves} because you have ${this.maxBuffMovesReason} equipped.`);
			this.isValid = false;
		}
		if(Object.keys(this.statusEffects).length == 3){
			retArr.push(`You need to unequip one status effect move, you may only equip two different types of status effect.`);
			this.isValid = false;
		}
		if(this.aboveCeilingMoves.length != 0){
			tempStr = `You need to unequip ${helper.getAndSentenceFromMoveArr(this.aboveCeilingMoves)}`;
			if(this.effectChanceCeilingReason != false){
				tempStr += ` because you have ${this.effectChanceCeilingReason} equipped`;
				if(this.statusEffects.POISON != undefined){
					tempStr += `, the non-poison moves must have an effect-chance of ${this.effectChanceCeiling}% or less.`;
				}else{
					tempStr += `, other status effect moves must have an effect-chance of ${this.effectChanceCeiling}% or less.`;
				}
			}
			retArr.push(tempStr);
			this.isValid = false;
		}
		return retArr;
	}
}
class RuleChecker{
	constructor(maximumCombinedStats){
		this.isValid = false;
		this.retStr = [];
		this.rules = new Rules();
	}
	check(){
		this.retStr = [];
		this.isValid = true;
		if(screenName.length < 2){
			this.isValid = false;
			this.retStr.push("Please enter a screen name with at least two characters.");
		}
		if(maxCombinedStats != 0){
			this.retStr.push(...this.rules.getRulesString(memcardReader.saveSlots[0].registeredDigimon[0]));
			this.isValid = this.rules.isValid;
		}else{
			this.isValid = false;
			this.retStr.push("Please enter the maximum combined stats value for the given tournament.");
		}
		if(this.isValid){
			getEntryButton.disabled = false;
		}else{
			getEntryButton.disabled = true;
		}
		if(this.retStr.length == 0){
			gui.updateRuleCheckerDiv("Your entry is valid.", this.isValid);
		}else{
			gui.updateRuleCheckerDiv(`<li>${this.retStr.join("</li><li>")}</li>`, this.isValid)
		}
	}
}
const ruleChecker = new RuleChecker();
