// TODO: Split forumStore into nested stores: https://pinia.vuejs.org/cookbook/migration-vuex.html#restructuring-modules-to-stores
import {
    defineStore
} from 'pinia';
import {
    findById,
    upsert,
    docToResource
} from '@/helpers';
import firebase from 'firebase';

export const useRootStore = defineStore("rootStore", {
    state: () => {
        return {
            unsubscribes: [],
        }
    },
    getters: {},
    actions: {
        // Fetch Multiple Resources
        fetchItems({
            ids,
            resource,
            emoji,
            onSnapshot = null
        }) {
            return Promise.all(ids.map(id =>
                this.fetchItem({
                    resource,
                    id,
                    emoji,
                    onSnapshot
                })
            ))
        },
        // Fetch Single Resource
        fetchItem ({ id, emoji, resource, handleUnsubscribe = null, once = false, onSnapshot = null }) {
            console.log('🔥', emoji, id)
            return new Promise((resolve) => {
              const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
                if (once) unsubscribe()
                if (doc.exists) {
                  const item = { ...doc.data(), id: doc.id }
                  let previousItem = findById(this.forumData[resource], id)
                  previousItem = previousItem ? { ...previousItem } : null
                  this.setItem({ resource, item })
                  if (typeof onSnapshot === 'function') {
                    const isLocal = doc.metadata.hasPendingWrites
                    onSnapshot({ item: { ...item }, previousItem, isLocal })
                  }
                  resolve(item)
                } else {
                  resolve(null)
                }
              })
              if (handleUnsubscribe) {
                handleUnsubscribe(unsubscribe)
              } else {
                this.appendUnsubscribe(unsubscribe)
              }
            })
          },
          unsubscribeAllSnapshots(){
            this.unsubscribes.forEach(unsubscribe => unsubscribe())
          },
        setItem(state, {
            resource,
            item
        }) {
            upsert(state[resource].items, docToResource(item))
        },
        appendUnsubscribe (unsubscribe) {
            this.$state.unsubscribes.push(unsubscribe)
        },
        clearAllUnsubscribes() {
            this.$state.unsubscribes = [];
        }
    }
})