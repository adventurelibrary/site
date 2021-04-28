<template>
	<div>
		<h1>Login</h1>
		<div>go to {{redirectPath}}</div>
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
	get redirectPath () : string {
		return this.$route.query.redirect
	}

	onSuccess () {
		console.log('this.redirectPath', this.redirectPath)
		if (this.redirectPath && this.redirectPath.length) {
			this.$router.push(this.redirectPath)
		}
	}

	register () {
		this.$router.push({
			name: 'register'
		})
	}
}
</script>
