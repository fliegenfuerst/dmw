// Get references to the input elements for camera controls
const cameraXInput = document.getElementById('cameraX');
const cameraYInput = document.getElementById('cameraY');
const cameraZInput = document.getElementById('cameraZ');
const pitchInput = document.getElementById('pitch');
const yawInput = document.getElementById('yaw');
const rollInput = document.getElementById('roll');
// Get references to the input elements for camera controls
const cameraXValue = document.getElementById('cameraXValue');
const cameraYValue = document.getElementById('cameraYValue');
const cameraZValue = document.getElementById('cameraZValue');
const pitchValue = document.getElementById('pitchValue');
const yawValue = document.getElementById('yawValue');
const rollValue = document.getElementById('rollValue');

// Initialize camera position and angles
let cameraPosition = [0, -2, 19];  // Positioned above ground and back
let pitch = 0;                   // Camera pitch (X-axis)
let yaw = 0;                     // Camera yaw (Y-axis)
let roll = 0;                    // Camera roll (Z-axis)

// Initialize input values on page load
const initializeInputs = () => {
    cameraXInput.value = cameraXValue.value = cameraPosition[0];
    cameraYInput.value = cameraYValue.value = cameraPosition[1];
    cameraZInput.value = cameraZValue.value = cameraPosition[2];
    pitchInput.value = pitchValue.value = pitch;
    yawInput.value = yawValue.value = yaw;
    rollInput.value = rollValue.value = roll;
};           // Camera roll (Z-axis)
const viewMatrix = stuff3d.createIdentity();
const updateModelViewMatrix = () => {
    // Create a new view matrix
    
	stuff3d.resetIdentity(viewMatrix);
    // Set the position of the camera
    stuff3d.translate(viewMatrix, viewMatrix, [-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]]);

    // Apply rotations for yaw (Y-axis) and pitch (X-axis)
    stuff3d.rotateY(viewMatrix, viewMatrix, yaw * Math.PI / 180);
    stuff3d.rotateX(viewMatrix, viewMatrix, pitch * Math.PI / 180);
    stuff3d.rotateZ(viewMatrix, viewMatrix, roll * Math.PI / 180);

    // Update the modelViewMatrix with the new view matrix
    stuff3d.copy16(modelViewMatrix, viewMatrix);
	if(selectedDigi != null){
		selectedDigi.cubeArray.forEach(cube => {
			cube.translate(cameraPosition);
		});	
	}
};
const updateCamera = () => {
    cameraPosition[0] = parseFloat(cameraXInput.value);
    cameraPosition[1] = parseFloat(cameraYInput.value);
    cameraPosition[2] = parseFloat(cameraZInput.value);
    pitch = parseFloat(pitchInput.value);
    yaw = parseFloat(yawInput.value);
    roll = parseFloat(rollInput.value);

    // Update the camera's view matrix based on new position and orientation
	updateModelViewMatrix();

};
// Combine input event listener helper
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

// Attach combined input listeners for synchronization
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

// Set the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.getElementById('controls').getBoundingClientRect().height;
const ctx2D = canvas.getContext('2d');
ctx2D.imageSmoothingEnabled = true;
gl.viewport(0, 0, offscreenCanvas.width, offscreenCanvas.height);

// Clear color and enable depth test
gl.clearColor(0.5, 0.6, 0.7, 1.0);
gl.enable(gl.DEPTH_TEST);

// Create shaders
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

// Vertex shader
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

// Fragment shader
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

// Setup matrices
const modelViewMatrix = stuff3d.createIdentity();
const projectionMatrix = stuff3d.createIdentity();
stuff3d.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

var digimonSpriteDataArray = [];
let digimonSpriteData;

