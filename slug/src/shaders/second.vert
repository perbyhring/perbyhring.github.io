uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float wavyness = modelPosition.x + 0.5;
  float max_waveheight = 0.1 + aRandom * 0.2;
  
  modelPosition.z += sin((modelPosition.x + aRandom * 0.05 - uTime) * 5.0) * max_waveheight * wavyness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vRandom = aRandom;
}