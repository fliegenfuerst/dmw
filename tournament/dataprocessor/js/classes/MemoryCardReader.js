class MemoryCardReader{
	constructor(maxSlots){
		this.blobBuilder = new BlobBuilder();
		this.viewer = null;
		this.headerArray = null;
		this.saveSlotArray = [];
		this.fullArray = [];
		this.maxSlots = maxSlots;
		this.loadMemoryCardData(helper.getGenericMemoryArrayBuffer());
	}
	loadMemoryCardData(arrayBuffer){
		this.fullArray = Array.from(new Uint8Array(arrayBuffer));
		this.headerArray = this.fullArray.slice(0,0x2000);
		this.viewer = new DataView(arrayBuffer);
		this.saveSlotArray = [];
		this.saveSlotDataArray = [];
		let i = 1;
		while(i < 17){
			this.saveSlotDataArray.push(this.fullArray.slice(0x2000 * i++, 0x2000 * i));
		}
		this.findDigimonSaves();
	}
	getNextFreeSlotIndexesTournament(){
		for(let i = 0; i < this.maxSlots + 1; i++){
			if(i == this.maxSlots / 2){
				continue;
			}
			if(!(this.saveSlotArray[i] instanceof DigimonSave)){
				return [i, i];
			}
		}
		return false;
	}
	wipeMemoryCard(){
		for(let i = 0; i < this.saveSlotArray.length; i++){
			this.saveSlotArray[i] = "empty";
		}
	}
	getDigimonSavesBlob(){
		this.blobBuilder.wipe();
		this.blobBuilder.append(new Uint8Array(this.headerArray));
		for(let i = 0; i < this.saveSlotArray.length; i++){
			if(this.saveSlotArray[i] == "empty"){
				this.blobBuilder.append(new Uint8Array(helper.getZeroArray(0x2000)));
			}else if(this.saveSlotArray[i] instanceof DigimonSave){
				this.blobBuilder.append(new Uint8Array(this.saveSlotArray[i].getSaveArray()));
			}else{
				this.blobBuilder.append(new Uint8Array(this.saveSlotDataArray[i]));
			}
		}
		return this.blobBuilder.getBlob();
	}
	addDigimonSave(){
		let indexes = this.getNextFreeSlotIndexesTournament();
		if(indexes == false)
			return -1;
		this.headerArray = new Array(...this.headerArray.slice(0, 0x80 * (indexes[0] + 1)), ...helper.getDigimonMemoryCardHeaderArray(indexes[1]), ...this.headerArray.slice(0x80 * (indexes[0] + 2), this.headerArray.length));
		this.saveSlotArray[indexes[0]] = new DigimonSave(helper.getBlankDigimonSaveArray());
		return indexes[0];			
	}
	findDigimonSaves(){
		let tempOffset;
		let offset = 0x80;
		let productCode;
		let index;
		while(offset < 0x800){
			index = offset/0x80-1;
			productCode = this.viewer.getBigUint64(offset + 0xF, true);
			if(productCode == 4914046425491320147n){
				tempOffset = offset/0x80*0x2000;
				this.saveSlotArray[index] = new DigimonSave(this.saveSlotDataArray[index]);
			}else if(productCode == 0n){
				this.saveSlotArray[index] = "empty";
			}else{
				this.saveSlotArray[index] = this.saveSlotDataArray[index];
			}
			offset += 0x80;
		}
	}
}