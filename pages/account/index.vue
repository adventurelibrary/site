<template>
	<div>
		<div v-if="user">
			This page will show your account info.
			<br />Username: {{user.username}}
			<nuxt-link :to="{name: 'account-change-password'}">Change Password</nuxt-link>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"

@Component({
	middleware: ['require_auth']
})
export default class ChangePassword extends Vue {
	@State('user') user : User

}
</script>
