let currentObject
let objectType = 'three'

export const setCurrentObject = newCurrentObject => 
  currentObject = newCurrentObject

export const getCurrentObject = function(args) {
  if (objectType === 'three') {
    return Array.isArray(args)
      ? new currentObject(...args)
      : new currentObject(args)
  }
  else if (objectType === 'custom') {
    return Array.isArray(args)
      ? currentObject(...args)
      : currentObject(args)
  }
}

export const setObjectType = newObjectType => 
  objectType = newObjectType

export const getObjectType = () => objectType