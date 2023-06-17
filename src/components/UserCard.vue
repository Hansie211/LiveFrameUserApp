<template>
    <div style="display: flex; flex-direction: row; align-items: center; padding: 2px 4px 2px 2px; background-color: white; border-radius: 40px">
        <img id="thumbnail" :src="avatarSrc" referrerpolicy="no-referrer" fit="fill" alt="Avatar" :title="user.email ?? 'Avatar'" />
        <div class="text-primary" id="name">{{ user.displayName }}</div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { User } from 'firebase/auth';
import Avatar from 'avatar-initials';

export default defineComponent({
    name: 'UserCard',
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        },
    },
    data() {
        const avatarSrc =
            this.user.photoURL ??
            Avatar.initialAvatar({
                initials: (this.user.email ? this.user.email.charAt(0) : '?').toUpperCase(),
                color: 'white',
                background: '#ff1a1a',
                size: 38,
                fontWeight: 400,
                fontFamily: '"Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 0,
            });

        return {
            avatarSrc: avatarSrc,
        };
    },
});
</script>

<style scoped>
#thumbnail {
    width: 38px;
    margin-right: 6px;
    border-radius: 38px;
}
</style>
