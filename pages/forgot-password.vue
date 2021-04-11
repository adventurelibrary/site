<template>
	<div>
		Forgot Password
		<div v-if="done">
			Success! Check your email for a code and a link.
		</div>
		<div v-else>
			<ForgotPasswordForm @success="onSuccess" />
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import {Component} from "nuxt-property-decorator"
import ForgotPasswordForm from '@/components/ForgotPasswordForm'

@Component({
	components: {
		ForgotPasswordForm
	}
})
export default class ForgotPassword extends Vue {
	done = false
	onSuccess () {
		this.done = true
		this.notifySuccess('Check your email')
	}
}
</script>
