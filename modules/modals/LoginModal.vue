<template>
	<Modal
			:show="show"
			title="Login"
			@close="closeModal">
		<slot>
			<Login @success="onSuccess" />
			<div>
				Not registered? <a @click="openSignUp">Sign up</a>
			</div>
		</slot>
	</Modal>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Login from "~/components/LoginForm.vue";

@Component({
	components: {
		Login,
		Modal: Modal,
	}
})
export default class LoginModal extends Vue {
	identifier = ''
	password = ''

	@Prop() show : boolean

	closeModal () {
		this.$store.dispatch('closeLoginModal')
	}

	openSignUp () {
		this.$store.dispatch('closeAllModals')
		this.$store.dispatch('openRegisterModal')
	}

	onSuccess () {
		this.$store.dispatch('closeAllModals')
		window.location.reload()
	}
}
</script>
