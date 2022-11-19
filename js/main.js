const memcardReader = new MemoryCardReader();
const gui = new GUI(memcardReader, document.getElementById("container"));
const digimonWorldSaves = [];
processBlob(helper.getGenericMemoryCardBlob());
async function processBlob(blob){
	await memcardReader.loadMemoryCardData(blob);
	gui.updateSlotButtons();
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
	link.download = 'memcard.mcr';
	link.click();
	document.body.removeChild(link);
}
function saveFile(){
	downloadBlob(memcardReader.getDigimonSavesBlob());
}