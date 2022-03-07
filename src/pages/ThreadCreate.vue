<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
  
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
export default {
    components: {
      ThreadEditor,
    },
    props: {
        forumId: {type: String, required: true},
    },
    computed: {
        forum() {
            return this.forumStore.forumData.forums.find(forum => forum.id === this.forumId);
        }
    },
    methods: {
        async save ({ title, text}) {
           const thread = await this.forumStore.createThread({
                forumId: this.forumId,
                title,
                text
        });
        this.$router.push({name: 'ThreadShow', params: { id: thread.id }});
    },
    cancel () {
        this.$router.push({name: 'ForumShow', params: { id: this.forumId }});
    }
},
}
</script>

<style scoped>

</style>