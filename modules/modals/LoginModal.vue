<template>
	<Modal
			:show="show"
			class-name="login-modal"
			title="Login"
			@close="closeModal">
		<slot>
			<Login @success="onSuccess" @register="openRegister" />
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

	openRegister () {
		this.$store.dispatch('closeAllModals')
		this.$store.dispatch('openRegisterModal')
	}

	onSuccess () {
		this.$store.dispatch('closeAllModals')
		//window.location.reload()

	}
}
</script>
