<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing: <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />
  </div>
  
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue';
import { findById } from '@/helpers';
export default {
    components: {
      ThreadEditor,
    },
    props: {
        id: {type: String, required: true},
    },
    computed: {
        thread() {
            return findById(this.forumStore.forumData.threads, this.id)
        },
        text() {
            const post = findById(this.forumStore.forumData.posts, this.thread.posts[0])
            return post? post.text : ''
        },
    },
    methods: {
        async save ({ title, text}) {
           const thread = await this.forumStore.updateThread({
                id: this.id,
                title,
                text
        })
        this.$router.push({name: 'ThreadShow', params: { id: thread.id }});
    },
    cancel () {
        this.$router.push({name: 'ThreadShow', params: { id: this.id }});
    }
},
async created () {
  const thread = await this.forumStore.fetchThread(this.id);
  this.forumStore.fetchPost(thread.posts[0])
}
}
</script>

<style scoped>

</style>