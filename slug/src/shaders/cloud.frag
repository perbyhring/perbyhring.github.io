
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

uniform float u_time;

varying vec3 v_pos;
varying vec3 v_view_pos;
varying vec3 v_orig_pos;
varying float v_bumps;

void main() {

  vec3 color_dark = vec3(0, 0, 0);
  vec3 color_light = vec3(240, 230, 243);

  vec3 color = mix(color_dark, color_light, v_bumps * 0.002);

  color = mix(color, color_light, (1.5 + v_pos.y * 0.5) * 0.0008);

  float noise = snoise4(vec4(
    v_pos.x + v_orig_pos.y * 32.0,
    v_orig_pos.y * v_pos.y * 0.1,
    v_pos.z + v_orig_pos.y * 32.0,
    u_time
  ));
  noise = noise * 0.25 * smoothstep(0.1, 0.2, v_orig_pos.y);
  color -= noise;
  color.r *= 1.0 + distance(v_pos.xyz, vec3(0.0,v_orig_pos.y,0.0)) * 0.5;
  color.b += noise * v_pos.y;

  color.r *= 1.3;
  color.g *= v_pos.y + 0.5;
  color.b *= v_pos.y + 0.5;
  color.b += (1.0 - color.r) * 0.4;

  color *= .9;

  gl_FragColor = vec4(color, 1.0);
}