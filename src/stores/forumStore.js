import { defineStore } from 'pinia';
import sourceData from '@/data.json';

export const useForumStore = defineStore("forumStore", {
    state: () => {
        return {
            forumData: sourceData
        }
    },
    getters: {

    },
    actions: {
        createPost(post) {
            post.id = this.createPostId();
            this.forumData.posts.push(post); // set the post
            this.appendPostToThread(post)
        },
        createPostId() {
            return "gggg" + Math.random();
        },
        appendPostToThread(post){
            const thread = this.forumData.threads.find(thread => thread.id === post.threadId)
            thread.posts.push(post.id); // append post to thread
        }
    }
})