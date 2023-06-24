let updateableValues = ["name", "type", "maxHp", "maxMp", "offense", "defense", "speed", "brains", "move1", "move2", "move3"];
class Value{
	constructor(offset, value, type){
		this.offset = offset;
		this.type = type;
		this.value = value;
	}
	readBit(bitPosition) {
		return (this.value & (1 << bitPosition)) === 0 ? false : true;
	}
	toggleBit(bitPosition) {
		this.value = this.value ^ (1 << bitPosition);
	}
	setBit(bitPosition) {
		this.value = this.value | (1 << bitPosition);
	}
	unsetBit(bitPosition) {
		this.value = this.value & (1 << bitPosition);
	}
}
class ConditionFlags extends Value{
	constructor(offset, value, type){
		super(offset, value, type);
		this.isSleepy = this.readBit(0);
		this.isTired = this.readBit(1);
		this.isHungry = this.readBit(2);
		this.hasToPoop = this.readBit(3);
		this.isUnhappy = this.readBit(4);
		this.isInjured = this.readBit(5);
		this.isSick = this.readBit(6);
	}
	readBit(bitPosition) {
		return (this.value & (1 << bitPosition)) === 0 ? false : true;
	}
	toggleBit(bitPosition) {
		this.value = this.value ^ (1 << bitPosition);
	}
	setBit(bitPosition) {
		this.value = this.value | (1 << bitPosition);
	}
	unsetBit(bitPosition) {
		this.value = this.value & (1 << bitPosition);
	}
}
class DigimonSave{
	constructor(array){
		this.viewer = new DataView(new Uint8Array(array).buffer);
		this.saveArray = array;
		this.registeredDigimon = this.getRegisteredDigimonData();
		this.currentDigimon = this.getCurrentDigimonData();
		this.player = this.getPlayerData();
		this.world = this.getWorldData();
		this.inventory = this.getInventoryData();
		this.itemBank = this.getItemBankData();
		this.recycleShop = this.getRecycleShopData();
		this.cards = this.getCardsData();
		this.triggers = this.getTriggerData();
		this.gameStates = this.getGameStateData();
		this.name = this.readStringExclusive(0x0, 0x1E);
		this.screenName = "";
	}
	updateSaveName(tamerName, digimonType){
		this.name = "               ";
		this.name = tamerName;
		for(let i = 0; i < 7 - tamerName.length; i++){
			this.name += " ";
		}
		this.name += digimonType;
	}
	setScreenName(name){
		this.screenName = name;
	}
	getSaveArray(){
		this.writeString(0x12, this.player.name.value, 6);
		let name = digimonStats[this.currentDigimon.type.value].name;
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
		this.updateCurrentDigimon(this.registeredDigimon[0]);
		this.writeData(this.currentDigimon);
		this.writeData(this.player);
		this.writeSaveName();
		this.updateChecksum();
		return this.saveArray;
	}
	readNibble(offset, isFirst){
		if(isFirst){
			return this.viewer.getUint8(offset) & 0xF;
		}else{
			return this.viewer.getUint8(offset) >> 4;
		}
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
	writeNibble(offset, value, isFirst){
		let temp = this.saveArray[offset];
		if(isFirst){
			temp = (this.saveArray[offset] & 0xF0) + (value & 0xF);
		}else{
			temp = (this.saveArray[offset] & 0xF) + (value << 4);
			
		}
		this.saveArray[offset] = temp;
		this.saveArray[0xF00 + offset] = temp;
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
	writeBytesSigned(offset, values){
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
	writeSaveName(){
		let name = digimonStats[this.currentDigimon.type.value].name;
		let temp = helper.getZeroArray(17);
		for(let i = 0; i < name.length; i++){
			temp[i] = name.charCodeAt(i);
		}
		this.writeBytes(0x20, temp);
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
	registerDigimonfromLinkData(linkDigi){
		let count = 0;
		while(this.registeredDigimon[count] != -1){
			count++;
		}
		if(count < 40){
			let offset = 0x700 + count * 0x40;
			let digi = {};
			digi.maxHp = new Value(offset, linkDigi.maxHp, "short");
			offset += 0x2;
			digi.maxMp = new Value(offset, linkDigi.maxMp, "short");
			offset += 0x2;
			digi.offense = new Value(offset, linkDigi.offense, "short");
			offset += 0x2;
			digi.defense = new Value(offset, linkDigi.defense, "short");
			offset += 0x2;
			digi.speed = new Value(offset, linkDigi.speed, "short");
			offset += 0x2;
			digi.brains = new Value(offset, linkDigi.brains, "short");
			offset += 0x2;
			digi.discipline = new Value(offset, 50, "short");
			offset += 0x2;
			digi.name = new Value(offset, linkDigi.name, "string");
			offset += 0xE;
			digi.type = new Value(offset++, linkDigi.type, "byte");
			digi.move1 = new Value(offset++, linkDigi.move1, "byte");
			digi.move2 = new Value(offset++, linkDigi.move2, "byte");
			digi.move3 = new Value(offset, linkDigi.move3, "byte");
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
			if(data[propertyNames[i]] instanceof Value){
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
						this.writeString(data[propertyNames[i]].offset, data[propertyNames[i]].value, 7);
						break;
				}
			}
		}
	}
	getCurrentDigimonData(){
		let offset = 0x3B8;
		let digi = {};
		digi.type= new Value(offset, this.readByte(offset), "byte");
		offset = 0x470;//stats start
		digi.offense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		digi.defense = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		digi.speed = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		digi.brains = new Value(offset, this.readShort(offset), "short");
		offset += 0x6;
		digi.move1 = new Value(offset, this.readByte(offset++), "byte");
		digi.move2 = new Value(offset, this.readByte(offset++), "byte");
		digi.move3 = new Value(offset, this.readByte(offset), "byte");
		offset += 0x2;
		digi.maxHp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		digi.maxMp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		digi.currentHp = new Value(offset, this.readShort(offset), "short");
		offset += 0x2;
		digi.currentMp = new Value(offset, this.readShort(offset), "short");
		offset = 0x67B;//name start
		digi.name = new Value(offset, this.readString(offset, 14), "string");
		offset = 0x68F;
		digi.lives = new Value(offset, this.readByte(offset), "byte");
		return digi;
	}
	updateCurrentDigimon(){
		for(let valueName of updateableValues){
			this.currentDigimon[valueName].value = this.registeredDigimon[0][valueName].value;
		}
	}
	getPlayerData(){
		let player = {};
		player.bits = new Value(0x3B4, this.readShort(0x3B4), "short");
		player.meritPoints = new Value(0x464, this.readShort(0x464), "short");
		player.startedBattles = new Value(0x466, this.readShort(0x466), "short");
		player.runAways = new Value(0x468, this.readShort(0x468), "short");
		player.tournamentsWon = new Value(0x46A, this.readShort(0x46A), "short");
		player.tournamentBattlesWon = new Value(0x46C, this.readShort(0x46C), "short");
		player.tournamentsLost = new Value(0x46E, this.readShort(0x46E), "short");
		player.name = new Value(0x667, this.readString(0x667, 14), "string");
		player.tamerLevel = new Value(0x690, this.readByte(0x690), "byte");
		player.raisedDigimon = new Value(0x691, this.readByte(0x691), "byte");
		return player;
	}
	updatePlayerName(name){
		this.player.name.value = name;
	}
	getWorldData(){
		let world = {};
		world.year = new Value(0x3D0, this.readShort(0x3D0), "short");
		world.day = new Value(0x3D2, this.readShort(0x3D2), "short");
		world.hour = new Value(0x3D4, this.readShort(0x3D4), "short");
		world.minute = new Value(0x3D6, this.readShort(0x3D6), "short");
		world.hoursPlayed = new Value(0x3DA, this.readShort(0x3DA), "short");
		world.minutesPlayed = new Value(0x3DC, this.readShort(0x3DC), "short");
		world.currentScreen = new Value(0x69A, this.readByte(0x69A), "byte");
		world.lastScreen = new Value(0x69B, this.readByte(0x69B), "byte");
		return world;
	}
	getRecycleShopData(){
		let recycleShop = [];
		let offset = 0x496;
		while(offset < 0x04E4){
			recycleShop.push(new Value(offset, this.readByte(offset++), "byte"));
		}
		return recycleShop;
	}
	getItemBankData(){
		let itemBank = [];
		let offset = 0x4E4;
		while(offset < 0x0564){
			itemBank.push(new Value(offset, this.readByte(offset++), "byte"));
		}
		return itemBank;
	}
	getCardsData(){
		let cards = [];
		let offset = 0x564;
		while(offset < 0x585){
			cards.push(new Value(offset, this.readNibble(offset, true), "firstNibble"));
			cards.push(new Value(offset, this.readNibble(offset++, false), "secondNibble"));
		}
		return cards;
	}
	getTriggerData(){
		let triggers = [];
		let offset = 0x585;
		while(offset < 0x05E9){
			triggers.push(new Value(offset, this.readByte(offset++), "byte"));
		}
		return triggers;
	}
	getGameStateData(){
		let gameStates = [];
		let offset = 0x5E9;
		while(offset < 0x060C){
			gameStates.push(new Value(offset, this.readByte(offset++), "byte"));
		}
		return gameStates;
	}
	getInventoryData(){
		let inventory = {};
		let offset = 0x60C;
		for(let i = 0; i < 30; i++){
			inventory[`slot${i}Id`] = new Value(offset + i, this.readByte(offset + i), "byte");
			inventory[`slot${i}Amount`] = new Value(offset + 30 + i, this.readByte(offset + 30 + i), "byte");
			inventory[`slot${i}Name`] = new Value(offset + 60 + i, this.readByte(offset + 60 + i), "byte");
		}
		inventory.size = new Value(0x666, this.readByte(0x666), "byte");
		return inventory;
	}
}