// Offsets for sprite states
let offsets = {
    idle1: [0, 0],
    idle2: [16, 0],
    attacking: [0, 16],
    attacked: [16, 16]
};
let currentOffsetX, currentOffsetY, index, r, g, b, a, position;
// Function to process the sprite image
function processSpriteImage() {
    const img = new Image();
    img.crossOrigin = "anonymous";  // or "use-credentials" if you need credentials
	let imageUrl = "https://fliegenfuerst.github.io/dw1/stat_tool/digisprites.png";
    // Use URL directly
    img.src = imageUrl;

    img.onload = () => {
        imgCanvasProcessImage = document.createElement('canvas');
        ctxProcessImage = imgCanvasProcessImage.getContext('2d');

        // Set canvas size to the sprite sheet size
        imgCanvasProcessImage.width = img.width;
        imgCanvasProcessImage.height = img.height;

        // Draw the image onto the canvas
        ctxProcessImage.drawImage(img, 0, 0);

        // Get the image data from the canvas
        imageDataProcessImage = ctxProcessImage.getImageData(0, 0, imgCanvasProcessImage.width, imgCanvasProcessImage.height);
        pixelDataProcessImage = imageDataProcessImage.data;

		let digimonSpriteData;
        for (let i = 0; i < digimonNames.length; i++) {
            // Create a new sprite data object for each sprite name
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

            // Process each defined animation state
            for (let offset in offsets) {
                // Calculate the current sprite's offset
                currentOffsetX = i * 32 + offsets[offset][0];
                currentOffsetY = offsets[offset][1];

                // Iterate over the 16x16 pixels of the sprite
                for (let x = 0; x < 16; x++) {
                    for (let y = 0; y < 16; y++) {
                        // Calculate the pixel index in the pixel data
                        index = (currentOffsetX + x) * 4 + (currentOffsetY + y) * img.width * 4;

                        // Get the RGBA values of the current pixel
                        r = pixelDataProcessImage[index];
                        g = pixelDataProcessImage[index + 1];
                        b = pixelDataProcessImage[index + 2];
                        a = pixelDataProcessImage[index + 3];

                        // Only add non-transparent pixels
                        if (a > 0) {
                            // Calculate position (centering the sprite around the origin)
                            position = [
                                x - 8,  // X coordinate offset
                                8 - y,   // Invert Y coordinate for screen/UI space
                                0        // Z coordinate (for 3D, if necessary)
                            ];

                            // Store color and position in the sprite data
                            digimonSpriteData.animationStates[offset].push([
                                [r / 255, g / 255, b / 255, a / 255], // Normalizing colors and alpha
                                position
                            ]);
                        }
                    }
                }
            }
            // Push the completed sprite data to the array
            digimonSpriteDataArray.push(digimonSpriteData);
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
    selectedDigi = digimonSpriteDataArray[selectedDigiIndex];
	selectedDigi.cubeArray = [];
	for(let i = 0; i < selectedDigi.animationStates[selectedAnimationState].length; i++){
		selectedDigi.cubeArray.push(new Pixel3DObject(gl, shaderProgram, modelViewMatrix, selectedDigi.animationStates[selectedAnimationState][i][0], selectedDigi.animationStates[selectedAnimationState][i][1]));
		
	}
	updateModelViewMatrix();
	render();
}
document.getElementById('idleAnimationCheckbox').addEventListener('change', function() {
	showIdleAnimation = this.checked;
});
let lastRenderTime = 0; // Variable to keep track of the last render time
const targetFPS = 60; // Desired frames per second
const frameDuration = 1000 / targetFPS; // Calculate the duration of each frame in milliseconds

const updateInterval = 400; // Interval for updateData in milliseconds
let lastUpdateTime = 0; // Variable to keep track of the last update time

const glUniformLocationProjectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
const glUniformLocationModelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
let showIdleAnimation = true;
let idleAnimationState = 0;
function render(currentTime) {
    // Calculate elapsed time since last render
    if (currentTime - lastRenderTime >= frameDuration) {
        lastRenderTime = currentTime; // Update last render time to current time

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniformMatrix4fv(glUniformLocationProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(glUniformLocationModelViewMatrix, false, modelViewMatrix);

        if (selectedDigi != null) {
            selectedDigi.cubeArray.forEach(cube => cube.render());
        }
        ctx2D.clearRect(0, 0, canvas.width, canvas.height);
        ctx2D.imageSmoothingEnabled = true; // Set to true for smoother images
        ctx2D.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvas.width, canvas.height);
    }

    // Call updateData() every 20 milliseconds
	if(showIdleAnimation){
		if (currentTime - lastUpdateTime >= updateInterval) {
			lastUpdateTime = currentTime; // Update last update time to current time
			if(selectedAnimationState == "idle1"){
				selectedAnimationState = "idle2";
			}else{
				selectedAnimationState = "idle1";
			}
			showDigi();
		}
	}

    // Request the next frame
    requestAnimationFrame(render);
}


// Start the rendering loop
initializeInputs(); // Sync input fields with initial camera values
updateCamera();
processSpriteImage();
//render();