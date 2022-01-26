#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

#pragma glslify: ease_quartic_in = require(glsl-easings/quartic-in)

#pragma glslify: rotateX = require(glsl-rotate/rotateX)
#pragma glslify: rotateY = require(glsl-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

const float PI = radians(180.0);
const float TAU = PI * 2.0;
const vec3 center = vec3(0.0, 0.0, 0.0);

uniform float u_time;
uniform float u_eye_size;
uniform float u_mouth_size;
uniform float u_nose_size;

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

float linearstep(float begin, float end, float value) {
  float range = end - begin;
  return clamp((value - begin) / range, 0.0, 1.0);
}

const float elongation = 3.5;

void main() {

  // ==============================
  // SETUP
  // ==============================

  vec4 model_position = modelMatrix * vec4(position, 1.0);

  // original position of the vertices
  vec3 orig_pos = model_position.xyz;

  // modified position of the vertices
  vec3 mod_pos = model_position.xyz;

  // ==============================
  // SCULPT
  // ==============================

  // elongate
  mod_pos.x *= elongation;

  // round front
  mod_pos.x *= 1.0 - cos(PI - linearstep(0.25, 0.5, orig_pos.x) * PI * .5) * 0.333;
  mod_pos.yz *= cos(PI - linearstep(0.25, 0.5, orig_pos.x) * PI * .5);

  // round back
  mod_pos.x *= 1.0 - cos(PI - linearstep(-0.25, -0.5, orig_pos.x) * PI * .5) * 0.333;
  mod_pos.yz *= cos(PI - linearstep(-0.25, -0.5, orig_pos.x) * PI * .5);

  // flatten underneath
  mod_pos.y *= 1.0 - linearstep(0.0, -0.5, orig_pos.y) * 0.6;

  // fatten chest
  float chest_area = (smoothstep(-0.15, 0.1, orig_pos.x) - smoothstep(0.1, 0.35, orig_pos.x)) * smoothstep(-0.3, 0.35, orig_pos.y);
  mod_pos.y *= 1.0 + chest_area * 0.4;
  mod_pos.z *= 1.0 + chest_area * 0.6;

  // shrink tail
  float tail_tip_area = smoothstep(0.0, -0.5, orig_pos.x);
  mod_pos.yz *= 1.0 - distance(mod_pos.yz, center.yz) * tail_tip_area * 2.75;

  // puff up left eye socket
  vec3 left_eyesocket_center = vec3(elongation * 0.55, 0.35, -0.4);
  float distance_to_left_eye_center = distance(mod_pos, left_eyesocket_center);
  float left_eyesocket_area = smoothstep(0.3 * u_eye_size, 0.2 * u_eye_size, distance_to_left_eye_center) * smoothstep(elongation * 0.6, elongation * 0.5, mod_pos.x);
  mod_pos += normalize(mod_pos) * left_eyesocket_area * .2;
  mod_pos.y += left_eyesocket_area * 0.03;

  // carve left eye
  float left_eye_area = smoothstep(0.16 * u_eye_size, 0.12 * u_eye_size, distance_to_left_eye_center);
  float left_eye_range = smoothstep(0.12 * u_eye_size, 0.06 * u_eye_size, distance_to_left_eye_center);
  mod_pos -= normalize(mod_pos) * left_eye_area * .075;
  mod_pos += normalize(mod_pos) * left_eye_range * .075;

  // puff up right eye socket
  vec3 right_eyesocket_center = vec3(elongation * 0.55, 0.35, 0.4);
  float distance_to_right_eye_center = distance(mod_pos, right_eyesocket_center);
  float right_eyesocket_area = smoothstep(0.3 * u_eye_size, 0.2 * u_eye_size, distance_to_right_eye_center) * smoothstep(elongation * 0.6, elongation * 0.5, mod_pos.x);
  mod_pos += normalize(mod_pos) * right_eyesocket_area * .2;
  mod_pos.y += right_eyesocket_area * 0.03;

  // carve right eye
  float right_eye_area = smoothstep(0.16 * u_eye_size, 0.12 * u_eye_size, distance_to_right_eye_center);
  float right_eye_range = smoothstep(0.12 * u_eye_size, 0.06 * u_eye_size, distance_to_right_eye_center);
  mod_pos -= normalize(mod_pos) * right_eye_area * .075;
  mod_pos += normalize(mod_pos) * right_eye_range * .075;

  // puff up nose
  vec3 nose_center = vec3(elongation * 0.54, 0.35, 0.0);
  float distance_to_nose_center = distance(mod_pos, nose_center);
  float nose_area = smoothstep(0.3 * u_nose_size, 0.1 * u_nose_size, distance_to_nose_center);
  mod_pos += normalize(mod_pos) * nose_area * 0.2;

  // carve nostrils
  float nostril_size = clamp(u_nose_size, 0.0, 0.8);
  vec3 left_nostril_center = vec3(elongation * 0.63, 0.4, 0.065);
  float distance_to_left_nostril_center = distance(mod_pos, left_nostril_center);
  float left_nostril_area = smoothstep(0.08 * nostril_size, 0.05 * nostril_size, distance_to_left_nostril_center) * smoothstep(0.2, 0.4, mod_pos.y);
  mod_pos -= normalize(mod_pos) * left_nostril_area * 0.05;
  
  vec3 right_nostril_center = vec3(elongation * 0.63, 0.4, -0.065);
  float distance_to_right_nostril_center = distance(mod_pos, right_nostril_center);
  float right_nostril_area = smoothstep(0.08 * nostril_size, 0.05 * nostril_size, distance_to_right_nostril_center) * smoothstep(0.2, 0.4, mod_pos.y);
  mod_pos -= normalize(mod_pos) * right_nostril_area * 0.05;

  // pull nose out and downwards
  vec3 nose_ridge_center = vec3(elongation * 0.59, 0.45, 0.0);
  float distance_to_nose_ridge_center = distance(mod_pos, nose_ridge_center);
  float nose_ridge_area = smoothstep(0.2 * u_nose_size, 0.0 * u_nose_size, distance_to_nose_ridge_center);
  mod_pos.xy += vec2(nose_ridge_area * 0.15, (nose_ridge_area - 0.75) * -0.1);

  // crease tail
  float tail_crease_area = smoothstep(-0.1, -0.105, orig_pos.x + snoise3(orig_pos * 2.0) * 0.0075);
  float tail_crease_area_range = linearstep(-0.1, -0.5, orig_pos.x);
  mod_pos.x += tail_crease_area * 0.025;
  mod_pos.y *= 1.0 - cos(tail_crease_area * tail_crease_area_range * PI) * 0.35 * tail_crease_area * mod_pos.y * 0.5;
  mod_pos.z *= 1.0 - cos(tail_crease_area * tail_crease_area_range * PI) * 0.35 * tail_crease_area * 0.5;

  // crease neck
  float neck_crease_area = smoothstep(0.15, 0.18, orig_pos.x + snoise3(orig_pos * 3.0) * 0.0075);
  float neck_crease_area_range = linearstep(0.15, 0.22, orig_pos.x);
  mod_pos.y *= 1.0 - cos(neck_crease_area * neck_crease_area_range * PI) * 0.25 * neck_crease_area * mod_pos.y;
  mod_pos.z *= 1.0 - cos(neck_crease_area * neck_crease_area_range * PI) * 0.25 * neck_crease_area;
  mod_pos.x -= neck_crease_area * 0.1;

  // crease head
  float head_area = smoothstep(0.20, 0.21, orig_pos.x + sin(orig_pos.y * 32.0) * 0.035);
  float head_area_range = linearstep(0.20, 0.4, orig_pos.x);
  mod_pos.y *= 1.0 + cos(head_area * head_area_range * PI) * 0.15 * head_area * mod_pos.y;

  // back buldges along x-axis
  float back_buldges_area = 1.0 - neck_crease_area - tail_crease_area;
  float back_buldges_strength = smoothstep(-0.2, 0.2, orig_pos.y) * back_buldges_area;
  vec3 back_buldges_vector = vec3(orig_pos.x * 4.0, orig_pos.y * 8.0, orig_pos.z * 8.0 + sin(orig_pos.x * 40.0) * 0.25);
  float back_buldges_noise = abs(snoise3(back_buldges_vector));
  float back_buldges = back_buldges_noise * back_buldges_strength;
  mod_pos += normal * back_buldges * 0.1 * chest_area;

  // tail buldges along y-axis
  float tail_buldges_area = tail_crease_area - tail_tip_area;
  float tail_buldges_strength = smoothstep(-0.2, 0.2, orig_pos.y) * tail_buldges_area;
  vec3 tail_buldges_vector = vec3((orig_pos.x * 6.0 + orig_pos.y * 0.5) * 6.0, orig_pos.y * 0.2, orig_pos.z * 0.2);
  float tail_buldges_noise = abs(snoise3(tail_buldges_vector));
  float tail_buldges = tail_buldges_noise * tail_buldges_strength;
  mod_pos += normal * tail_buldges * 0.065;

  // underside bumps
  float underside_area = (smoothstep(0.1, -0.18, mod_pos.y) - smoothstep(-0.16, -0.18, mod_pos.y));
  vec3 underside_bumps_vector = vec3(mod_pos.x * 8.0, mod_pos.yz * 0.25);
  float underside_bumps_noise = abs(snoise3(underside_bumps_vector));
  float underside_bumps = underside_bumps_noise * 0.2 * underside_area * (1.0 - abs(orig_pos.x) * 1.6);
  mod_pos.xz += normal.xz * underside_bumps;

  // mouth hole
  float mouth_hole_area = smoothstep(0.4 / u_mouth_size, 0.45 / u_mouth_size, orig_pos.x);
  float mouth_hole_range = linearstep(0.4 / u_mouth_size, 0.5 / u_mouth_size, orig_pos.x);
  float mouth_hole = cos(PI * 0.25 + mouth_hole_range * PI * 0.25) * mouth_hole_area;
  mod_pos.yz += normal.yz * mouth_hole * 0.5 * mouth_hole_area;
  mod_pos.y += mouth_hole_area * 0.1;
  mod_pos.x -= mouth_hole_area * 0.4;

  // mouth tentacles (animated)
  float mouth_tentacles_area = smoothstep(0.405 / u_mouth_size, 0.415 / u_mouth_size, orig_pos.x);
  vec3 mouth_tentacles_vector = vec3(orig_pos.x * 8.0, orig_pos.yz * 8.0);
  float mouth_tentacles_noise = abs(snoise3(mouth_tentacles_vector));
  float mouth_tentacles = mouth_tentacles_noise * mouth_tentacles_area;
  mod_pos.y -= normal.y * mouth_tentacles * 0.1;

  // drag bottom of mouth backwards
  float bottom_of_mouth_area = (
    smoothstep(0.3 / u_mouth_size, 0.5 / u_mouth_size, orig_pos.x) * 
    smoothstep(0.35 / u_mouth_size, -0.5 / u_mouth_size, orig_pos.y) * 
    smoothstep(0.0 / u_mouth_size, 0.5 / u_mouth_size, abs(orig_pos.z))
  );
  mod_pos.x -= bottom_of_mouth_area * 0.3;

  // neck buldges (animated)
  float neck_buldges_area = neck_crease_area - head_area;
  float neck_buldges_strength = neck_buldges_area;
  vec4 neck_buldges_vector = vec4(mod_pos * 6.0, u_time);
  float neck_buldges_noise = abs(snoise4(neck_buldges_vector));
  float neck_buldges = neck_buldges_noise * neck_buldges_strength;
  mod_pos -= normal * neck_buldges * 0.1;

  // head buldges
  float areas_with_no_head_buldges = (
    mouth_hole_area + 
    nose_ridge_area +
    left_eyesocket_area +
    left_eye_area +
    right_eyesocket_area +
    right_eye_area +
    nose_area * 0.25 +
    left_nostril_area +
    right_nostril_area +
    smoothstep(0.38 / u_mouth_size, 0.4 / u_mouth_size, orig_pos.x) * 0.8
  );
  float head_buldges_area = head_area - clamp(areas_with_no_head_buldges, 0.0, 1.0);
  float head_buldges_strength = smoothstep(-0.4, -0.1, orig_pos.y) * head_buldges_area;
  vec3 head_buldges_vector = vec3(mod_pos.x * 16.0 + sin(1.8 + orig_pos.z * 18.0) * 1.0, mod_pos.y * 2.0, mod_pos.z * 8.0) * orig_pos.x;
  float head_buldges_noise = abs(snoise3(head_buldges_vector));
  float head_buldges = head_buldges_noise * head_buldges_strength;
  mod_pos += normal * head_buldges * 0.075;

  // tail spikes
  float tail_spikes_area = (
    (smoothstep(-0.1, -0.11, orig_pos.x) - smoothstep(-0.475, -0.5, orig_pos.x)) * 
    ( smoothstep(-0.25, 0.0, mod_pos.z) - smoothstep(0.0, 0.25, mod_pos.z) ) *
    smoothstep(0.0, 0.3, orig_pos.y)
  );
  vec3 tail_spikes_vector = mod_pos * 6.0;
  float tail_spikes_noise = abs(snoise3(tail_spikes_vector));
  float tail_spikes = tail_spikes_noise * tail_spikes_area;
  mod_pos.y += tail_spikes * 0.05;

  // push tail down to ground
  mod_pos.y -= 0.18 * tail_tip_area;

  // ==============================
  // ANIMATE
  // ==============================

  // body wiggle
  float body_wiggle_area = (1.0 - head_area) * (smoothstep(0.5, -0.5, orig_pos.x) - smoothstep(0.0, -0.5, orig_pos.x));
  float body_wiggle_noise = snoise4(vec4(mod_pos.x + u_time * 1.0, mod_pos.yz, u_time)) * abs(mod_pos.z * 3.0);
  float body_wiggle_z = sin(u_time * 2.0 + body_wiggle_noise + mod_pos.x * 4.0) * 0.1 * body_wiggle_noise * body_wiggle_area;
  mod_pos.z += body_wiggle_z;

  // ground bumps walk wiggle
  float walk_wiggle_area = underside_bumps * smoothstep(0.1, 0.3, abs(mod_pos.z));
  float walk_wiggle_angle = mod_pos.x * 32.0 + u_time * 16.0;
  mod_pos.x += sin(walk_wiggle_angle + body_wiggle_noise) * walk_wiggle_area * 0.4;
  mod_pos.y += cos(walk_wiggle_angle + body_wiggle_noise) * walk_wiggle_area * 0.2;

  // body motion
  float body_motion_area = smoothstep(-0.5, 0.0, orig_pos.x);
  float body_motion_rotation = (mod_pos.x * 0.8) - (mod_pos.x * 0.8) * neck_crease_area + neck_crease_area;
  float body_motion_sin = sin(body_motion_rotation * 0.44 * elongation + u_time * 2.0) * body_motion_area;
  vec3 body_motion_rotation_vector = vec3(mod_pos.x - 1.45, mod_pos.yz);
  mod_pos = rotateY(body_motion_rotation_vector, body_motion_sin * 0.1);

  // head motion
  float head_motion_area = smoothstep(0.10, 0.30, orig_pos.x + snoise3(orig_pos * 3.0) * 0.0075);
  float head_motion_rotation = mod_pos.x - mod_pos.x * head_motion_area + head_motion_area;
  float head_motion_sin_y = sin(head_motion_rotation + u_time * 3.0 + 0.8) * head_motion_area;
  float head_motion_angle_noise_x = snoise2(vec2(1.0, u_time * 0.5));
  float head_motion_cos_x = cos(head_motion_rotation + head_motion_angle_noise_x * TAU + u_time * 3.0 + 0.8) * head_motion_area;
  mod_pos = rotateX(mod_pos, head_motion_cos_x * 0.1);
  mod_pos = rotateY(mod_pos, head_motion_sin_y * 0.1);
  float head_motion_cos_z = cos(head_motion_rotation + u_time * 1.5 + 0.8) * head_motion_area;
  mod_pos = rotateZ(mod_pos, head_motion_cos_z * 0.35);
  mod_pos.y += head_motion_angle_noise_x * head_motion_area * 0.2;
  mod_pos.y -= (mod_pos.y + 0.15 * underside_area) * underside_area * head_motion_area;

  // the ground is bumpy
  float bumpy_ground_area = smoothstep(0.3, 0.0, mod_pos.y);
  float bumpy_ground_noise = snoise2(vec2(mod_pos.x * 2.0 + u_time, 0.0));
  float bumpy_ground = abs(bumpy_ground_noise) * bumpy_ground_area;
  mod_pos.y += bumpy_ground * 0.05;

  // ==============================
  // APPLY
  // ==============================

  vec4 view_position = viewMatrix * vec4(mod_pos, 1.0);
  vec4 projected_position = projectionMatrix * view_position; 

  gl_Position = projected_position;


  // ==============================
  // PASS VALUES TO FRAGMENT SHADER
  // ==============================

  v_mod_pos = mod_pos;
  v_orig_pos = orig_pos;

  v_mouth_hole_area = mouth_hole_area;
  v_mouth_tentacles = mouth_tentacles;

  v_left_eye_area = left_eye_area;
  v_right_eye_area = right_eye_area;
  v_distance_to_left_eye_center = distance_to_left_eye_center;
  v_distance_to_right_eye_center = distance_to_right_eye_center;

  v_nose_ridge_area = nose_ridge_area;
  v_left_nostril_area = left_nostril_area;
  v_right_nostril_area = right_nostril_area;

  v_head_buldges_area = head_buldges_area;
  v_head_buldges = head_buldges;

  v_neck_buldges_area = neck_buldges_area;
  v_neck_buldges = neck_buldges;

  v_back_buldges_area = back_buldges_area;
  v_back_buldges = back_buldges;

  v_tail_buldges_area = tail_buldges_area;
  v_tail_buldges = tail_buldges;
  v_tail_spikes = tail_spikes;
  v_tail_tip_area = tail_tip_area;

}