<template>
	<div>
		This page will show your account info.
		<br />Username: {{user.username}}
	</div>
</template>
<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"

@Component({
	middleware: ['require_auth']
})
export default class AccountIndex extends Vue {
	@State('user') user : User
}
</script>
