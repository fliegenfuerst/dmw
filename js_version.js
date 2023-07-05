class Sprite{
	constructor(name, blob){
		this.saveName = name;
		this.blob = blob;
	}
}

function downloadBlob(blob, filename){
	let link = document.createElement('a');
	link.style.display = 'none';
	document.body.appendChild(link);
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();
	document.body.removeChild(link);
}
class SpriteDownloader{
	container = document.createElement("DIV");
	downloadButton = document.createElement("BUTTON");
	drawBackgroundButton = document.createElement("BUTTON");
	flipHorizontallyButton = document.createElement("BUTTON");
	scaleInput = document.createElement("INPUT");
	scaleInputLabel = document.createElement("LABEL");
	animationStateFieldSet = document.createElement("FIELDSET");
	animationStateFieldSetLegend = document.createElement("LEGEND");
	idle1RadioButton = document.createElement("INPUT");
	idle2RadioButton = document.createElement("INPUT");
	attackingRadioButton = document.createElement("INPUT");
	attackedRadioButton = document.createElement("INPUT");
	idle1RadioButtonLabel = document.createElement("LABEL");
	idle2RadioButtonLabel = document.createElement("LABEL");
	attackingRadioButtonLabel = document.createElement("LABEL");
	attackedRadioButtonLabel = document.createElement("LABEL");
	digiSelect = document.createElement("SELECT");
	canvas = document.createElement("CANVAS");
	context;
	backgroundImg = new Image();
	spriteImg = new Image();
	sprites = [];
	animationStateModifier = {x: 0, y: 0};
	scaleFactor = 1;
	hasBackground = false;
	isFlipped = false;
	scaleBy = 1;
	previewDigiIndex = 1;
	currentAnimationState = "idle1";
	constructor(){
		this.downloadButton.innerText = "download sprites";
		this.drawBackgroundButton.innerText = "draw background";
		this.flipHorizontallyButton.innerText = "flip horizontally";
		this.scaleInput.type = "number";
		this.scaleInput.min = 1;
		this.scaleInput.value = 1;
		this.scaleInputLabel.for = this.scaleInput;
		this.scaleInputLabel.innerText = "scale by:";
		this.idle1RadioButton.type = "radio";
		this.idle2RadioButton.type = "radio";
		this.attackingRadioButton.type = "radio";
		this.attackedRadioButton.type = "radio";
		this.idle1RadioButton.name = "state";
		this.idle2RadioButton.name = "state";
		this.attackingRadioButton.name = "state";
		this.attackedRadioButton.name = "state";
		this.idle1RadioButton.value = "idle1";
		this.idle2RadioButton.value = "idle2";
		this.attackingRadioButton.value = "attacking";
		this.attackedRadioButton.value = "attacked";
		this.idle1RadioButtonLabel.for = this.idle1RadioButton;
		this.idle1RadioButtonLabel.innerText = "idle1";
		this.idle2RadioButtonLabel.for = this.idle2RadioButton;
		this.idle2RadioButtonLabel.innerText = "idle2";
		this.attackingRadioButtonLabel.for = this.attackingRadioButton;
		this.attackingRadioButtonLabel.innerText = "attacking";
		this.attackedRadioButtonLabel.for = this.attackedRadioButton;
		this.attackedRadioButtonLabel.innerText = "attacked";
		this.animationStateFieldSetLegend.innerText = "Select an animation state:";
		this.scaleInput._owner = this;
		this.animationStateFieldSet._owner = this;
		this.digiSelect._owner = this;
		this.downloadButton.onclick = this.downloadSprites;
		this.drawBackgroundButton.onclick = this.toggleDrawBackground;
		this.flipHorizontallyButton.onclick = this.toggleIsFlipped;
		this.scaleInput.onchange = this.updateScale;
		this.digiSelect.onchange = this.showSelectedDigi;
		this.animationStateFieldSet.onchange = this.updateAnimationState;
		this.animationStateFieldSet.appendChild(this.animationStateFieldSetLegend);
		this.animationStateFieldSet.appendChild(this.idle1RadioButton);
		this.animationStateFieldSet.appendChild(this.idle1RadioButtonLabel);
		this.animationStateFieldSet.appendChild(this.idle2RadioButton);
		this.animationStateFieldSet.appendChild(this.idle2RadioButtonLabel);
		this.animationStateFieldSet.appendChild(this.attackingRadioButton);
		this.animationStateFieldSet.appendChild(this.attackingRadioButtonLabel);
		this.animationStateFieldSet.appendChild(this.attackedRadioButton);
		this.animationStateFieldSet.appendChild(this.attackedRadioButtonLabel);
		this.canvas.width = 18;
		this.canvas.height = 18;
		let tempOption;
		for(let digi of digimonAlphabetical){
			tempOption = document.createElement("OPTION");
			tempOption.value = digi.id;
			tempOption.innerText = digi.name;
			this.digiSelect.appendChild(tempOption);
		}
		this.digiSelect.selectedIndex = 1;
		this.container.appendChild(this.downloadButton);
		this.container.appendChild(this.drawBackgroundButton);
		this.container.appendChild(this.flipHorizontallyButton);
		this.container.appendChild(this.scaleInputLabel);
		this.container.appendChild(this.scaleInput);
		this.container.appendChild(this.animationStateFieldSet);
		this.container.appendChild(this.digiSelect);
		this.container.appendChild(this.canvas);
		//parent.appendChild(this.container);
		this.context = this.canvas.getContext("2d");
		this.backgroundImg.crossOrigin = "anonymous"
		this.spriteImg.crossOrigin = "anonymous"
		this.backgroundImg.src = 'https://fliegenfuerst.github.io/dw1/stat_tool/bg_box.png';
		this.spriteImg.src = 'https://fliegenfuerst.github.io/dw1/stat_tool/digisprites.png';
		return this.container;
		console.log(this.context);
	}
	
