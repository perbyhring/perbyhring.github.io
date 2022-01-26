#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

#define PI 3.1415926535897932384626433832795

float TAU = PI * 2.0;

uniform float u_time;
uniform float u_big_waves_elevation;
uniform vec2 u_big_waves_frequency;
uniform float u_big_waves_speed;

varying float v_elevation;
varying vec3 v_pos;

void main() {

  vec4 model_position = modelMatrix * vec4(position, 1.0);

  // -1 >> 1
  float elevation_sin = 
    sin(model_position.x * u_big_waves_frequency.x + u_time * u_big_waves_speed) * 
    sin(model_position.z * u_big_waves_frequency.y + u_time * 0.8 * u_big_waves_speed);

  float elevation_small_sin = 
    sin(model_position.x * u_big_waves_frequency.x * 3.0 + u_time * u_big_waves_speed) * 
    sin(model_position.z * u_big_waves_frequency.y * 3.0 + u_time * 0.8 * u_big_waves_speed);
  // 0 >> 1
  float elevation_normal = elevation_sin * 0.5 + 0.5;
  // custom range set from uniform
  float elevation = elevation_sin * u_big_waves_elevation + elevation_small_sin * (1.0 - elevation_normal) * u_big_waves_elevation * 0.4;

  float noise_iterations = 10.0;
  float noise_elevation = 0.035;
  float noise_speed = u_time * 0.05 + elevation_normal * 0.05;
  float noise_resolution = 2.0 + elevation_normal;
  float x_offset = sin(elevation_normal) * .15 * cos(model_position.x * PI);

  float noisy_waves_elevation = 0.0;
  
  for (float i = 1.0; i < noise_iterations; i += 2.0) {
    vec3 noise_vector = vec3(
      model_position.x * noise_resolution * i + abs(elevation_normal) * 0.75,
      model_position.z * noise_resolution* i,
      u_time * .1 + noise_speed * pow(i, 1.75) + elevation_sin * .5
    );
    float noise = snoise3(noise_vector);
    noise = (noise * noise_elevation) / i;
    x_offset += sin(noise * PI) / i * .4 * cos(model_position.x * PI);
    noise = -abs(noise) * (0.2 + elevation_normal);
    noisy_waves_elevation += noise;
  }

  elevation += noisy_waves_elevation;
  model_position.x -= x_offset;
  model_position.y += elevation;
  model_position.y -= sin(x_offset * 1.5) * .05;

  vec4 view_position = viewMatrix * model_position;
  vec4 projected_position = projectionMatrix * view_position;

  gl_Position = projected_position;

  v_elevation = elevation;
  v_pos = vec3(model_position.xyz);
}