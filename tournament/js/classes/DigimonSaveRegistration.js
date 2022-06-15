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
		//this.writeData(this.registeredDigimon[0]);
		this.updateChecksum();
		return this.saveArray;
	}
	readByte(offset){
		return this.viewer.getUint8(offset);
	}
	readShort(offset){
		return this.viewer.getUint16(offset, true);
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
			digi.maxHp = new Value(offset, 500, "short");
			offset += 0x2;
			digi.maxMp = new Value(offset, 500, "short");
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
			digi.name = new Value(offset, "Savior", "string");
			offset += 0xE;
			digi.type = new Value(offset++, 0x11, "byte");
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
				case "byte":
					if(propertyNames[i].indexOf("move") != -1){
						this.setLearnedMove(digimonStats[data.type.value].moves[data[propertyNames[i]].value - 0x2E]);
					}
					this.writeByte(data[propertyNames[i]].offset, data[propertyNames[i]].value);
					break;
				case "short":
					this.writeBytes(data[propertyNames[i]].offset, helper.valueToSaveArray(data[propertyNames[i]].value, 2));
					break;
				case "string":
					this.writeString(data[propertyNames[i]].offset, data[propertyNames[i]].value, 6);
					break;
			}
		}
	}
}