	showSelectedDigi(event){
		this._owner.previewDigiIndex = this.options[event.target.selectedIndex].value;
		this._owner.drawDigi(digimonStats[this._owner.previewDigiIndex]);
	}

	toggleDrawBackground(){
		if(this.hasBackground){
			this.drawBackgroundButton.innerText = "draw background";
		}else{
			this.drawBackgroundButton.innerText = "don't draw background";
		}
		this.hasBackground = !this.hasBackground;
		this.drawDigi(digimonStats[this.previewDigiIndex]);
	}

	toggleIsFlipped(){
		if(this.isFlipped){
			this.flipHorizontallyButton.innerText = "flip horizontally";
		}else{
			this.flipHorizontallyButton.innerText = "don't flip horizontally";
		}
		this.isFlipped = !isFlipped;
		this.drawDigi(digimonStats[this.previewDigiIndex]);
	}

	updateScale(event){
		this._owner.scaleBy = event.target.value;
		this._owner.drawDigi(digimonStats[this._owner.previewDigiIndex]);
	}

	updateAnimationState(event){
		switch(event.target.value){
			case "idle1":
				this._owner.animationStateModifier.x = 0;
				this._owner.animationStateModifier.y = 0;
				this._owner.currentAnimationState = "idle1";
				break;
			case "idle2":
				this._owner.animationStateModifier.x = 1;
				this._owner.animationStateModifier.y = 0;
				this._owner.currentAnimationState = "idle1";
				break;
			case "attacking":
				this._owner.animationStateModifier.x = 0;
				this._owner.animationStateModifier.y = 1;
				this._owner.currentAnimationState = "attacking";
				break;
			case "attacked":
				this._owner.animationStateModifier.x = 1;
				this._owner.animationStateModifier.y = 1;
				this._owner.currentAnimationState = "attacked";
				break;
			default:
				this._owner.animationStateModifier.x = 0;
				this._owner.animationStateModifier.y = 0;
				this._owner.currentAnimationState = "idle1";
		}
		this._owner.drawDigi(digimonStats[this._owner.previewDigiIndex]);
	}

