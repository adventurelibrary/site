<template>
	<Modal
			:show="show"
			title="Login"
			@close="closeModal">
		<slot>
			Login Form here please
		</slot>
	</Modal>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import Modal from "~/modules/modals/Modal.vue";

@Component({
	components: {
		Modal: Modal
	}
})
export default class LoginModal extends Vue {
	@Prop() show : boolean

	closeModal () {
		this.$store.dispatch('closeLoginModal')
	}
}
</script>
