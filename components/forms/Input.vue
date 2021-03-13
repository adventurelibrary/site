<template>
	<FormGroup :label="label">
		<input class="form-control"
		v-bind:value="value"
		v-on:input="input"
			/>
	</FormGroup>
</template>
<script lang="ts">
import Vue from "vue"
import FormGroup from "./FormGroup.vue";

export default Vue.extend({
	name: 'Input',
	components: {
		FormGroup: FormGroup
	},
	props: ['value', 'label'],
	methods: {
		input ($event: any) {
			const val = $event.target.value
			this.$emit('input', val)
		}
	}
})
</script>