	drawDigi(digi){
		if(this.hasBackground){
			this.canvas.width = 18 * scaleBy;
			this.canvas.height = 18 * scaleBy;
			this.context.webkitImageSmoothingEnabled = false;
			this.context.mozImageSmoothingEnabled = false;
			this.context.imageSmoothingEnabled = false;
			this.context.drawImage(this.backgroundImg, 0, 0, 18, 18, 0, 0, 18 * this.scaleBy, 18 * this.scaleBy);
		}else{
			this.canvas.width = 16 * this.scaleBy;
			this.canvas.height = 16 * this.scaleBy;
		}
		if(this.isFlipped){
			this.context.scale(-1, 1);
			this.context.translate(-canvas.width, 0);
		}
		this.context.webkitImageSmoothingEnabled = false;
		this.context.mozImageSmoothingEnabled = false;
		this.context.imageSmoothingEnabled = false;
		this.context.drawImage(this.spriteImg, 32 * digi.id + this.animationStateModifier.x * 16 , this.animationStateModifier.y * 16, 16, 16, this.hasBackground * this.scaleBy, this.hasBackground * this.scaleBy, 16 * this.scaleBy, 16 * this.scaleBy);
	}
	async storeDigi(digi){
		this.drawDigi(digi);
		const blob = await new Promise(res => this.canvas.toBlob(res));
		this.sprites.push(new Sprite(digi.name + ".png", blob));
	}

	async downloadSprites(){
		this.sprites = [];
		for(let i = 0; i < 128; i++){
			await this.storeDigi(digimonStats[i]);
		}
		this.drawDigi(digimonStats[this.previewDigiIndex]);
		var zip = new JSZip();
		for(let sprite of this.sprites){
			zip.file(sprite.saveName, sprite.blob);
		}
		let zipName = "dw1_sprites";
		if(this.hasBackground){
			zipName += "_bg";
		}
		if(this.isFlipped){
			zipName += "_flipped";
		}
		zipName += "_" + this.currentAnimationState + "_" + this.canvas.width + "x" + this.canvas.height + ".zip"
		this.downloadBlob(await zip.generateAsync({ type: "blob" }), zipName);
	}
	downloadBlob(blob, filename){
		let link = document.createElement('a');
		link.style.display = 'none';
		document.body.appendChild(link);
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		link.click();
		document.body.removeChild(link);
	}
}
document.getElementsByTagName("BODY")[0].appendChild(new SpriteDownloader());
var scaleFactor = 1;
var hasBackground = false;
var isFlipped = false;
var scaleBy = 1;
var previewDigiIndex = 1;
const digiSelect = document.getElementById("digiSelect");
digiSelect.onchange = showSelectedDigi;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
const showNextDigiButton = document.getElementById("showNextDigiButton");
showNextDigiButton.onclick = showNextDigi;
const drawBackgroundButton = document.getElementById("drawBackgroundButton");
drawBackgroundButton.onclick = toggleDrawBackground;
const flipHorizontallyButton = document.getElementById("flipHorizontallyButton");
flipHorizontallyButton.onclick = toggleIsFlipped;
const scaleInput = document.getElementById("scaleInput");
scaleInput.onchange = updateScale;
const animationStateFieldSet = document.getElementById("animationStateFieldset");
animationStateFieldset.onchange = updateAnimationState;
const animationStateModifier = {x: 0, y: 0};
var currentAnimationState = "idle1";
let backgroundImg = new Image();
let spriteImg = new Image();
const sprites = [];
backgroundImg.crossOrigin = "anonymous"
spriteImg.crossOrigin = "anonymous"
backgroundImg.src = 'https://fliegenfuerst.github.io/dw1/stat_tool/bg_box.png';
spriteImg.src = 'https://fliegenfuerst.github.io/dw1/stat_tool/digisprites.png';

