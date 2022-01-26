#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

#pragma glslify: ease_quartic_in = require(glsl-easings/quartic-in)

#pragma glslify: rotateX = require(glsl-rotate/rotateX)
#pragma glslify: rotateY = require(glsl-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

uniform float u_time;

varying vec3 v_orig_pos;
varying vec3 v_mod_pos;

varying float v_bumpy_path_area;

const float PI = radians(180.0);
const float TAU = PI * 2.0;
const vec3 center = vec3(0.0, 0.0, 0.0);

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

  // align with slug floor
  mod_pos.y -= .18;

  // the path is bumpy
  float bumpy_path_sin = sin((mod_pos.x - 1.3) * 4.0 + u_time * 2.0 + PI) * 0.6 * clamp(exp(abs(smoothstep(0.1, 0.5, mod_pos.z))), 0.0, 1.0) / 8.0;
  float bumpy_path_area = (smoothstep(1.0 + bumpy_path_sin, 0.25 + bumpy_path_sin, mod_pos.z) - smoothstep(-0.25 + bumpy_path_sin, -1.0 + bumpy_path_sin, mod_pos.z)) * smoothstep(0.7, 0.4, mod_pos.x);
  float bumpy_path_noise = snoise2(vec2(mod_pos.x * 2.0 + u_time, bumpy_path_sin));
  float bumpy_path = abs(bumpy_path_noise) * bumpy_path_area;
  mod_pos.y += bumpy_path * 0.025;

  // the path also has small groves from the legs kicking
  float path_groves_area = bumpy_path_area * smoothstep(0.1, -0.3, mod_pos.x);
  float path_groves_noise = snoise2(vec2(mod_pos.x * 2.0 + u_time, mod_pos.z * 2.0));
  float path_groves = abs(path_groves_noise) * path_groves_area;
  mod_pos.y += path_groves * 0.05;

  // the ground is bumpy
  float bumpy_ground_area = 1.0 - bumpy_path_area;
  float bumpy_ground_noise = snoise2(vec2(mod_pos.x * 0.5 + u_time * 0.25, mod_pos.z * 0.25));
  mod_pos.y += abs(bumpy_ground_noise) * bumpy_ground_area * 0.2;
  mod_pos.y += bumpy_ground_area * 0.1;

  // the ground also has small holes
  float ground_holes_area = 1.0 - bumpy_path_area;
  float ground_holes_noise = snoise2(vec2(1000.0 + mod_pos.x + u_time * 0.5, 1000.0 + mod_pos.z * 0.5));
  mod_pos.y -= abs(ground_holes_noise) * ground_holes_area * 0.1;

  // the ground is actually even more bumpy on the sides
  float hilly_ground_area = smoothstep(1.0, 10.0, mod_pos.z) + smoothstep(-1.0, -10.0, mod_pos.z);
  float hilly_ground_noise = snoise3(vec3(mod_pos.x * .2 + u_time * .1, mod_pos.z * 0.1, mod_pos.y * .05));
  float hilly_ground = abs(hilly_ground_noise) * hilly_ground_area * 5.0;
  mod_pos.y += hilly_ground;

  // ==============================
  // APPLY
  // ==============================

  vec4 view_position = viewMatrix * vec4(mod_pos, 1.0);
  vec4 projected_position = projectionMatrix * view_position; 

  gl_Position = projected_position;


  // ==============================
  // PASS VALUES TO FRAGMENT SHADER
  // ==============================

  v_orig_pos = orig_pos;
  v_mod_pos = mod_pos;

  v_bumpy_path_area = bumpy_path_area;

}