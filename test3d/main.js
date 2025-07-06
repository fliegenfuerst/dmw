const cameraXInput = document.getElementById('cameraX');
const cameraYInput = document.getElementById('cameraY');
const cameraZInput = document.getElementById('cameraZ');
const pitchInput = document.getElementById('pitch');
const yawInput = document.getElementById('yaw');
const rollInput = document.getElementById('roll');
const cameraXValue = document.getElementById('cameraXValue');
const cameraYValue = document.getElementById('cameraYValue');
const cameraZValue = document.getElementById('cameraZValue');
const pitchValue = document.getElementById('pitchValue');
const yawValue = document.getElementById('yawValue');
const rollValue = document.getElementById('rollValue');
let cameraPosition = [0, -2, 19];
let pitch = 0;  // Camera pitch (X-axis)
let yaw = 0;	// Camera yaw (Y-axis)
let roll = 0;   // Camera roll (Z-axis)
const initializeInputs = () => {
	cameraXInput.value = cameraXValue.value = cameraPosition[0];
	cameraYInput.value = cameraYValue.value = cameraPosition[1];
	cameraZInput.value = cameraZValue.value = cameraPosition[2];
	pitchInput.value = pitchValue.value = pitch;
	yawInput.value = yawValue.value = yaw;
	rollInput.value = rollValue.value = roll;
};
const modelViewMatrix = stuff3d.createIdentity();
const updateModelViewMatrix = () => {
	stuff3d.resetIdentity(modelViewMatrix);
	stuff3d.translate(modelViewMatrix, modelViewMatrix, [-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]]);
	stuff3d.rotateY(modelViewMatrix, modelViewMatrix, yaw * Math.PI / 180);
	stuff3d.rotateX(modelViewMatrix, modelViewMatrix, pitch * Math.PI / 180);
	stuff3d.rotateZ(modelViewMatrix, modelViewMatrix, roll * Math.PI / 180);
	animated3DEntity.translate(cameraPosition);
};
const updateCamera = () => {
	cameraPosition[0] = parseFloat(cameraXInput.value);
	cameraPosition[1] = parseFloat(cameraYInput.value);
	cameraPosition[2] = parseFloat(cameraZInput.value);
	pitch = parseFloat(pitchInput.value);
	yaw = parseFloat(yawInput.value);
	roll = parseFloat(rollInput.value);
	updateModelViewMatrix();

};
function addCombinedInputEventListener(input1, input2, func){
	input1.addEventListener('input', () => {
		input2.value = input1.value;
		func();
	});
	input2.addEventListener('input', () => {
		input1.value = input2.value;
		func();
	});
}
addCombinedInputEventListener(cameraXInput, cameraXValue, updateCamera);
addCombinedInputEventListener(cameraYInput, cameraYValue, updateCamera);
addCombinedInputEventListener(cameraZInput, cameraZValue, updateCamera);
addCombinedInputEventListener(pitchInput, pitchValue, updateCamera);
addCombinedInputEventListener(yawInput, yawValue, updateCamera);
addCombinedInputEventListener(rollInput, rollValue, updateCamera);
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = window.innerWidth * 4;
offscreenCanvas.height = window.innerHeight * 4;
const gl = offscreenCanvas.getContext('webgl', { antialias: true });
if (!gl) {
	console.error("WebGL not supported.");
}
const canvas = document.getElementById('glCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.getElementById('controls').getBoundingClientRect().height;
const ctx2D = canvas.getContext('2d');
ctx2D.imageSmoothingEnabled = true;
gl.viewport(0, 0, offscreenCanvas.width, offscreenCanvas.height);
gl.clearColor(0.5, 0.6, 0.7, 1.0);
gl.enable(gl.DEPTH_TEST);
function createShader(type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const error = gl.getShaderInfoLog(shader);
	if (error) {
		console.error('Shader error: ', error);
	}
	return shader;
}
const vertexShaderSource = `
attribute vec3 coordinates; // Vertex position attribute
attribute vec4 color; // Vertex color
attribute vec2 texCoords; // Texture coordinates

uniform mat4 projectionMatrix; // Projection matrix
uniform mat4 modelViewMatrix; // Model-view matrix

varying vec4 vColor; // Varying color to pass to fragment shader
varying vec2 vTexCoords; // Varying texture coordinates to pass to fragment shader

void main(void) {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(coordinates, 1.0);
	vColor = color; // Pass the vertex color to the fragment shader
	vTexCoords = texCoords; // Pass the texture coordinates
}
`;
const fragmentShaderSource = `
// Fragment shader
precision mediump float;

varying vec4 vColor; // Varying color from vertex shader
varying vec2 vTexCoords; // Varying texture coordinates from vertex shader
uniform sampler2D uTexture; // Texture sampler

void main(void) {
	vec4 texColor = texture2D(uTexture, vTexCoords); // Get color from texture

	// If the texture color is not fully transparent, mix it with the vertex color
	if (texColor.a > 0.1) {
		gl_FragColor = texColor * vColor; // stuff3d.multiply texture color by vertex color
	} else {
		gl_FragColor = vColor; // Use vertex color if texture is transparent
	}
}

`;
const projectionMatrix = stuff3d.createIdentity();
stuff3d.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);
const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
class Animated3DEntity{
	#cubeArray;
	#blankColor;
	#tempArr;
	#enabledCubesSize;
	constructor(){
		this.#blankColor = [0, 0, 0, 0];
		this.#tempArr = new Array(16);
		this.#cubeArray = new Array(256);
		this.initCubeArray();
		this.#enabledCubesSize = 0;
	}
	initCubeArray(){
		this.#cubeArray = [...this.#tempArr];
		for(let y = 0; y < 16; y++){
			for(let x = 0; x < 16; x++){
				this.#cubeArray[x + y * 16] = new Pixel3DObject(gl, shaderProgram, modelViewMatrix, this.#blankColor, [x - 8, y - 8, 0]);
			}
		}
	}
	translate(cameraPosition){
		for(let i = 0; i < this.#enabledCubesSize; i++){
			this.#cubeArray[i].translate(cameraPosition);
		}
	}
	updateCubeArray(arr){
		for(let i = 0; i < arr.length; i++){
			this.#cubeArray[i].update(...arr[i]);
		}
		this.#enabledCubesSize = arr.length;
	}
	render(){
		for(let i = 0; i < this.#enabledCubesSize; i++){
			this.#cubeArray[i].render();
		}
	}
}
var animated3DEntity = new Animated3DEntity();
var digimonSpriteDataArray = [];
let digimonSpriteData;
let offsets = {
	idle1: [0, 0],
	idle2: [16, 0],
	attacking: [0, 16],
	attacked: [16, 16]
};
let currentOffsetX, currentOffsetY, index, r, g, b, a, position;
function processSpriteImage() {
	const img = new Image();
	img.crossOrigin = "anonymous";
	let imageUrl = "https://fliegenfuerst.github.io/dw1/stat_tool/digisprites.png";
	img.src = imageUrl;
	img.onload = () => {
		imgCanvasProcessImage = document.createElement('canvas');
		ctxProcessImage = imgCanvasProcessImage.getContext('2d');
		imgCanvasProcessImage.width = img.width;
		imgCanvasProcessImage.height = img.height;
		ctxProcessImage.drawImage(img, 0, 0);
		imageDataProcessImage = ctxProcessImage.getImageData(0, 0, imgCanvasProcessImage.width, imgCanvasProcessImage.height);
		pixelDataProcessImage = imageDataProcessImage.data;
		let digimonSpriteData;
		for (let i = 0; i < digimonNames.length; i++) {
			digimonSpriteData = {
				name: digimonNames[i],
				index: i,
				animationStates: {
					idle1: [],
					idle2: [],
					attacking: [],
					attacked: []
				}
			};
			for (let offset in offsets) {
				currentOffsetX = i * 32 + offsets[offset][0];
				currentOffsetY = offsets[offset][1];
				for (let x = 0; x < 16; x++) {
					for (let y = 0; y < 16; y++) {
						index = (currentOffsetX + x) * 4 + (currentOffsetY + y) * img.width * 4;
						r = pixelDataProcessImage[index];
						g = pixelDataProcessImage[index + 1];
						b = pixelDataProcessImage[index + 2];
						a = pixelDataProcessImage[index + 3];
						if (a > 0) {
							position = [
								x - 8,
								8 - y,
								0
							];
							digimonSpriteData.animationStates[offset].push([[r / 255, g / 255, b / 255, a / 255], position]);
						}
					}
				}
			}
			digimonSpriteDataArray[i] = digimonSpriteData;
		}
		showDigi(0);
	};
	img.onerror = () => {
		console.error("Failed to load image from URL:", imageUrl);
	};
}
const digiSelect = document.getElementById('digiSelect');
digimonNames.forEach(option => {
	const optionElement = document.createElement('option');
	optionElement.value = option;
	optionElement.textContent = option;
	digiSelect.appendChild(optionElement);
});
digiSelect.addEventListener('change', function(event) {
	showDigi(event.target.selectedIndex);
});
let animationStateNames = ["idle1", "idle2", "attacking", "attacked"];
let selectedAnimationState = "attacked";
const animationStateSelect = document.getElementById('animationStateSelect');
animationStateNames.forEach(option => {
	const optionElement = document.createElement('option');
	optionElement.value = option;
	optionElement.textContent = option;
	animationStateSelect.appendChild(optionElement);
});
animationStateSelect.addEventListener('change', function(event) {
	selectedAnimationState = animationStateNames[event.target.selectedIndex];
	showDigi();
});
var selectedDigi = null;
var selectedDigiIndex = 0;
function showDigi(index){
	if (typeof index !== 'undefined') {
		selectedDigiIndex = index;
	}
	animated3DEntity.updateCubeArray(digimonSpriteDataArray[selectedDigiIndex].animationStates[selectedAnimationState]);
	updateModelViewMatrix();
}
document.getElementById('idleAnimationCheckbox').addEventListener('change', function() {
	showIdleAnimation = this.checked;
});
let lastRenderTime = 0;
const targetFPS = 60;
const frameDuration = 1000 / targetFPS;
const updateInterval = 400;
let lastUpdateTime = 0;
const glUniformLocationProjectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
const glUniformLocationModelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
let showIdleAnimation = true;
let idleAnimationState = 0;
function render(currentTime) {
	if (currentTime - lastRenderTime >= frameDuration) {
		lastRenderTime = currentTime;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.uniformMatrix4fv(glUniformLocationProjectionMatrix, false, projectionMatrix);
		animated3DEntity.render();
		ctx2D.clearRect(0, 0, canvas.width, canvas.height);
		ctx2D.imageSmoothingEnabled = true;
		ctx2D.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvas.width, canvas.height);
	}
	if(showIdleAnimation){
		if (currentTime - lastUpdateTime >= updateInterval) {
			lastUpdateTime = currentTime;
			if(selectedAnimationState == "idle1"){
				selectedAnimationState = "idle2";
			}else{
				selectedAnimationState = "idle1";
			}
			showDigi();
		}
	}
	requestAnimationFrame(render);
}
initializeInputs();
updateCamera();
processSpriteImage();
render();
