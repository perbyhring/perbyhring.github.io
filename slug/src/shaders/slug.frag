#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

uniform float u_time;
uniform float u_eye_size;
uniform float u_iris_size;
uniform float u_pupil_size;

varying vec3 v_mod_pos;
varying vec3 v_orig_pos;

varying float v_mouth_hole_area;
varying float v_mouth_tentacles;

varying float v_nose_ridge_area;
varying float v_left_nostril_area;
varying float v_right_nostril_area;

varying float v_left_eye_area;
varying float v_right_eye_area;
varying float v_distance_to_left_eye_center;
varying float v_distance_to_right_eye_center;

varying float v_head_buldges_area;
varying float v_head_buldges;

varying float v_neck_buldges_area;
varying float v_neck_buldges;

varying float v_back_buldges_area;
varying float v_back_buldges;

varying float v_tail_buldges_area;
varying float v_tail_buldges;
varying float v_tail_spikes;
varying float v_tail_tip_area;

const float PI = radians(180.0);
const float TAU = PI * 2.0;

const vec3 center = vec3(0.0, 0.0, 0.0);

const vec3 black = vec3(0.0, 0.0, 0.0);
const vec3 white = vec3(1.0, 1.0, 1.0);

const vec3 red = vec3(1.0, 0.0, 0.0);
const vec3 green = vec3(0.0, 1.0, 0.0);
const vec3 blue = vec3(0.0, 0.0, 1.0);

const vec3 cyan = vec3(0.0, 1.0, 1.0);
const vec3 magenta = vec3(1.0, 0.0, 1.0);
const vec3 yellow = vec3(1.0, 1.0, 0.0);

