const minimumStats = {"hp": 500, "mp": 500, "offense": 50, "defense": 50, "speed": 50, "brains": 50};
const statNames = ["hp", "mp", "offense", "defense", "speed", "brains"];
const simpleRuleTypes = ["maxHP", "maxMP", "maxOffense", "maxDefense", "maxSpeed", "maxBrains", "maxBuffMoves", "effectChanceCeiling"];
const pointBrackets = { 
	0: [1, "0-999"],
	1: [2, "1000-1999"],
	2: [3, "2000-2999"],
	3: [4, "3000-3999"],
	4: [5, "4000-4999"],
	5: [6, "5000-5999"],
	6: [7, "6000-6999"],
	7: [8, "7000-7999"],
	8: [9, "8000-8999"],
	9: [10, "9000-9999"]
};

function getPointsAndString(stat){
	let pointsUsed = 0;
	let costIndex = 0;
	if(stat > 999){
		pointsUsed = 999 * pointBrackets[costIndex++][0];
		stat -= 999;
		while(stat > 1000){
			pointsUsed += 1000 * pointBrackets[costIndex][0];
			stat -= 1000;
			costIndex++;
		}
		pointsUsed += stat * pointBrackets[costIndex][0];
	}else{
		pointsUsed = stat * pointBrackets[costIndex][0];
	}
  return pointsUsed;
}
function countCombinedStats(digi){
	let sum = getPointsAndString(Math.round(digi.hp.value / 10));
	sum += getPointsAndString(Math.round(digi.mp.value / 10));
	sum += getPointsAndString(digi.offense.value);
	sum += getPointsAndString(digi.defense.value);
	sum += getPointsAndString(digi.speed.value);
	sum += getPointsAndString(digi.brains.value);
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
	{"name": "Mass Morph", "reduceTotalStatsBy": 410, "maxOffense": 4750, "maxDefense": 2500, "maxSpeed": 900},
	{"name": "Aqua Magic", "reduceTotalStatsBy": 220, "maxOffense": 4000, "maxDefense": 4000, "maxSpeed": 900},
	{"name": "War Cry", "reduceTotalStatsBy": 300, "maxOffense": 3750, "maxDefense": 4000, "maxSpeed": 900},
	{"name": "Muscle Charge", "reduceTotalStatsBy": 550, "maxOffense": 1750, "maxDefense": 4500},
	{"name": "Full Potential", "reduceTotalStatsBy": 700, "maxOffense": 2050, "maxDefense": 3000, "maxSpeed": 900},
	{"name": "Ice Statue", "maxOffense": 3640, "maxSpeed": 640, "effectChanceCeiling": 40},
	{"name": "Megalo Spark", "maxOffense": 3700, "maxSpeed": 795},
	{"name": "Insect Plague", "maxDefense": 3640, "maxSpeed": 750},
	{"name": "Poison Powder", "maxDefense": 3760, "maxSpeed": 890},
	{"name": "Thunder Justice", "maxOffense": 3600, "maxSpeed": 825},
	{"name": "Wind Cutter", "maxSpeed": 870},
	{"name": "Meltdown", "maxSpeed": 870},
	{"name": "Bug", "maxSpeed": 570},
	{"name": "Counter", "isBanned": true}
];
const combinedMoveRules = [
	{"moves": ["Aqua Magic", "War Cry"], "maxOffense": 3000, "maxDefense": 3500, "maxSpeed": 900}
];
 
class Rules{
	constructor(){
		this.reset();
	}
	reset(){
		this.isValid = true;
		this.maxHP = 30000;
		this.maxHPReason = false;
		this.maxMP = 30000;
		this.maxMPReason = false;
		this.maxOffense = 5000;
		this.maxOffenseReason = false;
		this.maxDefense = 5000;
		this.maxDefenseReason = false;
		this.maxSpeed = 2000;
		this.maxSpeedReason = false;
		this.maxBrains = 1000;
		this.maxBrainsReason = false;
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
			this.minBrains = 750;
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
						this.reduceTotalStatsByReason.push(`${moveRule.name} (stat point limit reduced by ${moveRule.reduceTotalStatsBy})`);
					}
					if(moveRule.isBanned != undefined){
						this.bannedMoves.push(moveRule.name);
					}
				}
			}
		}
		for(let combinedMoveRule of combinedMoveRules){
			let counter = 0;
			for(let move of this.moves){
				if(combinedMoveRule.moves.indexOf(move.name) != -1){
					counter++;
				}
			}
			if(counter == combinedMoveRule.moves.length){
				for(let simpleRuleType of simpleRuleTypes){
					if(combinedMoveRule[simpleRuleType] != undefined){
						if(this[simpleRuleType] > combinedMoveRule[simpleRuleType]){
							this[simpleRuleType] = combinedMoveRule[simpleRuleType];
							this[`${simpleRuleType}Reason`] = helper.getAndSentenceFromStringArr(combinedMoveRule.moves);
						}
					}
				}
				if(combinedMoveRule.reduceTotalStatsBy != undefined){
					this.reduceTotalStatsBy += combinedMoveRule.reduceTotalStatsBy;
					this.reduceTotalStatsByReason.push(`${helper.getAndSentenceFromStringArr(combinedMoveRule.moves)} (stat point limit reduced by ${combinedMoveRule.reduceTotalStatsBy}).`);
				}
				if(combinedMoveRule.isBanned != undefined){
					this.bannedMoves.push(helper.getAndSentenceFromStringArr(combinedMoveRule.moves));
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
			this.reduceTotalStatsBy += 200 * Math.floor(digi.brains.value / 100);
			this.reduceTotalStatsByReason.unshift(`${digi.brains.value} brains (stat point limit reduced by ${200 * Math.floor(digi.brains.value / 100)})`);
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
		if(digi.hp.value > this.maxHP){
			tempStr = `You need to lower your offense to ${this.maxHP}`;
			if(this.maxHPReason != false){
				tempStr += ` because you have ${this.maxHPReason} equipped.`;
			}
			retArr.push(tempStr);
			this.isValid = false;
		}
		if(digi.mp.value > this.maxMP){
			tempStr = `You need to lower your offense to ${this.maxMP}`;
			if(this.maxMPReason != false){
				tempStr += ` because you have ${this.maxMPReason} equipped.`;
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
		if(digi.brains.value > this.maxBrains){
			tempStr = `You need to lower your speed to ${this.maxBrains}`;
			if(this.maxBrainsReason != false){
				tempStr += ` because you have ${this.maxBrainsReason} equipped.`;
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
			gui.updateRuleCheckerDiv(`<li>${this.retStr.join("</li><li>")}</li>`, this.isValid);
		}
	}
}
const ruleChecker = new RuleChecker();
