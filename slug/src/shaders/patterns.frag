#pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 
#pragma glslify: cnoise4 = require(glsl-noise/classic/4d) 

#define PI 3.1415926535897932384626433832795

float TAU = PI * 2.0;

uniform float uTime;
uniform float uNoiseWOffset;
uniform float uNoiseYOffset;
uniform vec2 uPointer;

varying vec2 vUv;
varying vec3 uPos;

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
  return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
  );
}

float draw_circle(vec2 center, float radius, float thickness) {
  float outer = distance(vUv, center) - radius;
  float inner = outer + thickness;
  outer = 1. - step(0., outer);
  inner = 1. - step(0., inner);

  return outer - inner;
}

void main() {

  // PATTERN
  // float brightness = mod(vUv.y * 10.0, 1.0);
  // brightness = brightness < 0.5 ? 0.0 : 1.0;
  // brightness = step(0.5, brightness);

  // float brightness = mod(vUv.x * 10.0, 1.0);
  // brightness = step(0.8, brightness);

  // PATTERN
  // float x = 
  //   step(0.4, mod(vUv.x * 10.0, 1.0)) * 
  //   step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0))
  // ;

  // float y = 
  //   step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)) * 
  //   step(0.4, mod(vUv.y * 10.0, 1.0))
  // ;

  // float brightness = x + y;

  // PATTERN
  // float brightness = 1.0 - sin(vUv.x * radians(180.0));
  // float brightness = min(abs(0.5 - vUv.x), abs(0.5 - vUv.y));
  // float brightness = max(abs(0.5 - vUv.x), abs(0.5 - vUv.y));
  // float brightness = step(0.4, max(abs(0.5 - vUv.x), abs(0.5 - vUv.y)));
  // float brightness = floor(vUv.x * 10.0) / 10.0

  // float brightness = (floor(vUv.x * 10.0) / 10.0) * (floor(vUv.y * 10.0) / 10.0);

  // vec2 grid_uv = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor(vUv.y * 10.0) / 10.0
  // );
  // float brightness = random(grid_uv);  

  // vec2 grid_uv = vec2(
  //   floor(vUv.x * 10.0) / 10.0,
  //   floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0
  // );
  // float brightness = random(grid_uv);

  // float brightness = length(vUv);

  // float brightness = length(vUv - 0.5);
  // float brightness = distance(vUv, vec2(0.5));

  // float brightness = 0.01 / distance(vUv, vec2(0.5, 0.5));
  // brightness += 0.01 / distance(vUv, vec2(0.2, 0.8));
  // brightness += 0.01 / distance(vUv, vec2(0.8, 0.2));

  // float brightness = smoothstep( 0.945, 0.95, 1.0 - distance(vUv, vec2(0.5)));

  // vec2 rotated_uv = rotate(vUv, -uTime, vec2(0.5));
  // vec2 light_scale = vec2(5.0, 0.1);
  // vec2 light_uv = vec2(
  //   rotated_uv.x / light_scale.x,
  //   rotated_uv.y / light_scale.y
  // );
  // vec2 light_position = vec2(0.5, 0.5);
  // vec2 light_streak_position = vec2(light_position.x / light_scale.x, light_position.y / light_scale.y);
  // float brightness = 0.01 / distance(light_uv, light_streak_position);
  // brightness += 0.01 / distance(rotated_uv, light_position);
  // brightness = smoothstep(0.03, 1.0, brightness);

  // float brightness = atan(vUv.x - .5, vUv.y - .5);
  // brightness += PI;
  // brightness /= TAU;

  // float brightness = atan(vUv.x - .5, vUv.y - .5);
  // brightness *= 20.0;
  // brightness += PI;
  // brightness /= TAU;
  // brightness = mod(brightness, 1.0);

  // Pattern 33
  // float brightness = distance(vUv, vec2(0.5)) - 0.25;
  // brightness = abs(brightness);
  // brightness = 1.0 - step(.01, brightness);

  // Simple water
  // vec2 wavy_uv = vec2(vUv.x,vUv.y);
  // wavy_uv.y += sin((vUv.x + uTime) * 15.) * .2;
  // wavy_uv.x += cos((vUv.y + uTime) * 15.) * .2;

  // float brightness = distance(wavy_uv, vec2(0.5)) - 0.25;
  // brightness = abs(brightness);
  // float brightness1 = 1.0 - smoothstep(.01, .03, brightness);
  // float brightness2 = 1.0 - smoothstep(.3, .4, brightness);
  // float brightness3 = 1.0 - smoothstep(.28, .3, brightness);
  // brightness = brightness1 + (brightness2 - brightness3);


  // Hypnotic
  // vec2 wavy_uv = vec2(vUv.x,vUv.y);
  // wavy_uv.y += sin((vUv.x + uTime) * 15.) * .2;
  // wavy_uv.x += cos((vUv.y + uTime) * 15.) * .2;
  // float angle = atan(wavy_uv.x - .5, wavy_uv.y - .5);
  // float brightness = angle;
  // brightness *= 64.0;
  // brightness = (brightness + PI) / TAU;
  // brightness = .5 + sin(brightness) * .5;
  // brightness = smoothstep(.4,.6, brightness);

  // float angle = atan(vUv.x - .5, vUv.y - .5);
  // float brightness = angle;
  // brightness += PI;
  // brightness /= TAU;
  // brightness = sin(brightness * TAU * 12.);

  
  // float brightness = 0.;
  // float angle = atan(vUv.x - .5, vUv.y - .5);
  // angle += PI;
  // angle /= TAU;
  // float sinusoid = sin(angle * 100.);

  // brightness += draw_circle(
  //   vec2(.5),
  //   .25 + sinusoid * .02, 
  //   .01
  // );

  // float scale = 8.;
  // int iterations = 5;
  // float brightness = 0.;
  // for (int i = 0; i < iterations; i++) {
  //   float z = i == 0 ? uTime : brightness + uTime;
  //   brightness += cnoise3(vec3(vUv * scale, z)) + cnoise3(vec3(vUv * scale * .5, z));
  // }

  // float brightness = cnoise3(vec3(vUv * 10., uTime));

  // vec2 wavy_uv = vec2(vUv.x,vUv.y);
  // wavy_uv.y += sin((vUv.x) * 128. + uTime) * .003;
  // wavy_uv.x += cos((vUv.y) * 128. + uTime) * .003;
  // float noise = cnoise3(vec3(
  //   wavy_uv.x * 8.0 - uTime,
  //   wavy_uv.y * 8.0,
  //   uTime
  // ));
  // float waves_outer = smoothstep(-0.4, 0.0, noise);
  // float waves_inner = smoothstep(0.0, 0.4, noise);
  // float waves_outer_sharp = step(-0.01, noise);
  // float waves_inner_sharp = step(0.01, noise);
  // float brightness = (waves_outer - waves_inner) * .9 + (waves_outer_sharp - waves_inner_sharp);

  // float noise = cnoise4(vec4(
  //   uPosition.x * 8.0, 
  //   (uPosition.y + uNoiseWOffset) * 8.0, 
  //   uPosition.z * 8.0, 
  //   uNoiseWOffset
  // ));
  // float brightness = 0.01 / noise;
  // brightness = max(brightness, 0.0);

  // float noise = cnoise4(
  //   vec4(uPos * 10.0, uNoiseWOffset)
  // );
  // float brightness = 1.0 - abs(noise);

  float strength = cnoise4(
    vec4(uPos * 10.0, uNoiseWOffset)
  );
  strength = sin(strength * 20.0);
  strength = smoothstep(0.9, 1.0, strength);

  vec3 color_static = vec3(1.0);
  vec3 color_pos = vec3(uPos) * 2.0;
  vec3 color_uv = vec3(vUv, 1.0);
  vec3 color_mixed = mix(color_static, color_pos, strength);

  gl_FragColor = vec4(color_mixed, 1.0);

}
