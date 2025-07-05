//code lifted and optimized from https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.4.0/gl-matrix.js
class Stuff3D{
	#arr16;
	#arr4;
	#ax;
	#ay;
	#az;
	#bx;
	#by;
	#bz;
	#s;
	#c;
	#w;
	#x;
	#y;
	#z;
	#f;
	#nf;
	#len;
	#rangeInv;
	#identity;
	constructor(){
		this.#arr16 = new Array(16);
		this.#arr4 = new Array(4);
		this.#identity = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	};
	createIdentity() {
		return [...this.#identity];
	}
	rotateX(out, a, rad) {
		this.#s = Math.sin(rad);
		this.#c = Math.cos(rad);
		this.#arr16[4] = a[4];
		this.#arr16[5] = a[5];
		this.#arr16[6] = a[6];
		this.#arr16[7] = a[7];
		this.#arr16[8] = a[8];
		this.#arr16[9] = a[9];
		this.#arr16[10] = a[10];
		this.#arr16[11] = a[11];
		if (a !== out) {
			out[0] = a[0];
			out[1] = a[1];
			out[2] = a[2];
			out[3] = a[3];
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
		}
		out[4] = this.#arr16[4] * this.#c + this.#arr16[8] * this.#s;
		out[5] = this.#arr16[5] * this.#c + this.#arr16[9] * this.#s;
		out[6] = this.#arr16[6] * this.#c + this.#arr16[10] * this.#s;
		out[7] = this.#arr16[7] * this.#c + this.#arr16[11] * this.#s;
		out[8] = this.#arr16[8] * this.#c - this.#arr16[4] * this.#s;
		out[9] = this.#arr16[9] * this.#c - this.#arr16[5] * this.#s;
		out[10] = this.#arr16[10] * this.#c - this.#arr16[6] * this.#s;
		out[11] = this.#arr16[11] * this.#c - this.#arr16[7] * this.#s;
		return out;
	}
	rotateY(out, a, rad) {
		this.#s = Math.sin(rad);
		this.#c = Math.cos(rad);
        this.#arr16[0] = a[0];
        this.#arr16[1] = a[1];
        this.#arr16[2] = a[2];
        this.#arr16[3] = a[3];
        this.#arr16[8] = a[8];
        this.#arr16[9] = a[9];
        this.#arr16[10] = a[10];
        this.#arr16[11] = a[11];
		if (a !== out) {
			out[4] = a[4];
			out[5] = a[5];
			out[6] = a[6];
			out[7] = a[7];
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
		}
		out[0] = this.#arr16[0] * this.#c - this.#arr16[8] * this.#s;
		out[1] = this.#arr16[1] * this.#c - this.#arr16[9] * this.#s;
		out[2] = this.#arr16[2] * this.#c - this.#arr16[10] * this.#s;
		out[3] = this.#arr16[3] * this.#c - this.#arr16[11] * this.#s;
		out[8] = this.#arr16[0] * this.#s + this.#arr16[8] * this.#c;
		out[9] = this.#arr16[1] * this.#s + this.#arr16[9] * this.#c;
		out[10] = this.#arr16[2] * this.#s + this.#arr16[10] * this.#c;
		out[11] = this.#arr16[3] * this.#s + this.#arr16[11] * this.#c;
		return out;
	}
	rotateZ(out, a, rad) {
		this.#s = Math.sin(rad);
		this.#c = Math.cos(rad);
		this.#arr16[0] = a[0];
		this.#arr16[1] = a[1];
		this.#arr16[2] = a[2];
		this.#arr16[3] = a[3];
		this.#arr16[4] = a[4];
		this.#arr16[5] = a[5];
		this.#arr16[6] = a[6];
		this.#arr16[7] = a[7];
		if (a !== out) {
			out[8] = a[8];
			out[9] = a[9];
			out[10] = a[10];
			out[11] = a[11];
			out[12] = a[12];
			out[13] = a[13];
			out[14] = a[14];
			out[15] = a[15];
		}
		out[0] = this.#arr16[0] * this.#c + this.#arr16[4] * this.#s;
		out[1] = this.#arr16[1] * this.#c + this.#arr16[5] * this.#s;
		out[2] = this.#arr16[2] * this.#c + this.#arr16[6] * this.#s;
		out[3] = this.#arr16[3] * this.#c + this.#arr16[7] * this.#s;
		out[4] = this.#arr16[4] * this.#c - this.#arr16[0] * this.#s;
		out[5] = this.#arr16[5] * this.#c - this.#arr16[1] * this.#s;
		out[6] = this.#arr16[6] * this.#c - this.#arr16[2] * this.#s;
		out[7] = this.#arr16[7] * this.#c - this.#arr16[3] * this.#s;
		return out;
	}
	translate(out, a, v) {
		this.#x = v[0],
		this.#y = v[1],
		this.#z = v[2],
		this.#arr16.fill(0)
		if (a === out) {
			out[12] = a[0] * this.#x + a[4] * this.#y + a[8] * this.#z + a[12];
			out[13] = a[1] * this.#x + a[5] * this.#y + a[9] * this.#z + a[13];
			out[14] = a[2] * this.#x + a[6] * this.#y + a[10] * this.#z + a[14];
			out[15] = a[3] * this.#x + a[7] * this.#y + a[11] * this.#z + a[15];
		} else {
			this.#arr16[0] = a[0];
			this.#arr16[1] = a[1];
			this.#arr16[2] = a[2];
			this.#arr16[3] = a[3];
			this.#arr16[4] = a[4];
			this.#arr16[5] = a[5];
			this.#arr16[6] = a[6];
			this.#arr16[7] = a[7];
			this.#arr16[8] = a[8];
			this.#arr16[9] = a[9];
			this.#arr16[10] = a[10];
			this.#arr16[11] = a[11];
			out[0] = this.#arr16[0];
			out[1] = this.#arr16[1];
			out[2] = this.#arr16[2];
			out[3] = this.#arr16[3];
			out[4] = this.#arr16[4];
			out[5] = this.#arr16[5];
			out[6] = this.#arr16[6];
			out[7] = this.#arr16[7];
			out[8] = this.#arr16[8];
			out[9] = this.#arr16[9];
			out[10] = this.#arr16[10];
			out[11] = this.#arr16[11];
			out[12] = this.#arr16[0] * this.#x + this.#arr16[4] * this.#y + this.#arr16[8] * this.#z + a[12];
			out[13] = this.#arr16[1] * this.#x + this.#arr16[5] * this.#y + this.#arr16[9] * this.#z + a[13];
			out[14] = this.#arr16[2] * this.#x + this.#arr16[6] * this.#y + this.#arr16[10] * this.#z + a[14];
			out[15] = this.#arr16[3] * this.#x + this.#arr16[7] * this.#y + this.#arr16[11] * this.#z + a[15];
		}
		return out;
	}
	multiply(out, a, b) {
		this.#arr16[0] = a[0];
		this.#arr16[1] = a[1];
		this.#arr16[2] = a[2];
		this.#arr16[3] = a[3];
		this.#arr16[4] = a[4];
		this.#arr16[5] = a[5];
		this.#arr16[6] = a[6];
		this.#arr16[7] = a[7];
		this.#arr16[8] = a[8];
		this.#arr16[9] = a[9];
		this.#arr16[10] = a[10];
		this.#arr16[11] = a[11];
		this.#arr16[12] = a[12];
		this.#arr16[13] = a[13];
		this.#arr16[14] = a[14];
		this.#arr16[15] = a[15];
		this.#arr4[0] = b[0];
		this.#arr4[1] = b[1];
		this.#arr4[2] = b[2];
		this.#arr4[3] = b[3];
		out[0] = this.#arr4[0] * this.#arr16[0] + this.#arr4[1] * this.#arr16[4] + this.#arr4[2] * this.#arr16[8] + this.#arr4[3] * this.#arr16[12];
		out[1] = this.#arr4[0] * this.#arr16[1] + this.#arr4[1] * this.#arr16[5] + this.#arr4[2] * this.#arr16[9] + this.#arr4[3] * this.#arr16[13];
		out[2] = this.#arr4[0] * this.#arr16[2] + this.#arr4[1] * this.#arr16[6] + this.#arr4[2] * this.#arr16[10] + this.#arr4[3] * this.#arr16[14];
		out[3] = this.#arr4[0] * this.#arr16[3] + this.#arr4[1] * this.#arr16[7] + this.#arr4[2] * this.#arr16[11] + this.#arr4[3] * this.#arr16[15];
		this.#arr4[0] = b[4];
		this.#arr4[1] = b[5];
		this.#arr4[2] = b[6];
		this.#arr4[3] = b[7];
		out[4] = this.#arr4[0] * this.#arr16[0] + this.#arr4[1] * this.#arr16[4] + this.#arr4[2] * this.#arr16[8] + this.#arr4[3] * this.#arr16[12];
		out[5] = this.#arr4[0] * this.#arr16[1] + this.#arr4[1] * this.#arr16[5] + this.#arr4[2] * this.#arr16[9] + this.#arr4[3] * this.#arr16[13];
		out[6] = this.#arr4[0] * this.#arr16[2] + this.#arr4[1] * this.#arr16[6] + this.#arr4[2] * this.#arr16[10] + this.#arr4[3] * this.#arr16[14];
		out[7] = this.#arr4[0] * this.#arr16[3] + this.#arr4[1] * this.#arr16[7] + this.#arr4[2] * this.#arr16[11] + this.#arr4[3] * this.#arr16[15];
		this.#arr4[0] = b[8];
		this.#arr4[1] = b[9];
		this.#arr4[2] = b[10];
		this.#arr4[3] = b[11];
		out[8] = this.#arr4[0] * this.#arr16[0] + this.#arr4[1] * this.#arr16[4] + this.#arr4[2] * this.#arr16[8] + this.#arr4[3] * this.#arr16[12];
		out[9] = this.#arr4[0] * this.#arr16[1] + this.#arr4[1] * this.#arr16[5] + this.#arr4[2] * this.#arr16[9] + this.#arr4[3] * this.#arr16[13];
		out[10] = this.#arr4[0] * this.#arr16[2] + this.#arr4[1] * this.#arr16[6] + this.#arr4[2] * this.#arr16[10] + this.#arr4[3] * this.#arr16[14];
		out[11] = this.#arr4[0] * this.#arr16[3] + this.#arr4[1] * this.#arr16[7] + this.#arr4[2] * this.#arr16[11] + this.#arr4[3] * this.#arr16[15];
		this.#arr4[0] = b[12];
		this.#arr4[1] = b[13];
		this.#arr4[2] = b[14];
		this.#arr4[3] = b[15];
		out[12] = this.#arr4[0] * this.#arr16[0] + this.#arr4[1] * this.#arr16[4] + this.#arr4[2] * this.#arr16[8] + this.#arr4[3] * this.#arr16[12];
		out[13] = this.#arr4[0] * this.#arr16[1] + this.#arr4[1] * this.#arr16[5] + this.#arr4[2] * this.#arr16[9] + this.#arr4[3] * this.#arr16[13];
		out[14] = this.#arr4[0] * this.#arr16[2] + this.#arr4[1] * this.#arr16[6] + this.#arr4[2] * this.#arr16[10] + this.#arr4[3] * this.#arr16[14];
		out[15] = this.#arr4[0] * this.#arr16[3] + this.#arr4[1] * this.#arr16[7] + this.#arr4[2] * this.#arr16[11] + this.#arr4[3] * this.#arr16[15];
		return out;
	}
	perspective(out, fovy, aspect, near, far) {
		this.#f = 1.0 / Math.tan(fovy / 2);
		this.#nf = 1 / (near - far);
		out[0] = this.#f / aspect;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[5] = this.#f;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[10] = (far + near) * this.#nf;
		out[11] = -1;
		out[12] = 0;
		out[13] = 0;
		out[14] = 2 * far * near * this.#nf;
		out[15] = 0;
		return out;
	}
	resetIdentity(out) {
		out[0] = 1;
		out[1] = 0;
		out[2] = 0;
		out[3] = 0;
		out[4] = 0;
		out[5] = 1;
		out[6] = 0;
		out[7] = 0;
		out[8] = 0;
		out[9] = 0;
		out[10] = 1;
		out[11] = 0;
		out[12] = 0;
		out[13] = 0;
		out[14] = 0;
		out[15] = 1;
		return out;
	}
	copy16(out, a) {
		out[0] = a[0];
		out[1] = a[1];
		out[2] = a[2];
		out[3] = a[3];
		out[4] = a[4];
		out[5] = a[5];
		out[6] = a[6];
		out[7] = a[7];
		out[8] = a[8];
		out[9] = a[9];
		out[10] = a[10];
		out[11] = a[11];
		out[12] = a[12];
		out[13] = a[13];
		out[14] = a[14];
		out[15] = a[15];
		return out;
	}
	
	createPerspectiveMatrix(fieldOfView, aspect, near, far) {
		this.#f = 1.0 / Math.tan(fieldOfView / 2);
		this.#rangeInv = 1 / (near - far);

		return [
			this.#f / aspect, 0, 0, 0,
			0, this.#f, 0, 0,
			0, 0, (near + far) * this.#rangeInv, -1,
			0, 0, near * far * this.#rangeInv * 2, 0
		];
	}

// Create a lookAt matrix
	createLookAtMatrix(camera, target, up) {
		this.normalize(this.#z, this.subtract(camera, target));
		this.normalize(this.#x, this.cross(up, this.#z));
		this.cross(this.#y, this.#z, this.#x);

		return [
			this.#x[0], this.#y[0], this.#z[0], 0,
			this.#x[1], this.#y[1], this.#z[1], 0,
			this.#x[2], this.#y[2], this.#z[2], 0,
			-this.dot(this.#x, camera), -this.dot(this.#y, camera), -this.dot(this.#z, camera), 1
		];
	}

	normalize(out, a) {
		this.#x = a[0];
		this.#y = a[1];
		this.#z = a[2];
		this.#w = a[3];
		this.#len = this.#x * this.#x + this.#y * this.#y + this.#z * this.#z + this.#w * this.#w;
		if (this.#len > 0) {
			this.#len = 1 / Math.sqrt(this.#len);
			out[0] = this.#x * this.#len;
			out[1] = this.#y * this.#len;
			out[2] = this.#z * this.#len;
			out[3] = this.#w * this.#len;
		}
		return out;
	}

	dot(a, b) {
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}
	subtract(out, a, b) {
		out[0] = a[0] - b[0];
		out[1] = a[1] - b[1];
		out[2] = a[2] - b[2];
		out[3] = a[3] - b[3];
		return out;
	}

	cross(out, a, b) {
		this.#ax = a[0],
		this.#ay = a[1],
		this.#az = a[2];
		this.#bx = b[0],
		this.#by = b[1],
		this.#bz = b[2];

		out[0] = this.#ay * this.#bz - this.#az * this.#by;
		out[1] = this.#az * this.#bx - this.#ax * this.#bz;
		out[2] = this.#ax * this.#by - this.#ay * this.#bx;
		return out;
	}
	
	
}
const stuff3d = new Stuff3D();