<div
    class="svelte-three__renderer"
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    bind:this={rendererContainer}
  >
    <slot />
  </div>

  <style>
    .svelte-three__renderer {
      position:relative;
      width:100%;
      height:100%;
    }
  </style>

<script context="module">

  import { onMount, setContext } from 'svelte'
  import { THREE } from './three-version'
  import { getCurrentObject } from './object'
  import { getAttachMethod } from './attach'
  import { isForeignRendererProp, updateFromProps, dispose } from './utils'

  const FPS = 60
  const MSPF = 1000 / FPS

</script>

<script>

  export let args = []
  export let scene = null
  export let camera = null
  export let currentScene = null
  export let currentCamera = null
  export let onTick = null
  export const ref = getCurrentObject(args)

  const threeObject = ref
  setContext('three_parent', threeObject)
  setContext('three_getAttachMethod', getAttachMethod)

  const renderer = threeObject
  let rendererContainer
  let width = 0
  let height = 0
  let animationLoops = []
  // if a scene or camera is not specified throuh attributes on <Three.WebGLRenderer />,
  // these two variables will contain the scene and camera which was most recently mounted.
  let newestScene
  let newestCamera
  // currentScene and currentCamera are the ones being used by the renderer
  $: currentScene = scene || newestScene
  $: currentCamera = camera || newestCamera

  // update the renderer and camera when width and height changes
  $: {
    threeObject.setSize(width, height, false)
    if (currentCamera) {
      currentCamera.aspect = width / height
      currentCamera.updateProjectionMatrix()
    }
  }

  const frustum = new $THREE.Frustum()
  const pointer = new $THREE.Vector2()
  const rayCaster = new $THREE.Raycaster()
  const matrix = new $THREE.Matrix4()

  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = 'auto'

  const updateFrustum = () => {
    if (!currentCamera) {
      return
    }
    frustum.setFromProjectionMatrix(
      matrix.multiplyMatrices(
        currentCamera.projectionMatrix,
        currentCamera.matrixWorldInverse
      )
    )
  }

  const updateRaycaster = e => {
    if (!currentCamera) {
      return
    }
    rayCaster.setFromCamera(pointer, currentCamera)
  }

  renderer.domElement.addEventListener('pointermove', e => {
    pointer.x = ( e.offsetX / width ) * 2 - 1
    pointer.y = - ( e.offsetY / height ) * 2 + 1
    updateRaycaster(e)
  })

  const addAnimationLoop = loop => {
    if (loop) {
      animationLoops.push(loop)
    }
  }
  const removeAnimationLoop = loop => {
    animationLoops = animationLoops.filter(someLoop => someLoop !== loop)
  }

  setContext('three_setNewestScene', someScene => newestScene = someScene)
  setContext('three_setNewestCamera', someCamera => newestCamera = someCamera)
  setContext('three_getCamera', () => currentCamera)
  setContext('three_getRenderer', () => renderer)
  setContext('three_addAnimationLoop', addAnimationLoop)
  setContext('three_removeAnimationLoop', removeAnimationLoop)
  setContext('three_getFrustum', () => frustum)
  setContext('three_getRaycaster', rayCaster)

  let previousTime = 0
  const renderLoop = time => {
    const delta = time - previousTime
    previousTime = time
    animationLoops.forEach(loop => loop(delta / MSPF, delta, time))
    updateFrustum()
    // If the onTick-function on the renderer returns a truthy-value,
    // it should not automatically render. A truthy value is a signal that rendering is 
    // handled manually from the animationLoop.
    const userDidManuallyRender = onTick && onTick(renderer, delta / MSPF, delta, time)
    if (!userDidManuallyRender) {
      if (currentScene && currentCamera) {
        renderer.render(currentScene, currentCamera)
      }
    }
  }

  const onTickProps = {}
  $: updateFromProps(
    () => $$props,
    isForeignRendererProp,
    onTickProps,
    threeObject,
    onMount,
    addAnimationLoop,
    removeAnimationLoop
  )

  onMount(() => {
    rendererContainer.appendChild(renderer.domElement)
    renderer.setAnimationLoop(renderLoop)
    return () => {
      rendererContainer.removeChild(renderer.domElement)
      renderer.setAnimationLoop(null)
      dispose(renderer)
    }
  })

</script>