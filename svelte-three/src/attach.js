import { get } from 'svelte/store'
import { THREE } from './three-version'

export const attachMethods = {
  object3D: (threeObject, parent) => {
    parent.add(threeObject)
    return () => parent.remove(threeObject)
  },
  meshMaterial: (threeObject, parent) => {
    const previousMaterial = parent.material
    parent.material = threeObject
    return () => {
      if (parent.material === threeObject) {
        parent.material = previousMaterial
      }
    }
  },
  meshGeometry: (threeObject, parent) => {
    const previousGeometry = parent.geometry
    parent.geometry = threeObject
    return () => {
      if (parent.geometry === threeObject) {
        parent.geometry = previousGeometry
      }
    }
  },
  notAttached: (threeObject, parent) => {
    return () => {}
  }
}

export const getAttachMethod = (threeObject, parent) => {
  const $THREE = get(THREE)
  if (threeObject instanceof $THREE.Object3D && parent instanceof $THREE.Object3D) {
    return attachMethods.object3D
  }
  else if (threeObject instanceof $THREE.Material && parent instanceof $THREE.Object3D) {
    return attachMethods.meshMaterial
  }
  else if (threeObject instanceof $THREE.BufferGeometry && parent instanceof $THREE.Object3D) {
    return attachMethods.meshGeometry
  }
  else {
    return attachMethods.notAttached
  }
}