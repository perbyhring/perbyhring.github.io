<slot />

<script context="module">

  import { onMount, setContext, getContext, createEventDispatcher } from 'svelte'
  import { getCurrentObject } from './object'
  import { getAttachMethod } from './attach'
  import { attachEvents } from './events'
  import {
    isFunction,
    setObjectProp,
    updateFromProps,
    isForeignThreeProp,
    isCamera,
    dispose
  } from './utils'

</script>

<script>

  const parent = getContext('three_parent')
  const addAnimationLoop = getContext('three_addAnimationLoop')
  const removeAnimationLoop = getContext('three_removeAnimationLoop')

  export let args = []
  export let onTick = null
  export let useCannon = null
  export let useEvents = false
  export const ref = getCurrentObject(args)
  export let attach = getAttachMethod(ref, parent)

  const threeObject = ref

  setContext('three_parent', threeObject)
  if (threeObject.isScene) {
    getContext('three_setNewestScene')(threeObject)
  }
  if (isCamera(threeObject)) {
    getContext('three_setNewestCamera')(threeObject)
  }

  const loop = isFunction(onTick)
    ? (delta, deltaTime, time) => onTick(threeObject, delta, deltaTime, time)
    : null

  onMount(() => {
    let detach
    if (isFunction(attach)) {
      detach = attach(threeObject, parent)
    } else {
      setObjectProp(parent, attach, threeObject)
    }
    addAnimationLoop(loop)

    return () => {
      if (isFunction(attach)) {
        if (isFunction(detach)) {
          detach(threeObject, parent)
        }
      } else {
        setObjectProp(parent, attach, null)
      }
      removeAnimationLoop(loop)
      dispose(threeObject)
    }
  })

  if (useEvents) {
    const eventsConfig = {
      domElement: getContext('three_getRenderer')().domElement,
      rayCaster: getContext('three_getRaycaster'),
      dispatch: createEventDispatcher(),
      threeObject: threeObject
    }
    onMount(() => attachEvents(eventsConfig))
  }

  const onTickProps = {}
  $: updateFromProps(
    () => $$props,
    isForeignThreeProp,
    onTickProps,
    threeObject,
    onMount,
    addAnimationLoop,
    removeAnimationLoop
  )

  // CANNON INTEGRATION
  // const getCannonParentBody = getContext('cannon_getParentBody')
  // const useCannonAnimationLoop = delta => {
  //   const cannonParent = getCannonParentBody()
  //   if (cannonParent) {
  //     threeObject.position.copy(cannonParent.position)
  //     threeObject.quaternion.copy(cannonParent.quaternion)
  //   }
  // }
  // let cannonIsActive = false
  // $: {
  //   if (useCannon && addAnimationLoop) {
  //     cannonIsActive = true
  //     addAnimationLoop(useCannonAnimationLoop)
  //   }
  //   if (!useCannon && cannonIsActive && removeAnimationLoop) {
  //     cannonIsActive = false
  //     removeAnimationLoop(useCannonAnimationLoop)
  //   }
  // }
  
</script>