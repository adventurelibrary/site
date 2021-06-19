<template>
	<button :class="classes" :disabled="submitting">{{text}}</button>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";

@Component
export default class SubmitButton extends Vue {
	@Prop({
		default: 'Submit'
	}) idleText : string

	@Prop({
		default: 'Submiting...'
	}) submittingText : string

	@Prop() submitting : boolean

	@Prop({
		type: [String, Array, Object],
	}) classes : any

	get text () : string {
		return this.submitting ? this.submittingText : this.idleText
	}
}
</script>
