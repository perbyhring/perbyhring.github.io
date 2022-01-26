#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform float u_time;

varying vec3 v_mod_pos;
varying vec3 v_orig_pos;
varying float v_tail_bumps;
varying float v_head_swirl;
varying float v_head_bumps;

#define PI 3.1415926535897932384626433832795

const float TAU = PI * 2.0;

const vec3 center = vec3(0.0, 0.0, 0.0);

float get_area(float begin, float end, float value) {
  return step(begin, value) - step(end, value);
}
 
float get_normalized_range(float begin, float end, float value) {
  float range = end - begin;
  return value / range;
}

void main() {

  vec3 color = vec3(0.0, 0.0, 0.0);
  float alpha = 1.0;

  // head gradient
  float head_area = smoothstep(0.2, 0.25, v_orig_pos.y);
  float head_area_position = get_normalized_range(0.2, 1.0, v_orig_pos.y);
  float clamped_head_area_position = clamp(head_area_position, 0.0, 1.0);
  color += clamped_head_area_position;

  // threads
  // float threads_area = (
  //   smoothstep(0.1, 0.05, v_orig_pos.y) - 
  //   smoothstep(-0.05, -0.1, v_orig_pos.y)
  // );
  // float threads_area_position = get_normalized_range(-0.1, 0.1, v_orig_pos.y);
  // float clamped_threads_area_position = clamp(threads_area_position, 0.0, 1.0);
  // color += threads_area;
  
  color *= v_head_swirl * 0.75;
  color += v_head_bumps * 0.25;

  // threads
  float threads_area = smoothstep(0.15, 0.1, v_orig_pos.y) - smoothstep(0.0, -0.1, v_orig_pos.y);
  vec3 threads_vector = vec3(
    v_orig_pos.x * 16.0,
    v_orig_pos.z * 16.0,
    v_orig_pos.y
  );
  float threads_noise = (1.0 - abs(snoise3(threads_vector))) * threads_area * smoothstep(-0.1, 0.15, v_orig_pos.y);
  color += threads_noise * 0.5;

  color.b += threads_noise;
  color.g += threads_noise * sin(v_mod_pos.y) * threads_area;
  color.b += (smoothstep(0.75, 0.1, v_orig_pos.y) - smoothstep(0.1, 0.0, v_orig_pos.y)) * 0.25;

  // tail bump gradients
  float tail_bumps_area = smoothstep(0.0, -0.2, v_orig_pos.y);
  color += v_tail_bumps * 1.25 * smoothstep(-1.5, -0.5, v_mod_pos.y) * tail_bumps_area;


  // color.r += 0.2 + sin(v_orig_pos.y + u_time * 0.2) * 0.2;

  float lighten_on_top = smoothstep(-0.5, 1.5, max(0.0, v_mod_pos.y) * max(0.0, v_orig_pos.y));
  color.r += lighten_on_top * 0.8;
  color.g += lighten_on_top * 0.2;
  color.b += lighten_on_top * 0.4;

  color.r *= 1.0 + sin(smoothstep(0.5, 1.0, v_mod_pos.y) * PI) * 0.75;
  color.g *= 1.0 + sin(smoothstep(0.5, 1.0, v_mod_pos.y) * PI) * 0.25;

  color.b *= 1.0 + v_head_bumps * 2.0;
  color.g *= 1.0 + v_head_bumps * (1.65 + max(0.0, v_orig_pos.y));

  color.b += smoothstep(0.7, 0.0, distance(v_mod_pos.xz, v_orig_pos.xz)) * (v_tail_bumps + 2.0) * tail_bumps_area;
  color.g += smoothstep(0.5, 0.0, distance(v_mod_pos.xz, v_orig_pos.xz)) * (v_tail_bumps + 1.0) * tail_bumps_area;
  color.r += smoothstep(0.5, 0.0, distance(v_mod_pos.xz, v_orig_pos.xz)) * (v_tail_bumps * 4.0) * tail_bumps_area;

  color.rgb += v_mod_pos.y * 0.1 * tail_bumps_area;

  color.r += v_tail_bumps * 0.25;
  color.b += v_tail_bumps * 0.55;
  color.g += v_tail_bumps * 0.35;
  // color.b *= 1.0 + tail_bumps_area * abs(min(v_mod_pos.y, 0.0));
  // color.r -= tail_bumps_area * v_mod_pos.y * 0.5;
  // color.g *= 1.0 + tail_bumps_area * distance(v_mod_pos.xz, vec2(0.0,0.0));

  alpha = clamp(exp(color.b - 0.2), 0.0, 1.0);
  // alpha *= 1.0 - smoothstep(-0.3, -0.8, v_orig_pos.y) + tail_bumps_area * v_tail_bumps * 2.0;

  gl_FragColor = vec4(color, alpha);
}