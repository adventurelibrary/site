<template>
	<div>
		<div v-if="needsConfirmation">
			Check your email to confirm your registration.
		</div>
		<form class="register-form" v-else @submit="submit">
			<FormErrors :error="form.error" />
			<InputGroup
					label="Email"
					:value="email"
					@input="(val) => email = val"
			/>
			<InputGroup
					label="Username"
					:value="username"
					@input="(val) => username = val"
			/>
			<InputGroup
					label="Password"
					type="password"
					:value="password"
					@input="(val) => password = val"
			/>
			<InputGroup
					label="Confirm Password"
					type="password"
					:value="passwordConfirm"
					@input="(val) => passwordConfirm = val"
			/>
			<section class="control-row">
				<div>Already registered?</div>
				<a @click="login">Login</a>
			</section>
			<button class="account-create">Create Account</button>
		</form>
	</div>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import {signUp, checkEmailInUse, checkUsernameInUse} from "~/lib/auth/auth-api";
import InputGroup from "~/components/forms/InputGroup.vue";
import FormErrors from "~/components/forms/FormErrors.vue";

@Component({
	components: {
		InputGroup: InputGroup,
		FormErrors: FormErrors
	}
})
export default class RegisterForm extends mixins(FormMixin) {
	username = ''
	email = ''
	password = ''
	passwordConfirm = ''
	needsConfirmation = false

	validateForm () : string {
		if (this.username == '') {
			return 'Username is required'
		}
		if (this.password == '') {
			return 'Password is required'
		}
		if (this.passwordConfirm !== this.password) {
			return 'Passwords do not match'
		}
		return ''
	}

	login () {
		this.$emit('login')
	}

	async formAction () {
		console.log('submit register')
		const data = {
			email: this.email,
			password: this.password,
			passwordConfirm: this.passwordConfirm,
			username: this.username
		}

		// verify email not in use before signup
		let emailInUse: boolean = false
		emailInUse = await checkEmailInUse(this.email)

		// verify username not in use before signup
		let usernameInUse: boolean = false
		usernameInUse = await checkUsernameInUse(this.username)

		// notify user of errors
		if (emailInUse == true) {
			this.$store.dispatch('notifyError', 'Email already in use.')
			throw new Error('Email already in use.')
		}
		if (usernameInUse == true) {
			this.$store.dispatch('notifyError', 'Username already in use.')
			throw new Error('Username already in use.')
		}

		// attempt to register new user if new email and username
		// this will only execute if neither the emailInUse or usernameInUse above throw an error
		await signUp(data)
		this.needsConfirmation = true
		this.$emit('success')
		this.$gtag.event('sign_up');
	}

}
</script>
