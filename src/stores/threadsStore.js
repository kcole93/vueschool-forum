import { defineStore } from 'pinia';
import firebase from 'firebase';
import { findById, docToResource, makeAppendChildToParent } from '@/helpers';
import { useRootStore } from './rootStore';
import { useAuthStore } from './authStore';
import { usePostsStore } from './postsStore';
import { useForumsStore } from './forumsStore';
import { useUsersStore } from './usersStore';
import chunk from 'lodash/chunk';

const authStore = useAuthStore();
const rootStore = useRootStore();
const postsStore = usePostsStore();
const forumsStore = useForumsStore();
const usersStore = useUsersStore();

export const useThreadsStore = defineStore("threadsStore", {
    state: () => {
        return {
            items:[]
        }
    },
    getters: {
        thread: state => {

            return (id) => {
                const thread = findById(state.items, id)
                if (!thread) return {}
                return {
                    ...thread,
                    get author() {
                        return thread ? findById(usersStore.users, thread.userId) : []
                    },
                    get repliesCount() {
                        return thread ? thread.posts.length - 1 : 0
                    },
                    get contributorsCount() {
                        return thread ? thread.contributors.length : 0
                    }
                }
            }
        }
    },
    actions:{
        async createThread({
            text,
            title,
            forumId
        }) {
            const publishedAt = firebase.firestore.FieldValue.serverTimestamp();
            const userId = authStore.authId
            const threadRef = firebase.firestore().collection('threads').doc()
            const thread = {
                forumId,
                title,
                publishedAt,
                userId,
                id: threadRef.id
            }

            const userRef = firebase.firestore().collection('users').doc(userId)
            const forumRef = firebase.firestore().collection('forums').doc(forumId)
            const batch = firebase.firestore().batch()

            batch.set(threadRef, thread)

            batch.update(userRef, {
                threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
            })
            batch.update(forumRef, {
                threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
            })

            await batch.commit()
            const newThread = await threadRef.get()

            rootStore.setItem({
                resource: 'threads',
                item: {
                    ...newThread.data(),
                    id: newThread.id
                }
            }) // set thread
            rootStore.appendThreadToForum(forumsStore, {
                parentId: forumId,
                childId: threadRef.id
            })
            this.appendThreadToUser(usersStore, {
                parentId: userId,
                childId: threadRef.id
            })
            const post = {
                text: text,
                threadId: threadRef.id
            }
            await postsStore.createPost(post)
            return findById(this.$state.items, threadRef.id)

        },
        async updateThread({
            text,
            title,
            id
        }) {
            const thread = findById(this.$state.items, id);
            const post = findById(postsStore.items, thread.posts[0]);
            let newThread = {
                ...thread,
                title
            }
            let newPost = {
                ...post,
                text
            }

            const threadRef = firebase.firestore().collection('threads').doc(id)
            const postRef = firebase.firestore().collection('posts').doc(post.id)
            const batch = firebase.firestore().batch()

            batch.update(threadRef, newThread)
            batch.update(postRef, newPost)
            await batch.commit()

            newThread = await threadRef.get()
            newPost = await postRef.get()

            rootStore.setItem({
                resource: 'threads',
                item: newThread
            })
            rootStore.setItem({
                resource: 'posts',
                item: newPost
            })
            return docToResource(newThread);
        },
        fetchThread({id}) {
            return rootStore.fetchItem({
                resource: 'threads',
                id,
                emoji: '🧵 Thread '
            })
        },
        fetchThreads({
            ids
        }) {
            return rootStore.fetchItems({
                resource: 'threads',
                ids: ids,
                emoji: '🧵 Threads '
            })
        },
        fetchThreadsByPage({ ids, page, perPage = 10 }){
            this.clearThreads();
            const chunks = chunk(ids, perPage)
            const limitedIds = chunks[page -1]
            return this.fetchThreads({ ids: limitedIds })
        },
        appendPostToThread: makeAppendChildToParent({
            parent: 'threads',
            child: 'posts'
        }),
        appendContributorToThread: makeAppendChildToParent({
            parent: 'threads',
            child: 'contributors'
        }),
    }
})