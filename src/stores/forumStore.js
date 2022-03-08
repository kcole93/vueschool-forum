import { defineStore } from 'pinia';
import sourceData from '@/data.json';
import { findById, upsert } from '@/helpers';

export const useForumStore = defineStore("forumStore", {
    state: () => {
        return {
            forumData: sourceData,
            authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
        }
    },
    getters: {
        authUser: (state) => {
            return state.user(state.authId);
        },
        user: (state) => {
            return (id) => {
                const user = findById(state.forumData.users, id);
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
                    },
                    get threadsCount () {
                        return this.threads.length;
                    },
                }
            }         
        },
        thread: (state) => {
            
            return (id) => {
                const thread = findById(state.forumData.threads, id)
                return {
                    ...thread,
                    get author () {
                        return findById(state.forumData.users, thread.userId);
                    },
                    get repliesCount () {
                        return thread.posts.length - 1
                    },
                    get contributorsCount () {
                        return thread.contributors.length
                    }
                }
            }
        }
    },
    actions: {
        createPost(post) {
            post.id = this.createId();
            post.userId = this.authId;
            post.publishedAt = Math.floor(Date.now() / 1000),
            upsert(this.forumData.posts, post); // set the post
            this.appendPostToThread(this.$state, { parentId: post.threadId, childId: post.id })
            this.appendContributorToThread(this.$state, { parentId: post.threadId, childId: this.$state.authId })
        },
        createId() {
            return "gggg" + Math.random();
        },
        appendPostToThread: makeAppendChildToParent({ parent: 'threads', child: 'posts' }),
        appendThreadToForum: makeAppendChildToParent({ parent: 'forums', child: 'threads' }),
        appendThreadToUser: makeAppendChildToParent({ parent: 'users', child: 'threads' }),
        appendContributorToThread: makeAppendChildToParent({ parent: 'threads', child: 'contributors' }),
        async createThread({text, title, forumId}) {
            const id = this.createId();
            const publishedAt = Math.floor(Date.now() / 1000);
            const userId = this.authId
            const thread = { forumId, title, publishedAt, userId, id }
            upsert(this.forumData.threads, thread) // set thread
            this.appendThreadToForum(this.$state, { parentId: forumId, childId: id })
            this.appendThreadToUser(this.$state, { parentId: userId, childId: id })
            const post = {text: text, threadId: id}
            this.createPost(post)
            return findById(this.forumData.threads, id);
        },
        async updateThread({ text, title, id }){
            const thread = findById(this.forumData.threads, id);
            const post = findById(this.forumData.posts, thread.posts[0]);
            const newThread = {...thread, title }
            const newPost = {...post, text }
            upsert(this.forumData.threads, newThread)
            upsert(this.forumData.posts, newPost)
            return newThread;
        },
        updateUser(user, userId){
            const userIndex = this.forumData.users.findIndex(user => user.id === userId);
            this.forumData.users[userIndex] = user;
        }
    }
})


// Implementation Functions
function makeAppendChildToParent ({ parent, child }) {
    return (state, { childId, parentId }) => {
        const resource = findById(state.forumData[parent], parentId)
            resource[child] = resource[child] || []
            if(!resource[child].includes(childId)){
                resource[child].push(childId)
            }
    }
  }