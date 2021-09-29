<Three.InstancedMesh
  bind:ref={ref}
  args={[defaultGeometry, defaultMaterial, count]}
  instanceMatrix-setUsage={THREE.DynamicDrawUsage}
  {...props}
  on:dblclick
  on:wheel
  on:pointerup
  on:pointerdown
  on:pointerenter
  on:pointermove
  on:pointerleave
  on:click
  on:clickoutside>
  <slot></slot>
</Three.InstancedMesh>

<script context="module">

import { onMount, getContext, setContext } from 'svelte'
import * as THREE from 'three'
import { Three } from '../svelte-three/index'

const defaultGeometry = new THREE.BoxBufferGeometry()
const defaultMaterial = new THREE.MeshBasicMaterial()

const object = new THREE.Object3D()
const color = new THREE.Color()

const defaultPosition = [0,0,0]
const defaultScale = [1,1,1]
const defaultRotation = [0,0,0]
const defaultColor = 0xffffff

</script>

<script>

const addAnimationLoop = getContext('three_addAnimationLoop')
const removeAnimationLoop = getContext('three_removeAnimationLoop')

export let count = 10
export let ref = null
export let instances = []

$: instancedMesh = ref

let props = {}
$: {
  props = $$props
  delete props.instances
  delete props.count
}

const removeInstance = instance => 
  instances = instances.filter(someInstance => someInstance !== instance)
const addInstance = instance => {
  instances.push(instance)
  return () => removeInstance(instance)
}
setContext('three_instancedMeshAddInstance', addInstance)

const loop = (...args) => {
  for (let i = 0; i < count; i++) {
    const instance = instances[i]
    if (instance) {

      if (instance.position) {
        object.position.set(...instance.position)
      } else {
        object.position.set(...defaultPosition)
      }

      if (instance.scale || instance.scale === 0) {
        if (Array.isArray(instance.scale)) {
          object.scale.set(...instance.scale)
        } else {
          object.scale.set(instance.scale, instance.scale, instance.scale)
        }
      } else {
        object.scale.set(...defaultScale)
      }

      if (instance.rotation) {
        object.rotation.set(...instance.rotation)
      } else {
        object.rotation.set(...defaultRotation)
      }

      object.updateMatrix()
      instancedMesh.setMatrixAt(i, object.matrix)
      
      if (instance.color) {
        color.set(instance.color)
      } else {
        color.set(defaultColor)
      }

      color.set(instance.color)
      instancedMesh.setColorAt(i, color)
    } else {
      object.scale.set(0,0,0)
      object.updateMatrix()
      instancedMesh.setMatrixAt(i, object.matrix)
    }
  }
  instancedMesh.instanceMatrix.needsUpdate = true
  instancedMesh.instanceColor.needsUpdate = true
}

onMount(() => {
  addAnimationLoop(loop)
  return () => removeAnimationLoop(loop)
})

</script>