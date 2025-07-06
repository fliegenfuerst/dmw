const vertices = [
	-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,		// Front face
	-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,	// Back face
	-1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,		// Top face
	-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,	// Bottom face
	1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,		// Right face
	-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,	// Left face
];
const indices = [
	0, 1, 2, 0, 2, 3,		// Front face
	4, 5, 6, 4, 6, 7,		// Back face
	8, 9, 10, 8, 10, 11,	// Top face
	12, 13, 14, 12, 14, 15,	// Bottom face
	16, 17, 18, 16, 18, 19,	// Right face
	20, 21, 22, 20, 22, 23,	// Left face
];
const textureCoords = [
	0, 0, 1, 0, 1, 1, 0, 1,	// Front face
	0, 0, 1, 0, 1, 1, 0, 1,	// Back face
	0, 0, 1, 0, 1, 1, 0, 1,	// Top face
	0, 0, 1, 0, 1, 1, 0, 1,	// Bottom face
	0, 0, 1, 0, 1, 1, 0, 1,	// Right face
	0, 0, 1, 0, 1, 1, 0, 1	// Left face
];
function getIndices(size) {
	let indices = [];
	let currentOffset = 0;
	for (let i = 0; i - currentOffset < size; i++) {
		if (i % 6 !== 0 && i % 3 === 0) {
			indices.push(i - 3 - currentOffset);
			currentOffset += 2;
		} else {
			indices.push(i - currentOffset);
		}
	}
	return indices;
}
function getColors(color, size){
	let colors = [];
	for (let i = 0; i < size; i += 4) {
		colors[i] = color[0];		// R
		colors[i + 1] = color[1];	// G
		colors[i + 2] = color[2];	// B
		colors[i + 3] = color[3];	// A
	}
	return colors;
}
const colorsLength = vertices.length / 3 * 4;
const scale = 0.5;

