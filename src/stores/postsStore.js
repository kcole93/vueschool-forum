import { defineStore } from 'pinia';
import firebase from 'firebase';
import { useRootStore } from './rootStore';
import { useAuthStore } from './authStore';
import { useThreadsStore } from './threadsStore';

const authStore = useAuthStore();
const rootStore = useRootStore();
const threadsStore = useThreadsStore();

export const usePostsStore = defineStore("postsStore", {
    state: () => {
        return {
            items:[]
        }
    },
    getters: {},
    actions: {
        async createPost(post) {
            post.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
            post.userId = authStore.authId

            // Create batch and commit to firestore
            const batch = firebase.firestore().batch()
            const postRef = firebase.firestore().collection('posts').doc()
            const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
            const userRef = firebase.firestore().collection('users').doc(authStore.authId)
            batch.set(postRef, post)

            batch.update(threadRef, {
                posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
                contributors: firebase.firestore.FieldValue.arrayUnion(authStore.authId)
            })
            batch.update(userRef, {
                postsCount: firebase.firestore.FieldValue.increment(1)
            })

            await batch.commit()

            // Commit to Pinia Store
            const newPost = await postRef.get()
            rootStore.setItem({
                resource: 'posts',
                item: {
                    ...newPost.data(),
                    id: newPost.id
                }
            }); // set the post
            rootStore.appendPostToThread(threadsStore.items, {
                parentId: post.threadId,
                childId: newPost.id
            })
            rootStore.appendContributorToThread(threadsStore.items, {
                parentId: newPost.threadId,
                childId: authStore.authId
            })
        },
        async updatePost(text, id) {
            const post = {
                text,
                edited: {
                    at: firebase.firestore.FieldValue.serverTimestamp(),
                    by: authStore.authId,
                    moderated: false
                }
            }

            const postRef = firebase.firestore().collection('posts').doc(id)
            await postRef.update(post)
            const updatedPost = await postRef.get()
            rootStore.setItem({
                resource: 'posts',
                item: updatedPost
            })
        },
        fetchPost(id) {
            return rootStore.fetchItem({
                resource: 'posts',
                id,
                emoji: 'Post '
            });
        },
        fetchPosts({
            ids
        }) {
            return rootStore.fetchItems({
                resource: 'posts',
                ids: ids,
                emoji: 'Posts '
            })
        },
    }
})