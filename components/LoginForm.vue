<template>
	<form @submit="submit">
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
		<button>Login</button>
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

	validateForm () {
		if (this.identifier == '') {
			return 'Username is required'
		}
	}

	async formAction () {
		await signIn(this.identifier, this.password)
		await this.$store.dispatch('fetchSession')
		this.$emit('success')
	}
}
</script>
