<template><span>{{s}}</span></template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";

@Component
export default class S extends Vue {
	@Prop() num : number
	@Prop({
		default: ''
	}) singular : string

	@Prop({
		default: ''
	}) plural : string

	get s () {
		console.log('singular', this.singular)
		if (this.num == 1) {
			if (this.singular) {
				return this.singular
			}
			return ''
		}
		if (this.plural) {
			return this.plural
		}
		if (this.singular) {
			return this.singular + 's'
		}
		return 's'
	}
}
</script>
