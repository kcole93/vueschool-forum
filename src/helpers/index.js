// Find a given resource by the provided id
export const findById = (resources, id) =>
  resources.find(r => r.id === id)


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