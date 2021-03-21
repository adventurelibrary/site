<template>
	<CAlert v-if="showError" color="danger">
		<div v-for="msg in messages" :key="msg">{{msg}}</div>
	</CAlert>
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
	name: 'FormErrors',
	props: ['error'],
	computed: {
		showError () {
			return this.messages && this.messages.length > 0
		},
		messages () {
			if (!this.error) {
				return []
			}

			if (this.error.errors) {
				const msgs = this.error.errors.map((error) => {
					return error.Message
				})
				return msgs
			} else {
			}

			return [this.error.toString()]
		}
	}
})
</script>
