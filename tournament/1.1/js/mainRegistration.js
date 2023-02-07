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
function downloadBlob(blob){
	let link = document.createElement('a');
	link.style.display = 'none';
	document.body.appendChild(link);
	link.href = URL.createObjectURL(blob);
	link.download = `${new Date().toISOString().slice(0, 10).replaceAll("-", "")}_${screenName}.mcr`;
	link.click();
	document.body.removeChild(link);
}
function saveFile(){
	downloadBlob(memcardReader.getDigimonSavesBlob());
}
var animatedSprites = document.getElementsByClassName("animated-sprite");
var idleState = 0;

window.setInterval(() => {
	idleState = !idleState;
	for(let animatedSprite of animatedSprites){
		animatedSprite.style.objectPosition = "-" + (animatedSprite.spriteSheetOffset + 16 * idleState) + "px 0px";
	}
}, 400);
