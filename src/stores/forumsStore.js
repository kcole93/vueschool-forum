import { defineStore } from 'pinia'
import { makeAppendChildToParent } from '@/helpers'

import { useRootStore } from './rootStore';

const rootStore = useRootStore();

export const useForumsStore = defineStore("forumsStore", {
    state: () => {
        return {
            items:[]
        }
    },
    getters: {},
    actions: {
        fetchForum(id) {
            return rootStore.fetchItem({
                resource: 'forums',
                id,
                emoji: '🗒 Forum '
            })
        },
        fetchForums({ ids }) {
            return rootStore.fetchItems({
                resource: 'forums',
                ids: ids,
                emoji: '🗒 Forums '
            })
        },
    },
    appendThreadToForum: makeAppendChildToParent({
        parent: 'forums',
        child: 'threads'
    }),
})