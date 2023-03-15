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
function countEmptySlots(digi){
	let counter = 0;
	for(let i = 1; i < 4; i++){
		if(digi[`move${i}`].value == digi[`move${i}`].length - 1){
			counter++;
		}
	}
	return counter;
}
const buffMoveNames = ["Aqua Magic", "Full Potential", "Mass Morph", "Muscle Charge", "War Cry"];
function buffCounter(digi){
	let digiStats = digimonStats[digi.type.value];
	let counter = 0;
	for(let i = 1; i < 4; i++){
		if(buffMoveNames.indexOf(digiStats.moves[digi[`move${i}`].value - 0x2E]) != -1){
			counter++;
		}
	}
	return counter;
}
function nonPoisonEffectCounter(digi){
	let digiStats = digimonStats[digi.type.value];
	let counter = 0;
	let move;
	for(let i = 1; i < 4; i++){
		move = findMoveByName(digiStats.moves[digi[`move${i}`].value - 0x2E])
		if(move.effect != undefined && move.effect.type != "POISON"){
			counter++;
		}
	}
	return counter;
}
function poisonEffectCounter(digi){
	let digiStats = digimonStats[digi.type.value];
	let counter = 0;
	let move;
	for(let i = 1; i < 4; i++){
		move = findMoveByName(digiStats.moves[digi[`move${i}`].value - 0x2E])
		if(move.effect != undefined && move.effect.type == "POISON"){
			counter++;
		}
	}
	return counter;
}
const moveRules = [
{"name": "Muscle Charge", "maxDefense": 955, "reduceTotalStats": 160, "maxBuffMoves": 1},
{"name": "Full Potential", "maxOffense": 840, "maxDefense": 840, "maxSpeed": 840, "maxBuffMoves": 1},
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
		this.maxOffense = false;
		this.maxDefense = false;
		this.maxSpeed = false;
		this.maxBuffMoves = 2;
		this.reduceTotalStats = 0;
	}
	checkMoves(digi){
		let digiStats = digimonStats[digi.type.value];
		for(let i = 1; i < 4; i++){
			for(let moveRule in moveRules){
				if(digiStats.moves[digi[`move${i}`].value - 0x2E] == moveRule.name){
					if(moveRule.maxOffense != undefined){
						if(this.maxOffense > moveRule.maxOffense){
							this.maxOffense = moveRule.maxOffense;
						}
					}
					if(moveRule.maxDefense != undefined){
						if(this.maxDefense > moveRule.maxDefense){
							this.maxDefense = moveRule.maxDefense;
						}
					}
					if(moveRule.maxSpeed != undefined){
						if(this.maxSpeed > moveRule.maxSpeed){
							this.maxSpeed = moveRule.maxSpeed;
						}
					}
					if(moveRule.maxBuffMoves != undefined){
						if(this.maxBuffMoves > moveRule.maxBuffMoves){
							this.maxBuffMoves = moveRule.maxBuffMoves;
						}
					}
					if(moveRule.reduceTotalStats != undefined){
						if(this.reduceTotalStats < moveRule.reduceTotalStats){
							this.reduceTotalStats = moveRule.reduceTotalStats;
						}
					}
				}
			}
		}
	}
	checkRules(digi){
		let retStr = [];
		this.checkMoves(digi);
		if(digi.offense.value > this.maxOffense){
			retStr.push(`lower offense to ${this.maxOffense}`);
		}
		if(digi.defense.value > this.maxDefense){
			retStr.push(`lower defense to ${this.maxDefense}`);
		}
		if(digi.speed.value > this.maxSpeed){
			retStr.push(`lower speed to ${this.maxSpeed}`);
		}
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
			getEntryButton.disabled = false;
		}else{
			downloadButton.disabled = true;
			getEntryButton.disabled = true;
		}
		gui.updateRuleCheckerDiv(this.retStr.join("<br>"), this.isValid);
	}
}
const ruleChecker = new RuleChecker();