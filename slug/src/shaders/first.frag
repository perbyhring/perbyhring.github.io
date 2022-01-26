// precision highp float; <-- Can have performance hit and might not work on some devices
precision mediump float; // <-- the most common to use
// precision lowp float; // <-- can create percieved buggyness by the lack of precision

varying float vRandom;

void main() {
  gl_FragColor = vec4(vRandom, 0.0, 1.0, 1.0);
}