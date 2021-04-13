<template>
	<form class="login-form" @submit="submit">
		<FormErrors :error="form.error" />
		<InputGroup
				label="Username or Email"
				:value="identifier"
				@input="(val) => identifier = val"
		/>
		<InputGroup
				label="Password"
				type="password"
				:value="password"
				@input="(val) => password = val"
		/>
		<section class="control-row register-hints">
			<div class="registration-hint">Don't have an account?</div>
			<a class="register" @click="openSignUp">Register</a>
		</section>
		<section class="control-row login-controls">
			<button class="login-button">Login to Account</button>
			<nuxt-link class="password-reset" :to="{name: 'forgot-password'}">Forgot Password</nuxt-link>
		</section>
	</form>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import {signIn} from "~/lib/auth/auth-api";
import InputGroup from "~/components/forms/InputGroup.vue";
import FormErrors from "~/components/forms/FormErrors.vue";

@Component({
	components: {
		InputGroup: InputGroup,
		FormErrors: FormErrors
	}
})
export default class LoginForm extends mixins(FormMixin) {
	identifier = ''
	password = ''

	validateForm () : string {
		if (this.identifier == '') {
			return 'Username is required'
		}
		return ''
	}

	async formAction () {
		await signIn(this.identifier, this.password)
		await this.$store.dispatch('fetchSession')
		this.$emit('success')
	}
}
</script>
