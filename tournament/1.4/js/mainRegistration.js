const memcardReader = new MemoryCardReader();
const gui = new GUI(memcardReader, document.getElementById("container"));
processBlob(helper.getGenericMemoryCardBlob())
ruleChecker.check();
async function processBlob(blob){
	await memcardReader.loadMemoryCardData(blob);
	gui.showRegisteredDigimonView();
}
function readFile(input) {
	let file = input.files[0];
	let reader = new FileReader();
	reader.readAsArrayBuffer(file);
	reader.onloadend = function() {
		processBlob(new Blob([new Uint8Array(reader.result)], {type: "text/plain"}));
	};
	reader.onerror = function() {
		console.log(reader.error);
	};
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
function saveFile(){
	let filename = getFilename();
	downloadBlob(memcardReader.getDigimonSavesBlob(), `${filename}.mcr`);
}
function getFilename(){
	return `${new Date().toISOString().slice(0, 16).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "")}_${screenName}`;
}
function downloadScreenshot(filename){
	html2canvas(document.querySelector('#container')).then(canvas => {
		canvas.toBlob(function(blob) {			
			downloadBlob(blob, `${filename}.png`);
		});
	});
}
function copyURLToClipBoard(){
	navigator.clipboard.writeText(window.location.href);	
}
function copyDigimonDataToClipBoard(){
	let digi = memcardReader.saveSlots[0].registeredDigimon[0];
	let digiStats = digimonStats[digi.type.value];
	let copyString = "";
	copyString += `${digiStats.name}\n`;
	copyString += `${digi.hp.value}\n`;
	copyString += `${digi.mp.value}\n`;
	copyString += `${digi.offense.value}\n`;
	copyString += `${digi.defense.value}\n`;
	copyString += `${digi.speed.value}\n`;
	copyString += `${digi.brains.value}\n`;
	copyString += `\n`;
	for(let i = 1; i < 4; i++){
		if(digi[`move${i}`].value == 255){
			copyString += ` \n`;
		}else{
			copyString += `${digiStats.moves[digi[`move${i}`].value - 0x2E]}\n`;
		}
	}
	navigator.clipboard.writeText(copyString);
}
function downloadEntry(){
	copyURLToClipBoard();
	linkCopiedToClipboardAlert.classList.remove("hidden");
	linkCopiedToClipboardAlert.classList.add("fade-out");
	setTimeout(function(){
		linkCopiedToClipboardAlert.classList.remove("fade-out");
		linkCopiedToClipboardAlert.classList.add("hidden");
		//downloadScreenshot(getFilename());
	}, 3000);
}
let animatedSprites = document.getElementsByClassName("animated-sprite");
var idleState = 0;
window.setInterval(() => {
	idleState = !idleState;
	for(let animatedSprite of animatedSprites){
		animatedSprite.style.objectPosition = "-" + (animatedSprite.spriteSheetOffset + 16 * idleState) + "px 0px";
	}
}, 400);
window.onhashchange = function(){hashManager.locationHashHasChanged()};
