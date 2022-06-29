import { defineStore } from 'pinia';
import firebase from 'firebase';
import { useRootStore } from './rootStore';

const rootStore = useRootStore();

export const useCategoriesStore = defineStore("categoriesStore", {
    state: () => {
        return {
            items:[]
        }
    },
    getters: {},
    actions: {
        fetchCategory(id) {
            return rootStore.fetchItem({
                resource: 'categories',
                id,
                emoji: '🐈 Category '
            })
        },
        fetchCategories({ ids }) {
            return rootStore.fetchItems({
                resource: 'categories',
                ids: ids,
                emoji: '🐈 Categories '
            })
        },
        fetchAllCategories() {
            return new Promise((resolve) => {
                const unsubscribe = firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
                    const categories = querySnapshot.docs.map(doc => {
                        const item = {
                            id: doc.id,
                            ...doc.data()
                        }
                        rootStore.setItem({
                            resource: 'categories',
                            item: item
                        })
                        return item
                    })
                    resolve(categories)
                })

                this.appendUnsubscribe(unsubscribe)
            })
        },
    }
})