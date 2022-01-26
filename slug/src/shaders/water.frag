
uniform float u_time;

uniform vec3 u_low_color;
uniform vec3 u_high_color;
uniform float u_color_offset;
uniform float u_color_multiplier;

varying float v_elevation;
varying vec3 v_pos;

void main() {

  float mix_strength = v_elevation * u_color_multiplier + u_color_offset;

  vec3 color = mix(u_low_color, u_high_color, mix_strength);

  gl_FragColor = vec4(color, 1.0);
}