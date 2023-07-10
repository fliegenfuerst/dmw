class Helper{
	constructor(){
		this.allowedCharacters = [32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
	}
	getZeroArray(length){
		let arr = [];
		for(let i = 0; i < length; i++){
			arr.push(0);
		}
		return arr;
	}
	get255Array(length){
		let arr = [];
		for(let i = 0; i < length; i++){
			arr.push(255);
		}
		return arr;
	}
	guiNameToPropertyName(string){
		string = string.toLowerCase();
		if(string.indexOf(" ") != -1){
			string = string.split(" ");
			for(let i = 1; i < string.length; i++){
				string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
			}
			string = string.join("");
		}
		return string;
	}
	guiNameToId(string){
		string = string.toLowerCase();
		if(string.indexOf(" ") != -1){
			string = string.split(" ")
			string = string.join("-");
		}
		return string;
	}
	addLeadingZeros(number, length){
		length -= number.toString().length;
		for(let i = 0; i < length; i++){
			number = "0" + number;
		}
		return number;
	}
	valueToSaveArray(value, numberOfBytes){
		let arr = value.toString(16).padStart(numberOfBytes * 2, '0').match(/../g).reverse();
		for(let i = 0; i < numberOfBytes; i++){
			arr[i] = parseInt(arr[i], 16);
		}
		return arr;
	}
	valueToSaveArraySigned(value, numberOfBytes){
		let arr = value.toString(16).padStart(numberOfBytes * 2, '0').match(/../g).reverse();
		
		if(value < 0){
			for(let i = 0; i < numberOfBytes; i++){
				arr[i] = 0xFF - parseInt(arr[i], 16);
			}
				arr[0] += 1;
		}else{
			return this.valueToSaveArray(value, numberOfBytes);
		}
		return arr;
	}
	getEmptyMemoryCardArray(){
		let setValues = [[0, 77], [1, 67], [127, 14]];
		let offset = 128;
		for(let i = 0; i < 15; i++){
			setValues.push(...[[0 + offset, 160], [8 + offset, 255], [9 + offset, 255], [127 + offset, 160]]);
			offset += 128;
		}
		offset = 2048;
		for(let i = 0; i < 20; i++){
			setValues.push(...[[0 + offset, 255], [1 + offset, 255], [2 + offset, 255], [3 + offset, 255], [8 + offset, 255], [9 + offset, 255]]);
			offset += 128;
		}
		setValues.push(...[[8064, 77], [8065, 67], [8191, 14]]);
		let arr = this.getZeroArray(131072);
		for(let i = 0; i < setValues.length; i++){
			arr[setValues[i][0]] = setValues[i][1];
		}
		return arr;
	}
	addDigimonSaveSlot(){
		let arr = this.getEmptyMemoryCardArray();
		return [...arr.slice(0x0,0x80), ...this.getDigimonMemoryCardHeaderArray(0), ...arr.slice(0x100,0x2000), ...this.getBlankDigimonSaveArray(), ...arr.slice(0x4000)];
	}
	getBlankDigimonSaveArray(){
		let arr = [83,67,19,1,130,99,130,137,130,135,130,137,32,49,130,143,130,142,130,115,130,129,130,141,130,133,130,146,0,0,0,0,65,103,117,109,111,110];
		arr.push(...this.getZeroArray(60));
		arr.push(...[95,87,122,58,117,21,205,0,19,0,9,128,247,150,240,141,49,198,247,127,148,82,206,57,107,45,231,28,66,136]);
		arr.push(...[0,0,0,255,255,255,15,0,0,0,255,220,221,221,253,0,0,240,220,237,221,222,238,15,0,207,236,222,237,221,222,15,240,255,190,187,251,254,255,254,223,207,189,189,235,236,254,255,207,206,189,187,235,236,236,254,223,238,238,255,239,238,237,253,255,255,63,255,243,255,254,254,255,47,63,52,242,63,255,255,240,67,241,31,164,255,243,79,0,63,68,19,35,79,244,66,0,52,50,17,33,33,67,67,0,36,49,50,52,50,68,4,0,64,36,18,33,67,4,0,0,0,64,68,68,4,0,0,0,0,0,255,255,255,15,0,0,0,255,220,221,221,255,0,0,240,220,221,221,222,254,15,0,207,237,222,237,222,238,15,240,255,188,187,252,253,255,254,255,222,201,205,236,236,253,255,223,222,185,187,236,236,237,253,223,238,255,255,239,238,237,253,239,255,79,255,243,244,254,254,240,63,63,52,66,65,242,255,240,68,250,19,33,17,255,79,0,63,67,18,50,244,242,66,0,52,50,17,33,33,243,67,0,36,49,85,69,50,68,4,0,64,36,82,37,67,4,0,0,0,64,68,68,4,0,0,0,0,240,255,255,255,15,0,0,240,207,221,221,221,15,0,0,207,220,237,237,222,254,0,0,223,189,186,252,254,255,15,240,206,219,187,236,236,254,255,240,204,187,203,236,236,237,254,239,206,254,255,239,237,237,254,223,254,255,79,243,255,238,253,239,255,63,63,242,241,243,254,255,63,63,18,33,33,255,255,240,52,250,18,50,244,242,66,0,79,67,17,33,33,243,67,0,52,50,85,69,34,67,4,0,52,33,82,85,50,68,0,0,64,68,82,53,67,4,0,0,0,0,68,68,68,0,0]);
		arr.push(...[1,0,0,0,169,255,255,255,0,0,0,0,240,253,255,255,0,0,0,0,169,255,255,255,0,0,0,0,40,253,255,255,0,0,0,0]);
		for(let i = 0; i < 100; i++){
			arr.push(...[255,255,255,0]);
		}
		arr.push(...[0,0,0,0,3,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,130,37,130,37,0,0,0,0,8,0,0,0,16,10,0,0,0,0,0,0,0,0,0,0,19,0,0,0,4,0,0,0,15,0,9,0,90,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,50,0,50,0,50,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,20,0,60,0,0,0,15,0,0,0,0,0,104,1]);
		arr.push(...this.getZeroArray(70));
		arr.push(...[80,0,60,0,70,0,70,0,0,0,0,0,46,255,255,53,32,3,88,2,32,3,88,2,0,0,0,0,4,0,0,0,58,59,60,61,62,63]);
		arr.push(...this.getZeroArray(245));
		arr.push(...[64,0,0,8]);
		arr.push(...this.getZeroArray(125));
		arr.push(...this.get255Array(30));
		arr.push(...this.getZeroArray(30));
		arr.push(...this.get255Array(29));
		arr.push(...[29,10]);
		arr.push(...[130,115,130,129,130,141,130,133,130,146]);
		arr.push(...this.getZeroArray(10));
		arr.push(...[130,96,130,135,130,149,130,141,130,143,130,142]);
		arr.push(...this.getZeroArray(8));
		arr.push(...[3,0,1,1,1,1,1,0,1,0,1,218,238,1,9]);
		arr.push(...this.getZeroArray(60));
		arr.push(...[47,57,0,0,48,62]);
		arr.push(...this.getZeroArray(28));
		let checksum = 0;
		let mirror = [];
		for(let i = 0x200; i < arr.length; i++){
			checksum += arr[i];
			mirror.push(arr[i]);
		}
		checksum = this.valueToSaveArray(checksum, 4);
		arr.push(...checksum);
		arr.push(...this.getZeroArray(2560));
		mirror.push(...checksum);
		arr.push(...mirror);
		arr.push(...this.getZeroArray(2560));
		return arr;
	}
	getDigimonMemoryCardHeaderArray(slotNumber){
		return [...[81,0,0,0,0,32,0,0,255,255,66,65,83,76,85,83,45,48,49,48,51,50,68,77,82], ...[48 + slotNumber], ...this.getZeroArray(101), ...[29 + slotNumber]];
	}
	getDigimonMemoryCardArray(){
		let arr = this.getEmptyMemoryCardArray();
		return [...arr.slice(0x0,0x80), ...this.getDigimonMemoryCardHeaderArray(0), ...arr.slice(0x100,0x2000), ...this.getBlankDigimonSaveArray(), ...arr.slice(0x4000)];
	}
	getGenericMemoryCardBlob(){
		blobBuilder.wipe();
		blobBuilder.append(new Uint8Array(this.getDigimonMemoryCardArray()));
		return blobBuilder.getBlob();
	}
	getJSON(url, callback) {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'json';
		xhr.onload = function() {
			let status = xhr.status;
			if (status === 200) {
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
				}
		};
		xhr.send();
	}
	getAndSentenceFromStringArr(arr){
		if(arr.length == 1){
			return arr[0];
		}else{
			let temp = [];
			for(let i = 0; i < arr.length - 1; i++){
				temp.push(arr[i]);
			}
			return `${temp.join(", ")} and ${arr[arr.length - 1]}`;
		}
	}
	getAndSentenceFromMoveArr(arr){
		if(arr.length == 1){
			return arr[0].name;
		}else{
			let temp = [];
			for(let i = 0; i < arr.length - 1; i++){
				temp.push(arr[i].name);
			}
			return `${temp.join(", ")} and ${arr[arr.length - 1].name}`;
		}
	}
	getOrSentenceFromMoveArr(arr){
		if(arr.length == 1){
			return arr[0].name;
		}else{
			let temp = [];
			for(let i = 0; i < arr.length; i++){
				temp.push(arr[i].name);
			}
			return temp.join(" or ");
		}
	}
	isAllowedCharacter(charCode){
		if (charCode == 48 || (47 < charCode && charCode < 58) || (64 < charCode && charCode < 91) || (96 < charCode && charCode < 123))
			return true;
		return false;
	}
	isAllowedCharacterString(str){
		let retStr = "";
		for(let i = 0; i < str.length; i++){
			if(this.isAllowedCharacter(str.charCodeAt(i))){
				retStr += str.charAt(i);
			}
		}
		return retStr;
	}
}
const helper = new Helper();
