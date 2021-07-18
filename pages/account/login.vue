<template>
	<article>
		<h1>Login</h1>
		<div>go to {{redirectPath}}</div>
		<LoginForm
			@success="onSuccess"
			@register="register"
		/>
	</article>
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
	get redirectPath () : string {
		if (typeof this.$route.query.redirect == 'string') {
			return this.$route.query.redirect
		}
		return ''
	}

	async onSuccess () {
		await this.$store.dispatch('fetchSession')
		if (this.redirectPath && this.redirectPath.length) {
			this.notifySuccess(`Logged in, redirecting...`)
			this.$router.push({
				path: this.redirectPath
			})
		} else {
			this.notifySuccess(`Logged in`)
			this.$router.replace('/')
		}
	}

	register () {
		this.$router.push({
			name: 'register'
		})
	}
}
</script>
