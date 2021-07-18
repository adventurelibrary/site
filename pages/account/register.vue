<template>
	<article>
		<h1>Register</h1>
		<RegisterForm
			@login="login"
		/>
	</article>
</template>
<script lang="ts">
import Vue from "vue"
import {Component} from "nuxt-property-decorator";
import Register from "~/components/RegisterForm.vue";
@Component({
	components: {
		Register: Register
	}
})
export default class RegisterPage extends Vue {
	login () {
		this.$router.push({
			name: 'login'
		})
	}
}
</script>
