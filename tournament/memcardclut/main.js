let clutHex = ["00", "00", "5F", "57", "7A", "3A", "75", "15", "CD", "00", "13", "00", "09", "80", "F7", "96", "F0", "8D", "31", "C6", "F7", "7F", "94", "52", "CE", "39", "6B", "2D", "E7", "1C", "42", "88"];
let firstFrameHex = ["00", "00", "00", "FF", "FF", "FF", "0F", "00", "00", "00", "FF", "DC", "DD", "DD", "FD", "00", "00", "F0", "DC", "ED", "DD", "DE", "EE", "0F", "00", "CF", "EC", "DE", "ED", "DD", "DE", "0F", "F0", "FF", "BE", "BB", "FB", "FE", "FF", "FE", "DF", "CF", "BD", "BD", "EB", "EC", "FE", "FF", "CF", "CE", "BD", "BB", "EB", "EC", "EC", "FE", "DF", "EE", "EE", "FF", "EF", "EE", "ED", "FD", "FF", "FF", "3F", "FF", "F3", "FF", "FE", "FE", "FF", "2F", "3F", "34", "F2", "3F", "FF", "FF", "F0", "43", "F1", "1F", "A4", "FF", "F3", "4F", "00", "3F", "44", "13", "23", "4F", "F4", "42", "00", "34", "32", "11", "21", "21", "43", "43", "00", "24", "31", "32", "34", "32", "44", "04", "00", "40", "24", "12", "21", "43", "04", "00", "00", "00", "40", "44", "44", "04", "00", "00"];
let secondFrameHex = ["00", "00", "00", "FF", "FF", "FF", "0F", "00", "00", "00", "FF", "DC", "DD", "DD", "FF", "00", "00", "F0", "DC", "DD", "DD", "DE", "FE", "0F", "00", "CF", "ED", "DE", "ED", "DE", "EE", "0F", "F0", "FF", "BC", "BB", "FC", "FD", "FF", "FE", "FF", "DE", "C9", "CD", "EC", "EC", "FD", "FF", "DF", "DE", "B9", "BB", "EC", "EC", "ED", "FD", "DF", "EE", "FF", "FF", "EF", "EE", "ED", "FD", "EF", "FF", "4F", "FF", "F3", "F4", "FE", "FE", "F0", "3F", "3F", "34", "42", "41", "F2", "FF", "F0", "44", "FA", "13", "21", "11", "FF", "4F", "00", "3F", "43", "12", "32", "F4", "F2", "42", "00", "34", "32", "11", "21", "21", "F3", "43", "00", "24", "31", "55", "45", "32", "44", "04", "00", "40", "24", "52", "25", "43", "04", "00", "00", "00", "40", "44", "44", "04", "00", "00"];
let thirdFrameHex = ["00", "00", "F0", "FF", "FF", "FF", "0F", "00", "00", "F0", "CF", "DD", "DD", "DD", "0F", "00", "00", "CF", "DC", "ED", "ED", "DE", "FE", "00", "00", "DF", "BD", "BA", "FC", "FE", "FF", "0F", "F0", "CE", "DB", "BB", "EC", "EC", "FE", "FF", "F0", "CC", "BB", "CB", "EC", "EC", "ED", "FE", "EF", "CE", "FE", "FF", "EF", "ED", "ED", "FE", "DF", "FE", "FF", "4F", "F3", "FF", "EE", "FD", "EF", "FF", "3F", "3F", "F2", "F1", "F3", "FE", "FF", "3F", "3F", "12", "21", "21", "FF", "FF", "F0", "34", "FA", "12", "32", "F4", "F2", "42", "00", "4F", "43", "11", "21", "21", "F3", "43", "00", "34", "32", "55", "45", "22", "43", "04", "00", "34", "21", "52", "55", "32", "44", "00", "00", "40", "44", "52", "35", "43", "04", "00", "00", "00", "00", "44", "44", "44", "00", "00"];

function hex2bin(hex){
	return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}
function hexToTwoPixelIndexes(hex){
	let temp = hex2bin(hex);
	return [parseInt(temp.substring(4, 9), 2), parseInt(temp.substring(0, 4), 2)];
}
function hexToClutPixel(hexArr){
	let pixel = {};
	let temp = hex2bin(hexArr[1]) + hex2bin(hexArr[0]);
	pixel.red = parseInt(temp.substring(11, 16), 2) * 8;
	pixel.green = parseInt(temp.substring(6, 11), 2) * 8;
	pixel.blue = parseInt(temp.substring(1, 6), 2) * 8;
	pixel.isSemiTransparent = temp.substring(0, 1) == true;
	if(parseInt(temp) == 0){
		pixel.alpha = 0;
	}else{
		pixel.alpha = 255;
	}
	return pixel;
}
const palette = [];
for(let i = 0; i < clutHex.length; i++){
	palette.push(hexToClutPixel([clutHex[i++], clutHex[i]]));
}
function frameHexToImageData(frameHex){
	let framePixelIndexes = [];
	for(let i = 0; i < frameHex.length; i++){
		framePixelIndexes.push(...hexToTwoPixelIndexes(frameHex[i]));
	}
	let framePixels = [];
	for(let i = 0; i < framePixelIndexes.length; i++){
		framePixels.push(palette[framePixelIndexes[i]]);
	}
	let data = [];
	let pixel;
	for(let i = 0; i < framePixels.length; i++){
		pixel = framePixels[i];
		data.push(pixel.red);
		data.push(pixel.green);
		data.push(pixel.blue);
		data.push(pixel.alpha);
	}
	return data;
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let originalScaleImageCanvas = document.createElement("canvas");
originalScaleImageCanvas.width = 16;
originalScaleImageCanvas.height = 16;
let tempContext = originalScaleImageCanvas.getContext("2d");
const id = tempContext.createImageData(16, 16);
const frameDataArr = [];
frameDataArr.push(frameHexToImageData(firstFrameHex));
frameDataArr.push(frameHexToImageData(secondFrameHex));
frameDataArr.push(frameHexToImageData(thirdFrameHex));
function drawFrame(index){
	for(let i = 0; i < id.data.length; i++){
		id.data[i] = frameDataArr[index][i];
	}
	tempContext.putImageData(id, 0, 0);
	let newSize = 64;
	canvas.width = newSize;
	canvas.height = newSize;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, newSize, newSize);
	ctx.drawImage(originalScaleImageCanvas, 0, 0, newSize, newSize);
}
var frameIndex = 0;
drawFrame(0);
function drawNext(){
	if(++frameIndex == frameDataArr.length){
		frameIndex = 0;
		}
	drawFrame(frameIndex);
}
const speed = (1000 / 50) * 11;
setInterval(drawNext, speed);
