<template>
  <div class="col-full push-top">
    <h1>
      Editing: <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />
  </div>
  
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
export default {
    components: {
      ThreadEditor,
    },
    props: {
        id: {type: String, required: true},
    },
    computed: {
        thread() {
            return this.forumStore.forumData.threads.find(thread => thread.id === this.id);
        },
        text() {
            return this.forumStore.forumData.posts.find(
                post => post.id === this.thread.posts[0]
            ).text
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
}
</script>

<style scoped>

</style>