<div
  class="svelte-three__dom"
  class:svelte-three__dom--auto-hide={autoHide}
  class:svelte-three__dom--hidden={autoHide && !inview}
  class:svelte-three__dom--disable-pointer-events={!pointerEvents}
  style="transform:translate({position.x}px, {position.y}px);">
  <slot></slot>
</div>

<style>
  .svelte-three__dom {
    position:absolute;
    top:0;
    left:0;
  }
  .svelte-three__dom--auto-hide {
    transition: opacity .2s;
  }
  .svelte-three__dom--hidden {
    opacity:0;
  }
  .svelte-three__dom--disable-pointer-events {
    pointer-events:none;
  }
</style>

<script context="module">
  import { THREE } from './three-version'
  import { createEventDispatcher, getContext, onMount } from 'svelte'
</script>

<script>

  export let autoHide = true
  export let pointerEvents = true
  export let inview = false
  export let position = {
    x: 0,
    y: 0
  }

  const parent = getContext('three_parent')
  const getCamera = getContext('three_getCamera')
  const getRenderer = getContext('three_getRenderer')
  const addAnimationLoop = getContext('three_addAnimationLoop')
  const removeAnimationLoop = getContext('three_removeAnimationLoop')
  const getFrustum = getContext('three_getFrustum')

  const dispatch = createEventDispatcher();
  $: {
    if (inview === true) {
      dispatch('enterViewport')
    } else {
      dispatch('exitViewport')
    }
  }
  let vector = new $THREE.Vector3()

  const updatePosition = () => {
    vector = parent.getWorldPosition(vector)
    inview = getFrustum().containsPoint(vector)
    vector.project(getCamera())
    position.x = (0.5 + vector.x / 2) * getRenderer().domElement.width
    position.y = (0.5 - vector.y / 2) * getRenderer().domElement.height

  }

  onMount(() => {
    addAnimationLoop(updatePosition)
    return () => removeAnimationLoop(updatePosition)
  })

</script>