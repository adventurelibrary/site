<template>
	<div v-if="showError" class="form-errors">
		<div v-for="msg in messages" :key="msg">{{msg}}</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";

@Component
export default class FormErrors extends Vue {
	@Prop() error : any

	get showError () : boolean {
		return this.messages && this.messages.length > 0
	}

	// TODO: Create an error object that can hold multiple error messages within it
	// This will allow us to display infinite validation errors on forms
	// Simple: {messages: ['Title is required', 'Name is required']}
	// A more advanced structure will be needed later with field names that have errors
	// so that we can highlight those fields
	get messages () : string[] {
		if (!this.error) {
			return []
		}

		if (this.error.message) {
			return [this.error.message]
		}

		return [this.error.toString()]
	}
}
</script>
