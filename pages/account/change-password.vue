<template>
	<form @submit="submit">
		<FormErrors :error="form.error" />
		<InputGroup
				label="Old Password"
				type="password"
				:value="oldPassword"
				@input="(val) => oldPassword = val"
		/>
		<InputGroup
				label="New Password"
				type="password"
				:value="newPassword"
				@input="(val) => newPassword = val"
		/>
		<InputGroup
				label="Confirm Password"
				type="password"
				:value="confirmPassword"
				@input="(val) => confirmPassword = val"
		/>
		<button>Submit</button>
	</form>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import FormErrors from "~/components/forms/FormErrors.vue";
import {changePassword} from "~/lib/auth/auth-api";
import InputGroup from "~/components/forms/InputGroup.vue";

@Component({
	middleware: ['require_auth'],
	components: {
		FormErrors: FormErrors,
		InputGroup: InputGroup
	}
})
export default class AccountIndex extends mixins(FormMixin) {
	oldPassword = ''
	newPassword = ''
	confirmPassword = ''

	validateForm () {
		if (this.oldPassword === '') {
			return 'Old password is required'
		}

		if (this.newPassword === '') {
			return 'New password is required'
		}

		if (this.newPassword !== this.confirmPassword) {
			return 'Passwords do not match'
		}

		return ''
	}

	async formAction () {
		await changePassword(this.$store.state.user.username, this.oldPassword, this.newPassword)
	}
}
</script>
