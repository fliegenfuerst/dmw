class Value{
	constructor(offset, value, type){
		this.offset = offset;
		this.type = type;
		this.value = value;
	}	
}
class DigimonSave{
	constructor(arrayBuffer){
		this.viewer = new DataView(arrayBuffer);
		this.saveArray = Array.from(new Uint8Array(arrayBuffer));
		this.registeredDigimon = this.getRegisteredDigimonData();
		this.getCurrentDigimonData();
		this.name = this.readStringExclusive(0x0, 0x1E);
		this.createRegisteredDigimon();
		this.tamerName = new Value(0x667, this.readString(0x667, 14), "string");
	}
	getSaveArray(){
		if(this.tamerName.value == "Tamer"){
			this.tamerName.value = screenName.slice(0, 6);
		}
		this.writeString(0x12, this.tamerName.value, 6);
		this.writeString(this.tamerName.offset, this.tamerName.value, 6);
		let name = digimonStats[this.registeredDigimon[0].type.value].name;
		let temp = helper.getZeroArray(17);
		for(let i = 0; i < name.length; i++){
			temp[i] = name.charCodeAt(i);
		}
		this.writeBytes(0x20, temp);
		for(let i = 0; i < this.registeredDigimon.length; i++){
			if(this.registeredDigimon[i] != -1){
				this.writeData(this.registeredDigimon[i]);
			}else{
				this.writeEmptyRegisteredSlot(i);
			}
		}
		this.updateCurrentDigimon()
		this.writeData(this.currentDigimon);
		this.updateChecksum();
		return this.saveArray;
	}
	readByte(offset){
		return this.viewer.getUint8(offset);
	}
	readShort(offset){
		return this.viewer.getUint16(offset, true);
	}
	readSignedShort(offset){
		return this.viewer.getInt16(offset, true);
	}
	readInt(offset){
		return this.viewer.getUint32(offset, true);
	}
	readString(offset, length){
		let name = "";
		let character;
		for(let i = 1; i < length; i++) {
			character = this.readByte(offset + i);
			if(character == 64) {
				name += " ";
			}else if(character != 0){
				if(character > 128) {
					name += String.fromCharCode(character - 32);
				}else {
					name += String.fromCharCode(character - 31);
				}
			}
			if(this.readByte(offset + ++i) == 0){
				break;
			}
		}
		return name;
	}
	readStringExclusive(offset, length){
		let name = "";
		let character;
		for(let i = 1; i < length; i += 2) {
			character = this.readByte(offset+i);
			if(character == 64) {
				name += " ";
			}else if(character != 0){
				if(character > 128 && character < 155) {
					name += String.fromCharCode(character - 32);
				}else if(character > 95 && character < 122){
					name += String.fromCharCode(character - 31);
				}
			}
		}
		return name;
	}
	writeByte(offset, value){
		this.saveArray[offset] = value;
		this.saveArray[0xF00 + offset] = value;
	}
	writeBytes(offset, values){
		for(let i = 0; i < values.length; i++){
			this.saveArray[offset + i] = values[i];
			this.saveArray[0xF00 + offset + i] = values[i];
		}
	}
	writeShort(offset, values){
		this.saveArray[offset] = values[0];
		this.saveArray[offset + 1] = values[1];
	}
	writeString(offset, string, length){
		let charCode;
		let arr = [];
		for(let i = 0; i < length; i++){
			if(i < string.length){
				charCode = string.charCodeAt(i);
				arr.push(130);
				if(charCode > 96){
					arr.push(charCode + 32);
				}else{
					arr.push(charCode + 31);
				}
			}else{
				arr.push(0);
			}
		}
		this.writeBytes(offset, arr);
	}
	updateChecksum(){
		this.writeBytes(0x6FC, [0, 0, 0, 0]);
		let checksum = 0;
		for(let i = 0x200; i < 0x10FF; i++){
			checksum += this.saveArray[i];
		}
		this.writeBytes(0x6FC, helper.valueToSaveArray(checksum, 4));
	}
	writeEmptyRegisteredSlot(index){
		this.writeBytes(0x700 + 0x40 * index, helper.getZeroArray(0x40));
	}
	getRegisteredDigimonData(){
		let offset = 0x700;
		let temp = this.readShort(offset);
		let digi = {};
		let digis = [];
		let count = 0;
		while(count < 40){
			if(temp != 0){
				digi = {};
				digi.maxHp = new Value(offset, temp, "short");
				offset += 0x2;
				digi.maxMp = new Value(offset, this.readShort(offset), "short");
				offset += 0x2;
				digi.offense = new Value(offset, this.readShort(offset), "short");
				offset += 0x2;
				digi.defense = new Value(offset, this.readShort(offset), "short");
				offset += 0x2;
				digi.speed = new Value(offset, this.readShort(offset), "short");
				offset += 0x2;
				digi.brains = new Value(offset, this.readShort(offset), "short");
				offset += 0x2;
				digi.discipline = new Value(offset, this.readShort(offset), "short");
				offset += 0x2;
				digi.name = new Value(offset, this.readString(offset, 14), "string");
				offset += 0xE;
				digi.type = new Value(offset, this.readByte(offset++), "byte");
				digi.move1 = new Value(offset, this.readByte(offset++), "byte");
				digi.move2 = new Value(offset, this.readByte(offset++), "byte");
				digi.move3 = new Value(offset, this.readByte(offset), "byte");
				digis.push(digi);
			}else{
				digis.push(-1);
			}
			count++;
			offset = 0x700 + count * 0x40;
			temp = this.readShort(offset);
		}
		return digis;
	}
	createRegisteredDigimon(){
		let count = 0;
		while(this.registeredDigimon[count] != -1){
			count++;
		}
		if(count < 40){
			let offset = 0x700 + count * 0x40;
			let digi = {};
			digi.hp = new Value(offset, 500, "short");
			offset += 0x2;
			digi.mp = new Value(offset, 500, "short");
			offset += 0x2;
			digi.offense = new Value(offset, 50, "short");
			offset += 0x2;
			digi.defense = new Value(offset, 50, "short");
			offset += 0x2;
			digi.speed = new Value(offset, 50, "short");
			offset += 0x2;
			digi.brains = new Value(offset, 50, "short");
			offset += 0x2;
			digi.discipline = new Value(offset, 100, "short");
			offset += 0x2;
			digi.name = new Value(offset, "Daioh", "string");
			offset += 0xE;
			digi.type = new Value(offset++, 0xA, "byte");
			digi.move1 = new Value(offset++, 0x2E, "byte");
			digi.move2 = new Value(offset++, 0xFF, "byte");
			digi.move3 = new Value(offset, 0xFF, "byte");
			this.registeredDigimon[count] = digi;
		}
	}
	setLearnedMove(moveName){
		let offset;
		let bitPosition;
		for(let i = 0; i < moves.length; i++){
			if(moveName == moves[i]){
				bitPosition = i % 8;
				offset = (i - bitPosition) / 8;
				this.writeByte(0x03BC + offset, this.saveArray[0x03BC + offset] | (1 << bitPosition));
			}
		}
	}
	writeData(data){
		let propertyNames = Object.getOwnPropertyNames(data);
		for(let i = 0; i < propertyNames.length; i++){
			switch(data[propertyNames[i]].type){
					case "firstNibble":
						this.writeNibble(data[propertyNames[i]].offset, data[propertyNames[i]].value, true);
						break;
					case "secondNibble":
						this.writeNibble(data[propertyNames[i]].offset, data[propertyNames[i]].value, false);
						break;
					case "byte":
						if(propertyNames[i].indexOf("move") != -1){
							this.setLearnedMove(digimonStats[data.type.value].moves[data[propertyNames[i]].value - 0x2E]);
						}
						this.writeByte(data[propertyNames[i]].offset, data[propertyNames[i]].value);
						break;
					case "short":
						this.writeBytes(data[propertyNames[i]].offset, helper.valueToSaveArray(data[propertyNames[i]].value, 2));
						break;
					case "signedShort":
						this.writeBytes(data[propertyNames[i]].offset, helper.valueToSaveArraySigned(data[propertyNames[i]].value, 2));
						break;
					case "string":
						this.writeString(data[propertyNames[i]].offset, data[propertyNames[i]].value, 6);
						break;
				}
		}
	}
	getCurrentDigimonData(){
		let offset = 0x3B8;
		this.currentDigimon = {};
		this.currentDigimon.type = new Value(offset, this.readByte(offset), "byte");
		offset = 0x3E0;
		let conditionByte = this.readByte(offset);
		this.currentDigimon.conditionFlags = new Value(offset, this.readByte(offset), "byte");
		offset += 0x4;
		this.currentDigimon.sleepyHour = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sleepyMinute = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.wakeUpHour = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.wakeUpMinute = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.standardAwakeTime = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.standardSleepTime = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.awakeTimeThisDay = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sicknessCounter = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.missedSleepHours = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.tirednessSleepTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.poopLevel = new Value(offset, this.readShort(offset), "short");
		offset += 0x6;
		this.currentDigimon.virusBar = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.poopingTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.tiredness = new Value(offset, this.readShort(offset), "short");
		offset += 0x4;
		this.currentDigimon.tirednessHungerTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.discipline = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.happiness = new Value(offset, this.readSignedShort(offset), "signedShort");
		offset += 0xA;
		this.currentDigimon.areaEffectTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sicknessTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x6;
		this.currentDigimon.saturation = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.foodTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.starvationTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.weight = new Value(offset, this.readByte(offset), "byte");
		offset += 0x6;
		this.currentDigimon.remainingLifetime = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.age = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.trainingBoostFlag = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.trainingBoostMultiplier = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.trainingBoostTimer = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.careMistakes = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.battles = new Value(offset, this.readShort(offset), "short");
		offset += 0xA;
		this.currentDigimon.fishCaught = new Value(offset, this.readShort(offset), "short");
		offset += 0x8;
		this.currentDigimon.upgradeCounterHp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.upgradeCounterMp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.upgradeCounterOffense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.upgradeCounterBrainsBugged = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.upgradeCounterDefense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.upgradeCounterSpeed = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.upgradeCounterBrainsUnused = new Value(offset, this.readShort(offset), "short");
		offset += 0x4;
		this.currentDigimon.sukamonBackupHp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sukamonBackupMp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sukamonBackupOffense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sukamonBackupDefense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sukamonBackupSpeed = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.sukamonBackupBrains = new Value(offset, this.readShort(offset), "short");
		offset = 0x470;//stats start
		this.currentDigimon.offense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.defense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.speed = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.brains = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.movePriorities = new Value(offset, this.readShort(offset), "short");
		offset += 0x4;
		this.currentDigimon.move1 = new Value(offset, this.readByte(offset++), "byte");
		this.currentDigimon.move2 = new Value(offset, this.readByte(offset++), "byte");
		this.currentDigimon.move3 = new Value(offset, this.readByte(offset), "byte");
		offset += 0x2;
		this.currentDigimon.maxHp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.maxMp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.currentHp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		this.currentDigimon.currentMp = new Value(offset, this.readShort(offset), "short");
		offset = 0x67B;
		this.currentDigimon.name = new Value(offset, this.readString(offset, 14), "string");
		offset = 0x68F;
		this.currentDigimon.livesLeft = new Value(offset, this.readByte(offset), "byte");
	}
	updateCurrentDigimon(){
		let digi = this.registeredDigimon[0];
		this.currentDigimon.name.value = digi.name.value;
		this.currentDigimon.type.value = digi.type.value;
		this.currentDigimon.maxHp.value = digi.hp.value;
		this.currentDigimon.maxMp.value = digi.mp.value;
		this.currentDigimon.currentHp.value = digi.hp.value;
		this.currentDigimon.currentMp.value = digi.mp.value;
		this.currentDigimon.offense.value = digi.offense.value;
		this.currentDigimon.defense.value = digi.defense.value;
		this.currentDigimon.speed.value = digi.speed.value;
		this.currentDigimon.brains.value = digi.brains.value;
		this.currentDigimon.move1.value = digi.move1.value;
		this.currentDigimon.move2.value = digi.move2.value;
		this.currentDigimon.move3.value = digi.move3.value;
	}
}
