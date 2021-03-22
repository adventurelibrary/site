<template>
	<CAlert v-if="showError" color="danger">
		<div v-for="msg in messages" :key="msg">{{msg}}</div>
	</CAlert>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";

@Component
export default class FormErrors extends Vue {
	@Prop() error : string

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

		return [this.error.toString()]
	}
}
</script>
