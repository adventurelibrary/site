<template>
	<div>
		<h1>Login</h1>
		<LoginForm
			@success="onSuccess"
			@register="register"
		/>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component} from "nuxt-property-decorator";
import Login from "~/components/LoginForm.vue";
@Component({
	components: {
		Login: Login
	}
})
export default class LoginPage extends Vue {
	onSuccess () {
		this.$router.push({
			// name: 'index'
			name: this.$store.state.userTracking.activePath  //redirect to last known path before pressing Login
		})
	}

	register () {
		this.$router.push({
			name: 'register'
		})
	}
}
</script>
