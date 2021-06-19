<template>
	<article>
		Forgot Password
		<div v-if="done">
			Success! Redirecting...
		</div>
		<div v-else>
			<ForgotPasswordForm @success="onSuccess" />
		</div>
	</article>
</template>
<script lang="ts">
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
	onSuccess (username: string) {
		this.done = true
		this.notifySuccess('Check your email')
		this.$router.push({
			name: 'reset-password',
			query: {
				username: username
			}
		})
	}
}
</script>
