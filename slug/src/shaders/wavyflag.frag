// precision highp float; <-- Can have performance hit and might not work on some devices
// precision lowp float; // <-- can create percieved buggyness by the lack of precision
precision mediump float; // <-- the most common to use

uniform vec3 uMultiplyColor;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {

  vec4 textureColor = texture2D(uTexture, vUv);
  float brightness = vElevation + 1.0;
  textureColor.rgb *= brightness;
  textureColor.rgb *= uMultiplyColor;

  gl_FragColor = vec4(textureColor);
}