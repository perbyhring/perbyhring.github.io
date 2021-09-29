import { get } from 'svelte/store'
import { setCurrentObject, setObjectType } from './object'
import { THREE } from './three-version'
import RendererComponent from './Renderer.svelte'
import ThreeComponent from './Three.svelte'
export { default as ThreeDom } from './Dom.svelte'

export const linkThree = three => THREE.set(three)

export const Three = new Proxy({}, {
  get(obj, prop) {
    return function(...args) {
      setObjectType('three')
      setCurrentObject(get(THREE)[prop])
      if (prop === 'WebGLRenderer') {
        return new RendererComponent(...args)
      } else {
        return new ThreeComponent(...args)
      }
    }
  }
})

export const CustomThree = function(customObject) {
  return function(...args) {
    setObjectType('custom')
    setCurrentObject(customObject)
    return new ThreeComponent(...args)
  }
}