class Pixel3DObject {
	#gl;
	#shaderProgram;
	#modelViewMatrix;
	#globalModelViewMatrix;
	#standardTransformMatrix;
	#transformMatrix;
	#standardVertices;
	#vertices;
	#indices;
	#textureCoords;
	#color;
	#colors;
	#standardPosition;
	#position;
	#vertexBuffer;
	#colorBuffer;
	#texCoordBuffer;
	#indexBuffer;
	#texture;
	#coordinatesLocation;
	#colorLocation;
	#texCoordsLocation;
	#uTextureLocation;
	#textureImageSrc;
	constructor(gl, shaderProgram, modelViewMatrix, color, position) {
		this.#gl = gl;
		this.#shaderProgram = shaderProgram;
		this.#globalModelViewMatrix = modelViewMatrix;
		this.#modelViewMatrix = stuff3d.createIdentity();
		this.#standardTransformMatrix = stuff3d.createIdentity();
		this.#transformMatrix = stuff3d.createIdentity();
		this.#standardVertices = new Float32Array(vertices);
		this.#vertices = this.#standardVertices;
		this.scaleVertices(0.5);
		//this.#indices = new Uint16Array(getIndices(vertices.length/3));
		this.#indices = new Uint16Array(indices);
		this.#textureCoords = new Float32Array(textureCoords);
		this.#color = color;
		this.#colors = new Float32Array(getColors(color, colorsLength));
		this.#standardPosition = position;
		this.#position = this.#standardPosition;
		this.scalePosition(0.5);
		this.#vertexBuffer = null;
		this.#colorBuffer = null;
		this.#texCoordBuffer = null;
		this.#indexBuffer = null;
		this.#texture = null;
		this.#coordinatesLocation = null;
		this.#colorLocation = null;
		this.#texCoordsLocation = null;
		this.#uTextureLocation = null;
		this.initBuffers();
		this.#textureImageSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAC0AOABAnLalcgAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+kGHBIuFRFoZ7QAAAAmSURBVDjLY1QQ4PjPQAmgxAAFAY7/TAwUglEDRg0YNQACGCnNzgBjKAT5XULMNQAAAABJRU5ErkJggg==";
		this.loadTexture();
		this.bindShaderProgram();
	}
	scaleVertices(scale){
		this.#vertices = this.#standardVertices.map(value => value * scale / 2);
	}
	scalePosition(scale){
		this.#position = this.#standardPosition.map(value => value * scale);
		stuff3d.translate(this.#transformMatrix, this.#standardTransformMatrix, this.#position);
	}
	update(color, position){
		if(this.#color != color){
			this.#color = color;
			this.#colors = new Float32Array(getColors(color, colorsLength));
			this.initBuffers();
		}
		if(this.#standardPosition != position){
			this.#standardPosition = position;
			this.scalePosition(0.5);
		}
	}
	translate(cameraPosition){
		stuff3d.copy16(this.#modelViewMatrix, this.#transformMatrix); // Start with the current transform
		stuff3d.translate(this.#modelViewMatrix, this.#globalModelViewMatrix, cameraPosition); // Set prism's position
		stuff3d.multiply(this.#modelViewMatrix, this.#globalModelViewMatrix, this.#transformMatrix);	
	}
	initBuffers() {
		this.#vertexBuffer = this.#gl.createBuffer();
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#vertexBuffer);
		this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#vertices, this.#gl.STATIC_DRAW);

		this.#colorBuffer = this.#gl.createBuffer();
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#colorBuffer);
		this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#colors, this.#gl.STATIC_DRAW);

		this.#texCoordBuffer = this.#gl.createBuffer();
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#texCoordBuffer);
		this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#textureCoords, this.#gl.STATIC_DRAW);

		this.#indexBuffer = this.#gl.createBuffer();
		this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, this.#indexBuffer);
		this.#gl.bufferData(this.#gl.ELEMENT_ARRAY_BUFFER, this.#indices, this.#gl.STATIC_DRAW);
	}
	loadTexture() {
		const textureImage = new Image();
		textureImage.src = this.#textureImageSrc;
		textureImage.onload = () => {
			this.setupTexture(textureImage);
		};
		textureImage.onerror = () => {
			console.error("Failed to load texture:", this.#textureImageSrc);
		};
	}
	setupTexture(image) {
		this.#texture = this.#gl.createTexture();
		this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture);
		this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.NEAREST);
		this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#gl.NEAREST);
		this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGBA, this.#gl.RGBA, this.#gl.UNSIGNED_BYTE, image);
	}
	bindShaderProgram() {
		this.#gl.useProgram(this.#shaderProgram);
		this.#coordinatesLocation = this.#gl.getAttribLocation(this.#shaderProgram, "coordinates");
		this.#colorLocation = this.#gl.getAttribLocation(this.#shaderProgram, "color");
		this.#texCoordsLocation = this.#gl.getAttribLocation(this.#shaderProgram, "texCoords");
	}
	render() {
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#vertexBuffer);
		this.#gl.enableVertexAttribArray(this.#coordinatesLocation);
		this.#gl.vertexAttribPointer(this.#coordinatesLocation, 3, this.#gl.FLOAT, false, 0, 0);
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#colorBuffer);
		this.#gl.enableVertexAttribArray(this.#colorLocation);
		this.#gl.vertexAttribPointer(this.#colorLocation, 4, this.#gl.FLOAT, false, 0, 0); 
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#texCoordBuffer);
		this.#gl.enableVertexAttribArray(this.#texCoordsLocation);
		this.#gl.vertexAttribPointer(this.#texCoordsLocation, 2, this.#gl.FLOAT, false, 0, 0); // Texture coordinates
		this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture);
		this.#gl.uniformMatrix4fv(this.#gl.getUniformLocation(this.#shaderProgram, "modelViewMatrix"), false, this.#modelViewMatrix);
		this.#gl.drawElements(this.#gl.TRIANGLES, this.#indices.length, this.#gl.UNSIGNED_SHORT, 0);
	}
}
