<template>
	<div>
		<h1>Login</h1>
		<fragment v-if="!isLoggedIn">
			<LoginForm
				@success="onSuccess"
				@register="register"
			/>
			<div v-if="redirectPath">You will be redirected to <nuxt-link :to="redirectPath"><code>{{redirectPath}}</code></nuxt-link></div>
		</fragment>
		<div v-else>
			You are already logged in.
			<div v-if="redirectPath"><nuxt-link :to="redirectPath">Go to <code>{{redirectPath}}</code></nuxt-link></div>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Getter} from "nuxt-property-decorator";
import Login from "~/components/LoginForm.vue";
@Component({
	components: {
		Login: Login
	}
})
export default class LoginPage extends Vue {
	@Getter('isLoggedIn') isLoggedIn : boolean

	get redirectPath () : string {
		if (typeof this.$route.query.redirect == 'string') {
			return this.$route.query.redirect
		}
		return ''
	}

	onSuccess () {
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
