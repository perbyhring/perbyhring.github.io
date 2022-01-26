uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;
uniform vec2 uFrequency;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main() {

  float waviness = position.x + 0.5;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin((modelPosition.x * uFrequency.x * waviness * 1.5) - uTime) * 0.1 * waviness;
  modelPosition.z += sin((modelPosition.y * uFrequency.y * waviness * 1.5) + uTime) * 0.05 * waviness;
  modelPosition.x += sin((modelPosition.x * uFrequency.x) + uTime) * 0.02 * waviness;
  modelPosition.y += sin((modelPosition.x * uFrequency.x) - uTime) * 0.02 * waviness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = modelPosition.z;
}