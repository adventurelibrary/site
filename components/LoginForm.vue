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
			<a class="register" @click="register">Register</a>
		</section>
		<section class="control-row login-controls">
			<SubmitButton classes="login-button" :submitting="form.submitting" idle-text="Login to Account" />
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
import SubmitButton from "~/components/forms/SubmitButton.vue";

@Component({
	components: {
		InputGroup: InputGroup,
		FormErrors: FormErrors,
		SubmitButton: SubmitButton
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

	register () {
		this.$emit('register')
	}

	async formAction () {
		await signIn(this.identifier, this.password)
		await this.$store.dispatch('fetchSession')
		this.$emit('success')
	}
}
</script>
