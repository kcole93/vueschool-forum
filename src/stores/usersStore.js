import { defineStore } from 'pinia';
import firebase from 'firebase';
import { docToResource, makeAppendChildToParent, findById } from '@/helpers';
import { useRootStore } from './rootStore';
import { usePostsStore } from './postsStore';
import { useThreadsStore } from './threadsStore';

const rootStore = useRootStore();
const threadsStore = useThreadsStore();

export const useUsersStore = defineStore("usersStore", {
    state: () => {
        return {
            items:[]
        }
    },
    getters: {
        user: (state) => {
            return (id) => {
                const user = findById(state.items, id);
                if (!user) return null
                return {
                    ...user,
                    get posts() {
                        return usePostsStore.items.filter(post => post.userId === user.id);
                    },
                    get postsCount() {
                        return user.postsCount || 0
                    },
                    get postsSorted() {
                        return [...this.posts].sort((a, b) => b.publishedAt - a.publishedAt);
                    },
                    get threads() {
                        return threadsStore.items.filter(thread => thread.userId === user.id);
                    },
                    get threadsCount() {
                        return user.threads?.length || 0
                    },
                }
            }
        },
    },
    actions: {
        async createUser({
            id,
            email,
            name,
            username,
            avatar = null
        }) {
            const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
            const usernameLower = username.toLowerCase()
            email = email.toLowerCase()

            const user = {
                avatar,
                email,
                name,
                username,
                usernameLower,
                registeredAt
            }

            const userRef = await firebase.firestore().collection('users').doc(id)
            userRef.set(user)

            const newUser = await userRef.get()
            rootStore.setItem({
                resource: 'users',
                item: newUser
            })
            return docToResource(newUser)
        },
        async updateUser(user) {

            const updates = {
                avatar: user.avatar || null,
                username: user.username || null,
                name: user.name || null,
                bio: user.bio || null,
                website: user.website || null,
                email: user.email || null,
                location: user.location || null
            }
            const userRef = firebase.firestore().collection('users').doc(user.id)
            await userRef.update(updates)
        },
        fetchUser(id) {
            return rootStore.fetchItem({
                resource: 'users',
                id,
                emoji: '👱 User '
            })
        },
        fetchUsers({
            ids
        }) {
            return rootStore.fetchItems({
                resource: 'users',
                ids: ids,
                emoji: '👱 Users '
            })
        },
        appendThreadToUser: makeAppendChildToParent({
            parent: 'users',
            child: 'threads'
        }),
    }
})