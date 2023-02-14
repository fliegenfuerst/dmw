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
	let filename = `${new Date().toISOString().slice(0, 10).replaceAll("-", "")}_${screenName}`;
	downloadBlob(memcardReader.getDigimonSavesBlob(), `${filename}.mcr`);
	if(downloadScreenshot){
		html2canvas(document.querySelector('#container')).then(canvas => {
			canvas.toBlob(function(blob) {			
				downloadBlob(blob, `${filename}.png`);
			});
		});
	}
}
var animatedSprites = document.getElementsByClassName("animated-sprite");
var idleState = 0;

window.setInterval(() => {
	idleState = !idleState;
	for(let animatedSprite of animatedSprites){
		animatedSprite.style.objectPosition = "-" + (animatedSprite.spriteSheetOffset + 16 * idleState) + "px 0px";
	}
}, 400);