function showSelectedDigi(event){
console.log(Object.getOwnPropertyNames(event.target));
	previewDigiIndex = digiSelect.options[event.target.selectedIndex].value;
	drawDigi(digimonStats[previewDigiIndex]);
}

function toggleDrawBackground(){
	if(hasBackground){
		drawBackgroundButton.innerText = "draw background";
	}else{
		drawBackgroundButton.innerText = "don't draw background";
	}
  	hasBackground = !hasBackground;
	drawDigi(digimonStats[previewDigiIndex]);
}

function toggleIsFlipped(){
	if(isFlipped){
		flipHorizontallyButton.innerText = "flip horizontally";
	}else{
		flipHorizontallyButton.innerText = "don't flip horizontally";
	}
  	isFlipped = !isFlipped;
	drawDigi(digimonStats[previewDigiIndex]);
}

function updateScale(event){
	scaleBy = event.target.value;
	drawDigi(digimonStats[previewDigiIndex]);
}

function updateAnimationState(event){
	switch(event.target.value){
		case "idle1":
			animationStateModifier.x = 0;
			animationStateModifier.y = 0;
			currentAnimationState = "idle1";
			break;
		case "idle2":
			animationStateModifier.x = 1;
			animationStateModifier.y = 0;
			currentAnimationState = "idle1";
			break;
		case "attacking":
			animationStateModifier.x = 0;
			animationStateModifier.y = 1;
			currentAnimationState = "attacking";
			break;
		case "attacked":
			animationStateModifier.x = 1;
			animationStateModifier.y = 1;
			currentAnimationState = "attacked";
			break;
		default:
			animationStateModifier.x = 0;
			animationStateModifier.y = 0;
			currentAnimationState = "idle1";
	}
	drawDigi(digimonStats[previewDigiIndex]);
}

function drawDigi(digi){
	if(hasBackground){
		canvas.width = 18 * scaleBy;
		canvas.height = 18 * scaleBy;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(backgroundImg, 0, 0, 18, 18, 0, 0, 18 * scaleBy, 18 * scaleBy);
	}else{
		canvas.width = 16 * scaleBy;
		canvas.height = 16 * scaleBy;
	}
	if(isFlipped){
		ctx.scale(-1, 1);
		ctx.translate(-canvas.width, 0);
	}
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(spriteImg, 32 * digi.id + animationStateModifier.x * 16 , animationStateModifier.y * 16, 16, 16, hasBackground * scaleBy, hasBackground * scaleBy, 16 * scaleBy, 16 * scaleBy);
}

async function storeDigi(digi){
	drawDigi(digi);
	const blob = await new Promise(res => canvas.toBlob(res));
	sprites.push(new Sprite(digi.name + ".png", blob));
}

async function showNextDigi(){
	for(let i = 0; i < 128; i++){
		await storeDigi(digimonStats[i]);
	}
	drawDigi(digimonStats[previewDigiIndex]);
	var zip = new JSZip();
	for(let sprite of sprites){
		zip.file(sprite.saveName, sprite.blob);
	}
	let zipName = "dw1_sprites";
	if(hasBackground){
		zipName += "_bg";
	}
	if(isFlipped){
		zipName += "_flipped";
	}
	zipName += "_" + currentAnimationState + "_" + canvas.width + "x" + canvas.height + ".zip"
	downloadBlob(await zip.generateAsync({ type: "blob" }), zipName);
}
function fillDigimonSelect(){
	let tempOption;
	for(let digi of digimonAlphabetical){
		tempOption = document.createElement("OPTION");
		tempOption.value = digi.id;
		tempOption.innerText = digi.name;
		digiSelect.appendChild(tempOption);
	}
	digiSelect.selectedIndex = 1;
}
fillDigimonSelect();
drawDigi(digimonAlphabetical[previewDigiIndex]);
