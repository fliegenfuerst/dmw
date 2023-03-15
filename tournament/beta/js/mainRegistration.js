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
function copyURLToClipBoard(){
	navigator.clipboard.writeText(window.location.href);	
}
function downloadEntry(){
	copyURLToClipBoard();
	linkCopiedToClipboardAlert.classList.remove("hidden");
	linkCopiedToClipboardAlert.classList.add("fade-out");
	setTimeout(function(){
		linkCopiedToClipboardAlert.classList.remove("fade-out");
		linkCopiedToClipboardAlert.classList.add("hidden");
	}, 3000);
}
animatedSprites = document.getElementsByClassName("animated-sprite");
var idleState = 0;
window.setInterval(() => {
	idleState = !idleState;
	for(let animatedSprite of animatedSprites){
		animatedSprite.style.objectPosition = "-" + (animatedSprite.spriteSheetOffset + 16 * idleState) + "px 0px";
	}
}, 400);
window.onhashchange = function(){hashManager.locationHashChanged()};
