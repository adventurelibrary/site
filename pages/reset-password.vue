<template>
	<article>
		<h1>Reset Password</h1>
		<div v-if="!username">
			Username missing from URL.
		</div>
		<div>
			<div>Hello <strong>{{username}}</strong>, please check your email for a <strong>verification code</strong>. Enter it and your new password below.</div>
			<div v-if="done">
				Done! Logging you in.
			</div>
			<form v-else @submit="submit">
				<FormErrors :error="form.error" />
				<InputGroup
					label="Verification Code"
					:value="code"
					@input="(val) => code = val"
				/>
				<InputGroup
					label="New Password"
					:value="password"
					type="password"
					@input="(val) => password = val"
				/>
				<InputGroup
					label="Confirm Password"
					:value="passwordConfirm"
					type="password"
					@input="(val) => passwordConfirm = val"
				/>
				<SubmitButton :submitting="form.submitting"></SubmitButton>
			</form>
		</div>
	</article>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import InputGroup from "~/components/forms/InputGroup.vue";
import SubmitButton from "~/components/forms/SubmitButton.vue";
import FormErrors from "~/components/forms/FormErrors.vue";
import {forgotPasswordSubmit, signIn} from "~/lib/auth/auth-api";

@Component({
	components: {
		InputGroup: InputGroup,
		SubmitButton: SubmitButton,
		FormErrors: FormErrors
	}
})
export default class ResetPassword extends mixins(FormMixin) {
	code = ''
	password = ''
	passwordConfirm = ''
	username = ''
	done = false

	created () {
		this.username = this.$route.query.username || ''
		if (this.$store.getters.isLoggedIn) {
			this.notifySuccess('You are already logged in. Redirecting...')
			this.$router.push('/')
		}
	}

	validateForm(): string {
		if (!this.password) {
			return 'Password is required'
		}

		if (!this.code) {
			return 'Enter in the code'
		}

		if (this.password != this.passwordConfirm) {
			return 'Passwords do not match'
		}

		return ''
	}

	async formAction () {
		// This will update their password
		await forgotPasswordSubmit(this.username, this.code, this.password)
	}

	async formSuccess () {
		this.notifySuccess('Password reset! Logging you in...')

		// This will sign them in and get their JWT
		await signIn(this.username, this.password)

		// This will tell our VueX store to fetch their session info and then update
		// the store with that info. This updates the menus and whatnot
		await this.$store.dispatch('fetchSession')
	}
}
</script>
