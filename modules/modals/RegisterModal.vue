<template>
	<Modal
			:show="show"
			title="Register"
			@close="closeModal">
		<slot>
			<form @submit="submit">
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
				<button>Submit</button>
				<div>
					Already registered? <a @click="openLogin">Login up</a>
				</div>
			</form>
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import FormMixin from "~/mixins/Forms.vue";
import {signUp} from "~/lib/auth/auth-api";
import InputGroup from "~/components/forms/InputGroup.vue";

@Component({
	components: {
		Modal: Modal,
		InputGroup: InputGroup
	}
})
export default class RegisterModal extends mixins(FormMixin) {
	username = ''
	email = ''
	password = ''
	passwordConfirm = ''

	@Prop() show : boolean

	closeModal () {
		this.$store.dispatch('closeRegisterModal')
	}

	async formAction () {
		const data = {
			email: this.email,
			password: this.password,
			passwordConfirm: this.passwordConfirm,
			username: this.username
		}
		const user = await signUp(data)
		this.notifySuccess('Welcome user, ' + user.username)
	}

	openLogin () {
		this.$store.dispatch('closeAllModals')
		this.$store.dispatch('openLoginModal')
	}
}
</script>
