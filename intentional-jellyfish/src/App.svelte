
<Three.WebGLRenderer bind:ref={renderer} args={renderer_config}>
  <Three.Scene>
    
    <Three.Color attach="background" set={0x000000} />
    <Three.Group>
      <Three.PerspectiveCamera bind:ref={camera} position={[0,-2,8]} lookAt={[0,-1,0]} />
    </Three.Group>
    {#if renderer && camera}
      <Orbit args={[camera, renderer.domElement]} target={[0,-1,0]} />
    {/if}

    <Three.Mesh>
      <Three.IcosahedronGeometry args={[1, 64]} />
      <Three.ShaderMaterial
        args={jellyfish_shader_config}
        onTick:uniforms-u_time-value={(value, mat, delta, delta_time) => value += delta_time / 1000}
      />
    </Three.Mesh>

  </Three.Scene>
</Three.WebGLRenderer>

<SourceCodeLink />

<script>

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Three, CustomThree } from 'svelte-three'
import SourceCodeLink from './components/SourceCodeLink.svelte'

import jellyfish_vertex_shader from './shaders/jellyfish.vert'
import jellyfish_fragment_shader from './shaders/jellyfish.frag'

const Orbit = CustomThree((...args) => new OrbitControls(...args))

let renderer, camera

const renderer_config = {
  antialias: true,
  powerPreference: 'high-performance'
}

const jellyfish_shader_config = {
  vertexShader: jellyfish_vertex_shader,
  fragmentShader: jellyfish_fragment_shader,
  uniforms: {
    u_time: { value: 0.0 }
  }
}

</script>