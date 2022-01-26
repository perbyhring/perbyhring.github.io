uniform float uTime;

void main() {

  gl_position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}