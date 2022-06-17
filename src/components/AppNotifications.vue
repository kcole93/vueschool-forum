<template>
    <div>
        <div class="notifications" v-for="notification in notifications" :key="notification.id">
            {{ notification.message }}
        </div>
    </div>
</template>


<script>
import useNotifications from "@/composables/useNotifications";
export default {
    setup () {
        const { notifications } = useNotifications()
        return { notifications }
    }
}
</script>
