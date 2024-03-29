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
import {signUp, checkEmailInUse, checkUsernameInUse, checkRegisterValidate} from "~/lib/auth/auth-api";
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
			return 'Username is required.'
		}
		if (this.password == '') {
			return 'Password is required.'
		}
		if (this.passwordConfirm !== this.password) {
			return 'Passwords do not match.'
		}
		return ''
	}

	login () {
		this.$emit('login')
	}

	async formAction () {
		const data = {
			email: this.email,
			password: this.password,
			passwordConfirm: this.passwordConfirm,
			username: this.username
		}

		// verify username not in use before signup
		let registerValidate: JSON
		registerValidate = await checkRegisterValidate(this.email, this.username)

		try {
			if (registerValidate.details != null) {
				let errorList : []
				errorList = registerValidate.details
				let errorMessage = ''

				// post error notifications and form error throwing message
				errorList.forEach(error => {
					errorMessage = errorMessage + error.message
					this.$store.dispatch('notifyError', error.message)
				});

				// throw error if any
				if (errorMessage.length > 0) {
					throw new Error(errorMessage)
				}
			}


			// attempt to register new user if new email and username
			// this will only execute if neither the email or username already exists in the db
			await this.$store.dispatch('signUp', data)
			this.needsConfirmation = true
			this.$emit('success')
			this.$gtag.event('sign_up');
		}
		catch (e) {
			console.log('Error occured while attempting to register new user. ' + e)
		}

	}

}
</script>
