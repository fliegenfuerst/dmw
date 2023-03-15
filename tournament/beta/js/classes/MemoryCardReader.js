class MemoryCardReader{
	constructor(){
		this.blobBuilder = new BlobBuilder();
		this.viewer = null;
		this.headerBlob = null;
		this.saveSlots = [];
		this.saveSlotBlobs = [];
		this.saveSlotArrayBuffers = [];
	}
	async getBlankMemoryCardInfo(blob){
		this.viewer = new DataView(await blob.arrayBuffer());
		let temp;
		let arr = [];
		for(let i = 0; i < this.viewer.byteLength; i++){
			temp = this.viewer.getUint8(i);
			if(temp != 0){
				arr.push([i, temp]);
				console.log(temp);
			}
		}
	}
	async loadMemoryCardData(blob){
		this.headerBlob = blob.slice(0,0x2000);
		this.viewer = new DataView(await blob.arrayBuffer());
		this.saveSlots = [];
		this.saveSlotBlobs = [];
		this.saveSlotArrayBuffers = [];
		let tempBlob;
		let i = 1;
		while(i < 17){
			tempBlob = blob.slice(0x2000 * i++, 0x2000 * i);
			this.saveSlotBlobs.push(tempBlob);
			this.saveSlotArrayBuffers.push(await tempBlob.arrayBuffer());
		}
		this.findDigimonSaves();
	}
	getDigimonSavesBlob(){
		this.blobBuilder.wipe();
		this.blobBuilder.append(this.headerBlob);
		for(let i = 0; i < this.saveSlots.length; i++){
			if(this.saveSlots[i] == "empty" || this.saveSlots[i] == "unknown"){
				this.blobBuilder.append(this.saveSlotBlobs[i]);
			}else{
				this.blobBuilder.append(new Uint8Array(this.saveSlots[i].getSaveArray()));
			}
		}
		return this.blobBuilder.getBlob();
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
				this.saveSlots[index] = new DigimonSave(this.saveSlotArrayBuffers[index]);
			}else if(productCode == 0n){
				this.saveSlots[index] = "empty";
			}else{
				this.saveSlots[index] = "unknown";
			}
			offset += 0x80;
		}
	}
}