// Find a given resource by the provided id
export const findById = (resources, id) => {
  if(!resources) return null  
  return resources.find(r => r.id === id)
}

// upsert commits the fully-formed resource object to the store.
// If the resource already exists within the resources array, then the entry is updated with new values.
export const upsert = (resources, resource) => {
  const index = resources.findIndex(r => r.id === resource.id)
            if (resource.id && index !== -1) {
                resources[index] = resource
            }else {
                resources.push(resource) // Otherwise, a new post object is passed to the resource array.
            }
}

export const docToResource = (doc) => {
  if (typeof doc?.data !== 'function') return doc
  return {...doc.data(), id: doc.id }
}

export const makeAppendChildToParent = ({
  parent,
  child
}) => {
  return (state, {
      childId,
      parentId
  }) => {
      const resource = findById(state.items, parentId)
      if (!resource) {
          console.warn(`Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist.`)
          return
      }
      resource[child] = resource[child] || []
      if (!resource[child].includes(childId)) {
          resource[child].push(childId)
      }
  }
}