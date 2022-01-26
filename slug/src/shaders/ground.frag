#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

uniform float u_time;

varying vec3 v_orig_pos;
varying vec3 v_mod_pos;

varying float v_bumpy_path_area;
varying float v_bumpy_path_noise;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

const vec3 center = vec3(-2.0, 0.0, 0.0);

const vec3 black = vec3(0.0, 0.0, 0.0);
const vec3 white = vec3(1.0, 1.0, 1.0);

const vec3 red = vec3(1.0, 0.0, 0.0);
const vec3 green = vec3(0.0, 1.0, 0.0);
const vec3 blue = vec3(0.0, 0.0, 1.0);

const vec3 cyan = vec3(0.0, 1.0, 1.0);
const vec3 magenta = vec3(1.0, 0.0, 1.0);
const vec3 yellow = vec3(1.0, 1.0, 0.0);

void main() {

  // ==============================
  // Accentuate
  // ==============================

  vec3 grayscale = vec3(v_mod_pos.y, v_mod_pos.y, v_mod_pos.y);
  vec3 color = grayscale + 1.0 * 0.5;

  // darken path behind creature
  color *= 1.0 - (v_bumpy_path_area + snoise2(vec2(v_mod_pos.x * 4.0 + u_time * 2.0, v_mod_pos.z)) * 0.25 * v_bumpy_path_area) * 0.8 * smoothstep(1.0, 0.0, v_mod_pos.x) * 0.8;

  // ==============================
  // Add Details
  // ==============================

  // grain all over
  float noise_01 = snoise3(v_orig_pos * 2.0);
  float texture_grain = snoise3(vec3(v_orig_pos.x * 64.0 + u_time * 32.0, v_orig_pos.yz * 64.0));
  color *= 1.0 + texture_grain * 0.2;

  // ==============================
  // Add Extra Colors
  // ==============================

  // ==============================
  // Shadow
  // ==============================

  // fake shadow from slug
  float distance_from_creature = distance(vec3(-0.5,0.0,0.0), vec3(v_mod_pos.x * 0.45, v_mod_pos.yz));
  color *= 1.0 - smoothstep(1.5, 0.2, distance_from_creature) * 1.0;

  // ==============================
  // Light
  // ==============================

  // glowing trail in creatures path
  float glowing_trail_area = smoothstep(0.5, 1.0, v_bumpy_path_area) * smoothstep(0.0, -1.0, v_mod_pos.x);
  float glowing_trail_sin = sin((v_mod_pos.x - 1.3) * 4.0 + u_time * 2.0) * 0.3 * (clamp(exp(abs(v_mod_pos.z * 2.0)) - 1.0, 0.0, 1.0));
  
  float glowing_trail_noise = snoise2(vec2(v_mod_pos.x * 0.2 + u_time * 0.1, v_mod_pos.z * 4.0 + glowing_trail_sin));
  float glowing_trail_noise_02 = snoise2(vec2(v_mod_pos.x * 0.6 + u_time * 0.3, v_mod_pos.z * 4.0 * 3.0 + glowing_trail_sin * 3.0));
 
  float glowing_material_area = smoothstep(-0.3, 0.0, glowing_trail_noise) * glowing_trail_area * abs(glowing_trail_noise_02);
 
  vec3 glowing_material_color = white;

  color *= 1.0 + glowing_material_area * glowing_material_color * 1.0;
  color += glowing_material_area * 0.1;
  // color -= glowing_material_area * smoothstep(-4.0 + abs(v_mod_pos.z * 4.0), -8.0 + abs(v_mod_pos.z * 4.0), v_mod_pos.x);

  // fake moving caustic-y light
  float caustics_noise_01 = snoise3(vec3(1000.0 + v_mod_pos.x * 0.25 + u_time * 0.5, 1000.0 + v_mod_pos.y * 0.1, 1000.0 + v_mod_pos.z));
  float caustics_noise_02 = snoise4(vec4(v_mod_pos.x * 0.25 + u_time, v_mod_pos.y, v_mod_pos.z, caustics_noise_01));
  color *= 1.0 + (smoothstep(-1.0, 0.0, caustics_noise_02) - smoothstep(0.0, 1.0, caustics_noise_02)) * 0.3;
  
  // light from creature brain
  float distance_from_brain = distance(vec3(-0.3,0.0,0.0), vec3(v_mod_pos.xy, v_mod_pos.z * 0.45));
  float brain_light_intensity = smoothstep(0.75, 0.0, distance_from_brain);
  float brain_color_mixer_noise = abs(snoise3(vec3(v_mod_pos.xz * 0.5, u_time)));
  vec3 brain_color_mixer = mix(blue, red * 0.5, brain_color_mixer_noise);
  color *= 1.0 + brain_light_intensity * brain_color_mixer * 0.5;
  color *= 1.0 + brain_light_intensity * white * 2.0;

  // // color grade
  // color.r += 0.03;
  // color.g += 0.01;
  // color.b += 0.03;

  // ==============================
  // Finishing touches
  // ==============================

  // fade out in a radius from center
  float distance_from_center = distance(v_mod_pos, center);
  float distance_from_center_fade_out = smoothstep(6.0, 3.0, distance_from_center);
  color *= distance_from_center_fade_out;

  float alpha = 1.0;

  gl_FragColor = vec4(color, alpha);
}