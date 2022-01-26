
export const isFunction = value => value instanceof Function //typeof value === 'function'
export const isUndefined = value => value === undefined //typeof value === 'undefined'
export const isKebabCaseString = string => string.indexOf('-') !== -1 //string.search(/-/g) !== -1
export const hasSetMethod = value => value && isFunction(value.set)

export const isCamera = object => object.type && `${object.type}`.endsWith('Camera')

export const dispose = object => {
  if (object && isFunction(object.dispose)) {
    object.dispose()
  }
}

const rendererDeclaredProps = ['args', 'camera', 'onTick', 'ref', 'scene']
const threeDeclaredProps = ['args', 'attach', 'onTick', 'ref', 'useCannon', 'useEvents']

const isForeignProp = declaredProps => prop =>
    !declaredProps.some(declaredProp => declaredProp === prop)

export const isForeignRendererProp = isForeignProp(rendererDeclaredProps)
export const isForeignThreeProp = isForeignProp(threeDeclaredProps)

export const resolvePath = function(path, obj, separator = '-') {
  const properties = Array.isArray(path) ? path : path.split(separator)
  if (properties.length === 1)
    return obj[properties[0]]
  return properties.reduce((prev, curr) => {
    return prev && prev[curr]
  }, obj)
}

// _object: THREE.js object
// _prop: "rotation.y" or "some.other.nested.path"
export const getObjectAndProp = (_object, _prop) => {
  const pathArray = _prop.split('-')
  let getterProp = _prop
  let setterProp = _prop
  let getter = _object
  let setter = _object
  if (pathArray.length === 1) {
    getterProp = setterProp = pathArray[0]
    getter = setter = _object
  } else {
    getterProp = setterProp = pathArray.pop()
    const objectPath = pathArray.join('-')
    getter = setter = resolvePath(objectPath, _object)
  }
  if (hasSetMethod(getter[getterProp])) {
    setter = getter[getterProp]
    setterProp = 'set'
  }
  return [getter, getterProp, setter, setterProp]
}

// _object: THREE.js object
// _prop: "rotation.y" or "some.other.nested.path"
// value: yeah, you guessed it, it's a value you want to set!
export const setObjectProp = (_object, _prop, _value) => {
  let object = _object
  let prop = _prop
  let value = _value

  // prepare object and prop
  if (isKebabCaseString(prop)) {
    let path = prop.split('-')
    prop = path.pop()
    path = path.join('-')
    object = resolvePath(path, _object)
    if (isUndefined(object)) {
      return console.warn(`${path} is undefined`)
    }
  }
  if (hasSetMethod(object[prop])) {
    object = object[prop]
    prop = 'set'
  }
  
  // set
  if (isFunction(object[prop])) {
    if (Array.isArray(value)) {
      object[prop](...value)
    } else {
      object[prop](value)
    }
  } else {
    object[prop] = value
  }
}

export const isOnTickProp = propString => propString.indexOf('onTick:') === 0
export const registerOnTickProp = (
  threeObject,
  _propString,
  getProps,
  onTickProps,
  onMount,
  addAnimationLoop,
  removeAnimationLoop
) => {
  onTickProps[_propString] = true
  const propString = _propString.replace('onTick:', '')
  const [ getter, getterProp, setter, setterProp ] = getObjectAndProp(threeObject, propString)
  const loop = (delta, deltaTime, timeSec) => {
    const onTick = getProps()[_propString]
    const value = isFunction(onTick)
      ? onTick(getter[getterProp], threeObject, delta, deltaTime, timeSec)
      : onTick
    if (isFunction(setter[setterProp])) {
      if (Array.isArray(value)) {
        setter[setterProp](...value)
      } else {
        setter[setterProp](value)
      }
    } else {
      setter[setterProp] = value
    }
  }
  onMount(() => {
    addAnimationLoop(loop)
    return () => {
      delete onTickProps[_propString]
      removeAnimationLoop(loop)}
  })
}

export const updateFromProps = (
  getProps,
  isForeignProp,
  onTickProps,
  threeObject,
  onMount,
  addAnimationLoop,
  removeAnimationLoop
) => {
  for (let prop in getProps()) {
    if (isForeignProp(prop)) {
      const onTickProp = isOnTickProp(prop)
      if (!onTickProps[prop] && onTickProp) {
        registerOnTickProp(threeObject, prop, getProps, onTickProps, onMount, addAnimationLoop, removeAnimationLoop)
      } else {
        if (!onTickProp) {
          setObjectProp(threeObject, prop, getProps()[prop])
        }
      }
    }
  }
}