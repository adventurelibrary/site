<template>
	<form @submit="submit">
		<FormErrors :error="form.error" />
		<InputGroup
				label="Username or Email"
				:value="identifier"
				@input="(val) => identifier = val"
		/>
		<button>Submit</button>
	</form>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import FormMixin from "~/mixins/Forms.vue";
import {forgotPassword} from "~/lib/auth/auth-api";
import InputGroup from "~/components/forms/InputGroup.vue";
import FormErrors from "~/components/forms/FormErrors.vue";

@Component({
	components: {
		InputGroup: InputGroup,
		FormErrors: FormErrors
	}
})
export default class ForgotPasswordForm extends mixins(FormMixin) {
	identifier = ''
	password = ''
	done = false

	validateForm () : string {
		if (this.identifier == '') {
			return 'Username or email is required'
		}
		return ''
	}

	async formAction () {
		await forgotPassword(this.identifier)
		this.$emit('success')
	}
}
</script>
