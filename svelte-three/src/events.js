const eventsWithSharedListener = [
  'dblclick',
  'wheel',
  'pointerup',
  'pointerdown',
]

const createIntersection = (rayCaster, threeObject) => ({
  current: null,
  previous: null,
  update() {
    this.previous = this.current
    this.current = rayCaster.intersectObject(threeObject)[0]
  }
})

const createPointerState = intersection => ({
  current: 'outside-object',
  states: {
    'outside-object': () => !intersection.previous && !intersection.current,
    'entered-object': () => !intersection.previous && intersection.current,
    'inside-object': () => intersection.previous && intersection.current,
    'left-object': () => intersection.previous && !intersection.current
  },
  update() {
    for (let state in this.states) {
      const isCurrentState = this.states[state]()
      if (isCurrentState) {
        this.current = state
        break;
      }
    }
  }
})

const createPointermoveEvent = (intersection, pointerState, dispatch) => e => {
  intersection.update()
  pointerState.update()

  const detail = {
    intersection: intersection.current,
    originalEvent: e
  }
  if (pointerState.current === 'entered-object') {
    dispatch('pointerenter', detail)
    dispatch('pointermove', detail)
  }
  else if (pointerState.current === 'inside-object') {
    dispatch('pointermove', detail)
  }
  else if (pointerState.current === 'left-object') {
    dispatch('pointerleave', detail)
  }
}
const createClickEvent = (intersection, dispatch) => e => {
  intersection.update()
  if (intersection.current) {
    dispatch('click', {
      intersection: intersection.current,
      originalEvent: e
    })
  } else {
    dispatch('clickoutside', {
      intersection: intersection.current,
      originalEvent: e
    })
  }
}

const createOtherEvent = (eventName, intersection, dispatch) => e => {
  intersection.update()
  if (intersection.current) {
    dispatch(eventName, {
      intersection: intersection.current,
      originalEvent: e
    })
  }
}

export const attachEvents = ({ domElement, rayCaster, dispatch, threeObject }) => {

  const intersection = createIntersection(rayCaster, threeObject)
  const pointerState = createPointerState(intersection)

  const pointermoveEvent = createPointermoveEvent(intersection, pointerState, dispatch)
  const clickEvent = createClickEvent(intersection, dispatch)

  const otherEvents = eventsWithSharedListener.map(eventName => ({
    eventName: eventName,
    eventListener: createOtherEvent(eventName, intersection, dispatch)
  }))
  
  domElement.addEventListener('pointermove', pointermoveEvent)
  domElement.addEventListener('click', clickEvent)
  otherEvents.forEach(({eventName, eventListener}) => {
    domElement.addEventListener(eventName, eventListener)
  })

  return () => {
    domElement.removeEventListener('pointermove', pointermoveEvent)
    domElement.removeEventListener('click', clickEvent)
    otherEvents.forEach(({eventName, eventListener}) => {
      domElement.removeEventListener(eventName, eventListener)
    })
  }
}