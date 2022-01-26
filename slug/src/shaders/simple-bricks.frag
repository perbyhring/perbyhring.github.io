uniform float uTime;
uniform vec2 uPointer;

varying vec2 vUv;

float TAU = radians(360.0);

float pingpong(float start, float end, float input_value) {
  float value = abs(input_value);

  float modulo = end - start;
  float remainder = mod(value, modulo);

  float double_modulo = modulo * 2.0;
  float double_remainder = mod(value, double_modulo);
  
  return (double_remainder >= modulo ? modulo - remainder : remainder) + start;
}

float grid_units = 10.0;

void main() {

  float y = vUv.y * grid_units * 2.0;
  float y_index = floor(y * 0.5);
  y = pingpong(0.0, 1.0, y);
  y = smoothstep(0.0, 0.1, y);

  float x = vUv.x * grid_units;
  x = mod(y_index, 2.0) == 0.0 ? x + 1.0 : x;
  x = pingpong(0.0, 1.0, x);
  x = smoothstep(0.0, 0.05, x);

  float brightness = min(x,y);

  gl_FragColor = vec4(brightness, brightness, brightness, 1.0);
}