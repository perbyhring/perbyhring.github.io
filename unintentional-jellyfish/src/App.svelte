
<Three.WebGLRenderer bind:ref={renderer} args={renderer_config} onTick={loop}>
  <Three.Scene>
    <Three.Color attach="background" set={0x331144} />
    <Three.Group>
      <Three.PerspectiveCamera bind:ref={camera} position={[0,3,8]} lookAt={[0,0,0]} />
    </Three.Group>
    {#if renderer && camera}
      <Orbit args={[camera, renderer.domElement]} />
    {/if}

    <Three.Mesh material={shader_material} scale-y={2.0}>
      <Three.DodecahedronGeometry args={[1, 32]} />
    </Three.Mesh>


  </Three.Scene>
</Three.WebGLRenderer>

<SourceCodeLink />

<script>

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Three, CustomThree } from 'svelte-three'

import SourceCodeLink from './components/SourceCodeLink.svelte'
import vertexShader from './shaders/unintentional-jellyfish.vert'
import fragmentShader from './shaders/unintentional-jellyfish.frag'

const Orbit = CustomThree((...args) => new OrbitControls(...args))

let renderer, camera

const renderer_config = {
  antialias: true,
  powerPreference: 'high-performance'
}

const shader_config = {
  vertexShader,
  fragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    u_time: { value: 0.0 },
    u_width: { value: 1.3 },
    u_bump_frequency: { value: 0.3 },
    u_bump_scale: { value: 0.4 }
  }
}

const shader_material = new THREE.ShaderMaterial(shader_config)

const loop = (renderer, delta, delta_time) => {
  shader_config.uniforms.u_time.value += delta_time / 1000
}

</script>