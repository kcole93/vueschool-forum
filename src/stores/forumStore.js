import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useForumStore = defineStore("forumStore", {
    state: () => {
        return {
            forumData: sourceData,
            authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
        }
    },
    getters: {
        authUser: (state) => {
            const user = state.forumData.users.find(user => user.id === state.authId);
            if (!user) return null
            return {
                ...user,
                get posts () {
                    return state.forumData.posts.filter(post => post.userId === user.id);
                },
                get postsCount () {
                    return this.posts.length
                },
                get postsSorted () {
                    return [...this.posts].sort((a, b) => b.publishedAt - a.publishedAt);
                },        
                get threads () {
                    return state.forumData.threads.filter(thread => thread.userId === user.id);
                }
            }
        }
    },
    actions: {
        createPost(post) {
            post.id = this.createId();
            post.userId = this.authId;
            post.publishedAt = Math.floor(Date.now() / 1000),
            this.setPost(post); // set the post
            this.appendPostToThread({postId: post.id, threadId: post.threadId})
        },
        setPost(post){
            // setPost commits the fully-formed post object to the forumData store.
            // If the post already exists on forumData.posts, then the entry is updated with new values.
            const index = this.forumData.posts.findIndex(p => p.id === post.id)
            if (post.id && index !== -1) {
                this.forumData.posts[index] = post
            }else {
                this.forumData.posts.push(post) // Otherwise, a new post object is passed to the forumData.posts array.
            }
        },
        setThread(thread){
            // setThread commits the fully-formed thread object to the forumData store.
            // If the thread already exists on forumData.threads, then the entry is updated with new values.
            const index = this.forumData.threads.findIndex(t => t.id === thread.id)
            if (thread.id && index !== -1) {
                this.forumData.threads[index] = thread
            }else {
                this.forumData.threads.push(thread) // Otherwise, the new thread object is passed to the forumData.posts array.
            }
        },
        createId() {
            return "gggg" + Math.random();
        },
        appendPostToThread({postId, threadId}){
            const thread = this.forumData.threads.find(thread => thread.id === threadId);
            console.log(thread);
            thread.posts = thread.posts || []
            thread.posts.push(postId); // append post to thread
        },
        appendThreadToForum(forumId, threadId){
            const forum = this.forumData.forums.find(forum => forum.id === forumId);
            forum.threads = forum.threads || []
            forum.threads.push(threadId)
        },
        appendThreadToUser(userId, threadId){
            const user = this.forumData.users.find(user => user.id === userId);
            user.threads = user.threads || []
            user.threads.push(threadId)
        },
        async createThread({text, title, forumId}) {
            const id = this.createId();
            const publishedAt = Math.floor(Date.now() / 1000);
            const userId = this.authId
            const thread = { forumId, title, publishedAt, userId, id }
            this.setThread(thread); // set thread
            this.appendThreadToForum(forumId, id)
            this.appendThreadToUser(userId, id)
            const post = {text: text, threadId: id}
            this.createPost(post)
            return this.forumData.threads.find(thread => thread.id === id);
        },
        async updateThread({ text, title, id }){
            const thread = this.forumData.threads.find(thread => thread.id === id);
            const post = this.forumData.posts.find(post => post.id === thread.posts[0])
            const newThread = {...thread, title }
            const newPost = {...post, text }
            this.setThread(newThread)
            this.setPost (newPost)
            return newThread;
        },
        updateUser(user, userId){
            const userIndex = this.forumData.users.findIndex(user => user.id === userId);
            this.forumData.users[userIndex] = user;
        }
    }
})