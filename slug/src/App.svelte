<Three.WebGLRenderer
  bind:ref={renderer}
  args={renderer_config}
  setPixelRatio={1}
  onTick={(renderer, delta, delta_time) => {
    u_time += delta_time / 1000
    return true
  }}>
  {#if renderer && scene && camera}
    <EffectComposer args={renderer} onTick={composer => composer.render( 0.1 )}>
      <RenderPass args={[scene, camera]} attach="addPass" />
      <BloomPass args={[new Vector2(window.innerWidth, window.innerHeight), 0.05, 0.2, 0.75]} attach="addPass" />
      <BokehPass args={[scene, camera, bokeh_config]} attach="addPass" onTick:uniforms-focus-value={bokeh_focus_distance} />
    </EffectComposer>
  {/if}
  <Three.Scene bind:ref={scene}>
    <Three.Color attach="background" set={0x000000} />

    <Three.PerspectiveCamera bind:ref={camera} position={[10,5,-9]} lookAt={[0,0.5,0]} fov={18} />

    {#if renderer && camera}
      <Orbit
        args={[camera, renderer.domElement]}
        target={[0,0.5,0]}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.1}
        minDistance={5}
        maxPolarAngle={Math.PI * 0.5}
        onTick={controls => controls.update()}
      />
    {/if}

    <Three.Mesh>
      <Three.PlaneGeometry args={[12, 12, 256, 256]} translate={[-2,0,0]} rotateX={Math.PI * -.5} />
      <Three.ShaderMaterial args={ground_shader_config} onTick:uniforms-u_time-value={u_time} />
    </Three.Mesh>

    <Three.Mesh frustumCulled={false}>
      <Three.CylinderGeometry args={[.5, .5, 1, 256, 512]} rotateZ={Math.PI * .5} />
      <Three.ShaderMaterial args={slug_shader_config} onTick:uniforms-u_time-value={u_time} />
    </Three.Mesh>

  </Three.Scene>
</Three.WebGLRenderer>

<Poem />
<Modify bind:uniforms={slug_uniforms} />
<SourceCodeLink />

<script>

import { Vector2, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer as effectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass as renderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass as bokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import { Three, CustomThree } from 'svelte-three'
import Poem from './components/Poem.svelte'
import Modify from './components/Modify.svelte'
import SourceCodeLink from './components/SourceCodeLink.svelte'

import slug_vertex from './shaders/slug.vert'
import slug_fragment from './shaders/slug.frag'
import ground_vertex from './shaders/ground.vert'
import ground_fragment from './shaders/ground.frag'

const EffectComposer = CustomThree((...args) => new effectComposer(...args))
const RenderPass = CustomThree((...args) => new renderPass(...args))
const BokehPass = CustomThree((...args) => new bokehPass(...args))
const bokeh_config = { focus: 7, aperture: 0.001, maxblur: 0.01 }
const BloomPass = CustomThree((...args) => new UnrealBloomPass(...args))

const focus_point = new Vector3(-0.2, 0.5, 0.0)

const bokeh_focus_distance = () => camera.position.distanceTo(focus_point)

let renderer, scene, camera

let u_time = 0.0

let slug_uniforms = {
  u_time: { value: u_time },
  u_eye_size: { value: 1.0 },
  u_iris_size: { value: 0.8 },
  u_pupil_size: { value: 0.9 },
  u_mouth_size: { value: 1.0 },
  u_nose_size: { value: 1.0 }
}
const slug_shader_config = {
  vertexShader: slug_vertex,
  fragmentShader: slug_fragment,
  uniforms: slug_uniforms
}
const ground_uniforms = {
  u_time: { value: u_time }
}
const ground_shader_config = {
  vertexShader: ground_vertex,
  fragmentShader: ground_fragment,
  uniforms: ground_uniforms
}

const Orbit = CustomThree((...args) => new OrbitControls(...args))

const renderer_config = {
  antialias: true,
  powerPreference: 'high-performance'
}

</script>