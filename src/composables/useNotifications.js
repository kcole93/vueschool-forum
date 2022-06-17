import { reactive } from 'vue'
const notifications = reactive([
    {
        id: 1,
        message: "Message 1"
    },
    {
        id: 2,
        message: "Message 2"
    }
]);

export default function useNotifications () {
    return {
        notifications
    }
}