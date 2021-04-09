<template>
	<Modal
			:show="show"
			title="Register"
			@close="closeModal">
		<slot>
			<RegisterForm />
			<div>
				Already registered? <a @click="openLogin">Login up</a>
			</div>
		</slot>
	</Modal>
</template>
<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";
import Vue from "vue";
import RegisterForm from "~/components/RegisterForm.vue";

@Component({
	components: {
		RegisterForm,
		Modal: Modal,
	}
})
export default class RegisterModal extends Vue {
	@Prop() show : boolean

	closeModal () {
		this.$store.dispatch('closeRegisterModal')
	}

	openLogin () {
		this.$store.dispatch('closeAllModals')
		this.$store.dispatch('openLoginModal')
	}
}
</script>
