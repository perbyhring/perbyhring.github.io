uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

float add(float a, float b) {
  return a + b;
}

void side_effect() {
  float a = 1.0;
  float b = 2.0;
}

void main() {

  float fn_result = add(1.0, 2.0);

  side_effect();

  // float
  float a = 1.0;
  float b = 2.0;
  float c = a + b;

  // int
  int d = 123;
  int e = 2;
  int f = d * e;

  // float and int can't be mixed
  // need to convert
  float g = float(d) * b;

  // bool
  bool h = true;
  bool i = false;

  // vec2
  // can't be initiated without values. This will produce an error: vec2();
  vec2 pos_2d = vec2(1.0, 2.0);
  pos_2d.x = 1.0;
  pos_2d.y = 2.0;
  // multiply both values with a scalar
  pos_2d *= 2.0;

  vec3 pos_3d = vec3(0.0);
  vec3 player_3d = vec3(1.0,2.0,3.0);

  // x,y,z and r,g,b are interchangeable aliases to the vector values.
  vec3 purple_color = vec3(0.0);
  purple_color.r = 0.5;
  purple_color.g = 0.0;
  purple_color.b = 1.0;

  // vec2 can be inserted into vec3 or vec4
  vec2 foo = vec2(1.0, 2.0);
  vec3 bar = vec3(foo, 3.0);

  // vec3 values can be used to create vec2
  vec2 koo = bar.xz;
  vec2 boo = bar.yx;
  
  vec4 color_rgba = vec4(0.0, 0.0, 0.0, 1.0);
  vec4 color_rgba_copy = color_rgba.xyzw;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}