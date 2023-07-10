const chars="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
function intToUrl(value){
	let digit;
	let residual = value;
	let result = "";
	while(true){
		digit = residual % 64;
		result = chars.charAt(digit) + result;
		residual = Math.floor(residual / 64);
		if (residual == 0)
			break;
	}
	return result;
}
function urlToInt(url){
	let result = 0;
	for(let h = 0; h < url.length; h++){
		result += chars.indexOf(url[h]) * Math.pow(64, (url.length - h - 1));
	}
	return result;
}
function base64url(str) {
    return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function unbase64url(str) {
    return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}
class HashSegment{
	constructor(segmentTarget, type, isClear){
		this.segmentTarget = segmentTarget;
		this.type = type;
		this.isClear = isClear;
	}
	toHashSegment(){
		switch(this.type){
			case "string":
				return this.isClear ? this.segmentTarget.value : base64url(this.segmentTarget.value);
			case "number":
				return this.isClear ? this.segmentTarget.valueAsNumber : intToUrl(this.segmentTarget.valueAsNumber);
			case "select":
				return this.isClear ? this.segmentTarget.selectedIndex : intToUrl(this.segmentTarget.selectedIndex);
		}
	}
	fromHashSegment(urlSegment){
		switch(this.type){
			case "string":
				return this.isClear ? this.segmentTarget.setValue(urlSegment) : this.segmentTarget.setValue(unbase64url(urlSegment));
				break;
			case "number":
			case "select":
				return this.isClear ? this.segmentTarget.setValue(urlSegment) : this.segmentTarget.setValue(urlToInt(urlSegment));
				break;
		}
		return false;
	}
}
class HashManager{
	constructor(){
		this.segments = [];
		this.currentHash = "";
		this.currentHashArray = [];
		this.isInvalid = false;
	}
	registerSegment(segmentTarget, type, isClear){
		this.segments.push(new HashSegment(segmentTarget, type, isClear));
	}
	updateHash(){
		this.currentHashArray = [];
		for(let segment of this.segments){
			this.currentHashArray.push(segment.toHashSegment());
		}
		window.location.hash = "!" + this.currentHashArray.join("/");
		this.currentHash = window.location.hash;
	}
	locationHashHasChanged(){
		this.isInvalid = false;
		if(window.location.hash == ""){
			window.location.hash = "!/VGFtZXI/0/RGFpb2g/1w/7Q/7Q/O/O/O/O/0/b/b";
		}
		this.currentHashArray = window.location.hash.substr(2, window.location.hash.length).split("/");
		if(this.segments.length != this.currentHashArray.length){
			alert("invalid url parameters");
			this.updateHash();
		}else if(window.location.hash != this.currentHash){
			for(let i = 0; i < this.segments.length; i++){
				if(this.segments[i].fromHashSegment(this.currentHashArray[i])){
					this.isInvalid = true;
				}
			}
			this.currentHash = window.location.hash;
		}
		if(this.isInvalid)
			this.updateHash();
	}
}
const hashManager = new HashManager();
