#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

#define PI 3.1415926535897932384626433832795

float TAU = PI * 2.0;

uniform float u_time;
uniform float u_width;
uniform float u_bump_frequency;
uniform float u_bump_scale;

varying vec3 v_pos;
varying vec3 v_orig_pos;
varying vec3 v_view_pos;
varying float v_bumps;

const float bump_iterations = 7.0;

void main() {

  
  vec4 model_position = modelMatrix * vec4(position, 1.0);

  vec3 pos = position;

  pos.xz *= u_width - (0.05 + smoothstep(0.0, -0.3, position.y) * -0.3) * u_width * 0.3;
  
  pos.xz *= 1.0 - sin((pos.y + u_time * 0.2 * TAU) * 2.0) * 0.2;
  pos.y *= 1.0 - sin((pos.y + (u_time + 0.3) * 0.2 * TAU) * 2.0) * .6;
  
  float bumps = 0.0;

  for (float i = 1.0; i < bump_iterations; i += 1.0) {
    float bump_scalar = (pos.y * 0.5 - 1.0) * u_bump_frequency * pow(i, 1.4);
    float bump_noise = snoise4(vec4(
      pos.x * bump_scalar,
      pos.y * bump_scalar + u_time * 0.1,
      pos.z * bump_scalar,
      u_time * 0.1 * pow(i, 1.0)
    ));
    bump_noise = abs(bump_noise);
    bumps += bump_noise * u_bump_scale / i * sin(((pos.y + u_time * 0.2 * TAU) - PI * .5) * 2.0);
  }
  pos *= 1.0 + bumps;


  pos.xz *= 1.0 - smoothstep(0.2, 0.1, position.y) * 0.35;

  model_position.xyz = pos;

  vec4 view_position = viewMatrix * model_position;
  vec4 projected_position = projectionMatrix * view_position;

  gl_Position = projected_position;

  v_pos = vec3(model_position.xyz);
  v_view_pos = vec3(view_position.xyz);
  v_bumps = bumps;
  v_orig_pos = position;
}