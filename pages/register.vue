<template>
	<div>
		<h1>Register</h1>
		<RegisterForm
		/>
		<div>
			Already registered? <nuxt-link :to="{name: 'login'}">Login</nuxt-link>
		</div>
	</div>
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
	onSuccess () {
	}
}
</script>
