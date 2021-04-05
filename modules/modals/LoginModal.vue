<template>
	<Modal
			:show="show"
			title="Login"
			@close="closeModal">
		<slot>
			<form @submit="submit">
				<Input
					label="Username or Email"
					:value="identifier"
					@input="(val) => identifier = val"
					/>
				<Input
						label="Password"
						type="password"
						:value="password"
						@input="(val) => password = val"
				/>
				<div>
					Not registered? <a @click="openSignUp">Sign up</a>
				</div>
			</form>
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, mixins, Prop} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import FormMixin from "~/mixins/Forms.vue";
import Input from "~/components/forms/InputGroup.vue";

@Component({
	components: {
		Modal: Modal,
		Input: Input
	}
})
export default class LoginModal extends mixins(FormMixin) {
	identifier = ''
	password = ''

	@Prop() show : boolean

	closeModal () {
		this.$store.dispatch('closeLoginModal')
	}

	async formAction () {
		alert('do a signin')
	}

	openSignUp () {
		this.$store.dispatch('closeAllModals')
		this.$store.dispatch('openRegisterModal')
	}
}
</script>
