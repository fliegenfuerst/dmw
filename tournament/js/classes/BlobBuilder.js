class BlobBuilder{
	constructor(){
		this.parts = [];
		this.blob = undefined;
	}
	wipe(){
		this.parts = [];
		this.blob = undefined;
	}
	append(part){
		this.parts.push(part);
	}
	getBlob(){
		if(!this.blob){
			this.blob = new Blob(this.parts, {type: "text/plain"});
		}
		return this.blob;
	}
}
const blobBuilder = new BlobBuilder();