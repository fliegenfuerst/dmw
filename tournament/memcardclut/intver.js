let clut = [95,87,122,58,117,21,205,0,19,0,9,128,247,150,240,141,49,198,247,127,148,82,206,57,107,45,231,28,66,136];

let pixelData = [0,0,0,255,255,255,15,0,0,0,255,220,221,221,253,0,0,240,220,237,221,222,238,15,0,207,236,222,237,221,222,15,240,255,190,187,251,254,255,254,223,207,189,189,235,236,254,255,207,206,189,187,235,236,236,254,223,238,238,255,239,238,237,253,255,255,63,255,243,255,254,254,255,47,63,52,242,63,255,255,240,67,241,31,164,255,243,79,0,63,68,19,35,79,244,66,0,52,50,17,33,33,67,67,0,36,49,50,52,50,68,4,0,64,36,18,33,67,4,0,0,0,64,68,68,4,0,0,0,0,0,255,255,255,15,0,0,0,255,220,221,221,255,0,0,240,220,221,221,222,254,15,0,207,237,222,237,222,238,15,240,255,188,187,252,253,255,254,255,222,201,205,236,236,253,255,223,222,185,187,236,236,237,253,223,238,255,255,239,238,237,253,239,255,79,255,243,244,254,254,240,63,63,52,66,65,242,255,240,68,250,19,33,17,255,79,0,63,67,18,50,244,242,66,0,52,50,17,33,33,243,67,0,36,49,85,69,50,68,4,0,64,36,82,37,67,4,0,0,0,64,68,68,4,0,0,0,0,240,255,255,255,15,0,0,240,207,221,221,221,15,0,0,207,220,237,237,222,254,0,0,223,189,186,252,254,255,15,240,206,219,187,236,236,254,255,240,204,187,203,236,236,237,254,239,206,254,255,239,237,237,254,223,254,255,79,243,255,238,253,239,255,63,63,242,241,243,254,255,63,63,18,33,33,255,255,240,52,250,18,50,244,242,66,0,79,67,17,33,33,243,67,0,52,50,85,69,34,67,4,0,52,33,82,85,50,68,0,0,64,68,82,53,67,4,0,0,0,0,68,68,68,0,0];

let what = [1,0,0,0,169,255,255,255,0,0,0,0,240,253,255,255,0,0,0,0,169,255,255,255,0,0,0,0,40,253,255,255,0,0,0,0];

function int2bin(num){
	return (num.toString(2)).padStart(8, '0');
}
function intToTwoPixelIndexes(num){
    let temp = int2bin(num);
	return [parseInt(temp.substring(4, 9), 2), parseInt(temp.substring(0, 4), 2)];
}
function intToClutPixel(intArr){
    let pixel = {};
    let temp = int2bin(intArr[1]) + int2bin(intArr[0]);
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
let palette = [];
for(let i = 0; i < clut.length; i++){
    palette.push(intToClutPixel([clut[i++], clut[i]]));
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let firstFramePixelIndexes = [];
for(let i = 0; i < pixelData.length; i++){
    firstFramePixelIndexes.push(...intToTwoPixelIndexes(pixelData[i]));
}
let firstFramePixels = [];
for(let i = 0; i < firstFramePixelIndexes.length; i++){
    firstFramePixels.push(palette[firstFramePixelIndexes[i]]);
}

const id = ctx.createImageData(16, 16);
const d  = id.data;
let i = 0;
let pixel;
for(let i = 0; i < id.data.length; i += 4){
    pixel = firstFramePixels[i/4];
	id.data[i + 0] = pixel.red;
	id.data[i + 1] = pixel.green;
	id.data[i + 2] = pixel.blue;
	id.data[i + 3] = pixel.alpha;
}
ctx.putImageData(id, 0, 0);
let originalScaleImageCanvas = document.createElement("canvas");
let tempContext = originalScaleImageCanvas.getContext("2d");
originalScaleImageCanvas.width = 16;
originalScaleImageCanvas.height = 16;
tempContext.drawImage(canvas, 0, 0);
let newSize = 64;
canvas.width = newSize;
canvas.height = newSize;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.drawImage(originalScaleImageCanvas, 0, 0, newSize, newSize);