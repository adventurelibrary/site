<template>
	<FormGroup :label="label">
		<input class="form-control"
			v-bind:value="value"
			v-on:input="input"
			:type="inputType"
			:placeholder="placeholder"
			/>
	</FormGroup>
</template>
<script lang="ts">
import Vue from "vue"
import FormGroup from "./FormGroup.vue";

export default Vue.extend({
	name: 'InputGroup',
	components: {
		FormGroup: FormGroup
	},
	props: ['value', 'label', 'type', 'placeholder'],
	methods: {
		input ($event: any) {
			const val = $event.target.value
			this.$emit('input', val)
		}
	},
	computed: {
		inputType () {
			return this.type || 'text'
		}
	}
})
</script>
