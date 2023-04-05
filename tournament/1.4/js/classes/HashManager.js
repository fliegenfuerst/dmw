const chars="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
function intToUrl(value){
	let digit;
	let residual = value;
	let result = '';
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
    return btoa(str).replace(/=+$/, '').replace(/\+/g,'-').replace(/\//g, '_');
}
function unbase64url(str) {
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
}
class Segment{
	constructor(segmentTarget, type, isClear){
		this.segmentTarget = segmentTarget;
		this.type = type;
		this.isClear = isClear;
	}
	toHashSegment(){
		if(this.isClear){
			switch(this.type){
				case "string":
					return this.segmentTarget.value;
				case "number":
					return this.segmentTarget.valueAsNumber;
				case "select":
					return this.segmentTarget.selectedIndex;
			}

		}else{
			switch(this.type){
				case "string":
					return base64url(this.segmentTarget.value);
				case "number":
					return intToUrl(this.segmentTarget.valueAsNumber);
				case "select":
					return intToUrl(this.segmentTarget.selectedIndex);
			}
		}
	}
	fromHashSegment(urlSegment){
		if(this.isClear){
			switch(this.type){
				case "string":
					this.segmentTarget.setValue(urlSegment);
					break;
				case "number":
				case "select":
					this.segmentTarget.setValue(urlSegment);
					break;
			}
		}else{
			switch(this.type){
				case "string":
					this.segmentTarget.setValue(unbase64url(urlSegment));
					break;
				case "number":
				case "select":
					this.segmentTarget.setValue(urlToInt(urlSegment));
					break;
			}
		}
	}
}
class HashManager{
	constructor(){
		this.segments = [];
		this.currentHash = '';
		this.currentHashArray = [];
	}
	registerSegment(segmentTarget, type, isClear){
		this.segments.push(new Segment(segmentTarget, type, isClear));
	}
	updateHash(){
		this.currentHashArray = [];
		for(let segment of this.segments){
			this.currentHashArray.push(segment.toHashSegment());
		}
		window.location.hash = "!" + this.currentHashArray.join("/");
		this.currentHash = window.location.hash;
	}
	locationHashChanged(){
		if(window.location.hash == ''){
			window.location.hash = "!/VGFtZXI/0/RGFpb2g/1w/7Q/7Q/O/O/O/O/0/b/b";
		}
		this.currentHashArray = window.location.hash.substr(2, window.location.hash.length).split("/");
		if(this.segments.length != this.currentHashArray.length){
			alert("invalid url parameters");
			this.updateHash();
		}else if(window.location.hash != this.currentHash){
			for(let i = 0; i < this.segments.length; i++){
				this.segments[i].fromHashSegment(this.currentHashArray[i]);
			}
			this.currentHash = window.location.hash;
		}
	}
}
const hashManager = new HashManager();