void main() {

  float y_shadow = 0.75 - v_mod_pos.y;
  float y_light = 1.0 - y_shadow;

  // ==============================
  // Accentuate
  // ==============================

  // general "shadow" shaping or whatever
  vec3 color = vec3((v_mod_pos.x + 3.0) / 3.0, v_mod_pos.y, (v_mod_pos.z + 1.0) / 2.0);
  color.r *= 0.35;
  color *= smoothstep(-0.2, 0.0, v_mod_pos.y);
  
  float grayscale = (color.r + color.b + color.g) / 3.0;
  color = vec3(grayscale, grayscale, grayscale) * y_light;

  // remove color inside mouth
  color *= 1.0 - smoothstep(0.0, 0.02, v_mouth_hole_area);

  // lighten mouth tentacles
  color += v_mouth_tentacles * smoothstep(0.04, 0.06, v_mouth_hole_area) * 1.0 * y_light * 2.0;

  // black inside mouth
  color *= 1.0 - v_mouth_hole_area;

  // darken eyes
  color *= 1.0 - smoothstep(0.0, 0.8, v_left_eye_area) * 1.0;
  color *= 1.0 - smoothstep(0.0, 0.8, v_right_eye_area) * 1.0;

  // ligthen eyeballs
  color += (1.0 - v_distance_to_left_eye_center * 3.0) * smoothstep(0.7, 1.0, v_left_eye_area) * 1.4 * y_light;
  color += (1.0 - v_distance_to_right_eye_center * 3.0) * smoothstep(0.7, 1.0, v_right_eye_area) * 1.4 * y_light;


  float left_pupil_area = smoothstep(0.1 * u_pupil_size * u_iris_size * u_eye_size, 0.09 * u_pupil_size * u_iris_size * u_eye_size, v_distance_to_left_eye_center);
  float left_iris_area = smoothstep(0.14 * u_iris_size * u_eye_size, 0.13 * u_iris_size * u_eye_size, v_distance_to_left_eye_center) - left_pupil_area;
  float left_iris_range = smoothstep(0.14 * u_iris_size * u_eye_size, 0.09 * u_iris_size * u_eye_size, v_distance_to_left_eye_center);

  float right_pupil_area = smoothstep(0.1 * u_pupil_size * u_iris_size * u_eye_size, 0.09 * u_pupil_size * u_iris_size * u_eye_size, v_distance_to_right_eye_center);
  float right_iris_area = smoothstep(0.14 * u_iris_size * u_eye_size, 0.13 * u_iris_size * u_eye_size, v_distance_to_right_eye_center) - right_pupil_area;
  float right_iris_range = smoothstep(0.14 * u_iris_size * u_eye_size, 0.09 * u_iris_size * u_eye_size, v_distance_to_right_eye_center);


  // draw iris gradient
  color -= left_iris_area * ((1.5 - left_iris_range) * 0.2 + 0.2);
  color -= right_iris_area * ((1.5 - right_iris_range) * 0.2 + 0.2);

  // draw iris color
  color += left_iris_area * left_iris_range * blue * 0.05;
  color += right_iris_area * right_iris_range * blue * 0.05;

  // draw iris texture
  float iris_texture_noise_01 = snoise4(vec4(v_orig_pos.x * 128.0, v_orig_pos.yz * 32.0, u_time * 0.05));
  float iris_texture_noise_02 = smoothstep(-1.0, 1.0, snoise3(vec3((v_distance_to_left_eye_center + v_distance_to_right_eye_center + u_time * 0.5) * 2.0, left_iris_range + right_iris_range, iris_texture_noise_01)));
  color *= 1.0 + left_iris_area * iris_texture_noise_02 * (1.5 - left_iris_range);
  color *= 1.0 + right_iris_area * iris_texture_noise_02 * (1.5 - right_iris_range);

  // darken pupils
  color -= left_pupil_area * y_shadow * 3.0;
  color -= right_pupil_area * y_shadow * 3.0;


  // darken inside nostrils
  color *= 1.0 - smoothstep(0.5, 0.8, v_left_nostril_area);
  color *= 1.0 - smoothstep(0.5, 0.8, v_right_nostril_area);

  color *= 1.0 - v_nose_ridge_area * 0.5;

  // define head buldges
  color *= 1.0 - smoothstep(0.5, 0.0, v_head_buldges) * v_head_buldges_area * (1.0 - v_mod_pos.y) * 0.8;
  color *= 1.0 - smoothstep(1.0, 0.5, v_head_buldges) * v_head_buldges_area * (1.0 - v_mod_pos.y) * 0.8;
  color *= 1.0 + smoothstep(1.0 - y_light * 0.5, 1.1 - y_light * 0.5, v_head_buldges) * v_mod_pos.y * 0.2 * cyan;

  // light streaks in the neck/brain or something looking kinda electric
  color += (1.0 - smoothstep(0.0, 0.05, v_neck_buldges)) * smoothstep(0.7, 1.0, v_neck_buldges_area) * y_light;
  
  // darken brain groves
  color *= 1.0 - smoothstep(0.0, 0.7, v_neck_buldges) * smoothstep(0.7, 1.0, v_neck_buldges_area);

  // darken transition between head and head details
  color -= v_head_buldges_area * smoothstep(1.0, 0.0, v_head_buldges_area) * 0.25 * y_shadow;

  // define back buldges
  color *= 1.0 - smoothstep(0.5, 0.0, v_back_buldges) * v_back_buldges_area * (1.0 - v_mod_pos.y) * 0.9;
  color *= 1.0 - smoothstep(1.0, 0.5, v_back_buldges) * v_back_buldges_area * (1.0 - v_mod_pos.y) * 0.9;
  color *= 1.0 + smoothstep(1.0 - y_light * 0.5, 1.1 - y_light * 0.5, v_back_buldges) * v_mod_pos.y * 0.2 * cyan;

  // define tail buldges
  color *= 1.0 - smoothstep(0.75, 0.0, v_tail_buldges) * v_tail_buldges_area * (1.0 - v_mod_pos.y);
  color *= 1.0 - smoothstep(1.0, 0.75, v_tail_buldges) * v_tail_buldges_area * (1.0 - v_mod_pos.y);
  color *= 1.0 + smoothstep(1.0 - y_light * 0.5, 1.1 - y_light * 0.5, v_tail_buldges) * v_mod_pos.y * 0.2 * green;

  // lighten tail spikes
  color += v_tail_spikes * 0.15;

  // lighten tail
  color *= 1.0 + v_orig_pos.y * v_tail_tip_area;

  // ==============================
  // Add Details
  // ==============================

  // bright streaks along bottom tentacles
  color *= 1.0 + v_mouth_tentacles * smoothstep(0.2, 0.0, v_mod_pos.y) * smoothstep(0.4, 0.5, abs(snoise4(vec4(v_orig_pos.x * 8.0 - u_time * 0.25, v_orig_pos.yz * 128.0, u_time * 0.2)))) * 4.0;

  // body dirt
  float body_dirt = smoothstep(0.3, 0.5, snoise4(vec4(v_orig_pos.x * 8.0, v_orig_pos.yz * 16.0, (v_back_buldges + v_tail_buldges + v_head_buldges) * 4.0))) * snoise3(v_orig_pos * 8.0) * 0.5 * (v_back_buldges_area + v_tail_buldges_area + v_head_buldges_area);
  color *= 1.0 + body_dirt + abs(body_dirt) * cyan;

  // warpy brain groves
  color *= 1.0 + smoothstep(0.8, 1.0, v_neck_buldges_area) * abs(snoise4(vec4(v_mod_pos * 4.0 * v_neck_buldges, u_time * 4.0))) * 2.0;

  // grain all over
  float noise_01 = snoise3(vec3(v_orig_pos.x * 512.0, v_orig_pos.yz * 128.0));
  float texture_grain = (1.0 - clamp(v_left_eye_area + v_right_eye_area, 0.0, 1.0)) * abs(noise_01) * snoise4(vec4(v_orig_pos.x * 256.0, v_orig_pos.yz * 32.0, noise_01)) * (0.3 + smoothstep(-0.1, -0.5, v_orig_pos.x) * 0.4);
  color *= 1.0 + texture_grain + abs(texture_grain) * cyan;

  // ==============================
  // Add Extra Colors
  // ==============================

  // brain
  vec3 brain_color = (magenta * 0.5 + cyan * v_mod_pos.y) * v_neck_buldges_area;
  color *= 1.0 + brain_color * 0.5;
  color += brain_color * 0.1;

  // ==============================
  // Moving lights
  // ==============================

  // fake moving caustic-y light
  float caustics_noise_01 = snoise3(vec3(1000.0 + v_mod_pos.x * 0.25 + u_time * 0.5, 1000.0 + v_mod_pos.y * 0.1, 1000.0 + v_mod_pos.z));
  float caustics_noise_02 = snoise4(vec4(v_mod_pos.x * 0.25 + u_time, v_mod_pos.y, v_mod_pos.z, caustics_noise_01));
  color *= 1.0 + (smoothstep(-1.0, 0.0, caustics_noise_02) - smoothstep(0.0, 1.0, caustics_noise_02)) * 0.5 * (1.0 - clamp(v_left_eye_area + v_right_eye_area, 0.0, 1.0));
  
  // // color grade
  // color.r += 0.03;
  // color.g += 0.01;
  // color.b += 0.03;

  float alpha = 1.0;

  gl_FragColor = vec4(color, alpha);
}