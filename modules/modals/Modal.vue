<template>
	<div class="modal" v-show="show">
		<div class="modal-header">
			<button type="button" @click="closeModal">close</button>
			{{title}}
		</div>
		<div class="modal-body">
			<slot>Modal Body</slot>
		</div>
		<div class="modal-footer">

		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";

@Component
export default class Modal extends Vue {
	@Prop() title : string
	@Prop() show : boolean

	closeModal () {
		this.$emit('close')
	}
}
</script>
