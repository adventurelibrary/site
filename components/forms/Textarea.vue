<template>
  <FormGroup :label="label" class="text-area">
		<textarea
			class="form-control"
			v-bind:value="value"
			v-on:input="input"
			:placeholder="placeholder"
		/>
  </FormGroup>
</template>
<script lang="ts">
import Vue from "vue"
import FormGroup from "./FormGroup.vue";

export default Vue.extend({
	name: 'Textarea',
	props: ['value', 'label', 'placeholder'],
	components: {
		FormGroup: FormGroup,
	},
	methods: {
		input ($event: any) {
			const val = $event.target.value
			this.$emit('input', val)
		}
	}
})
</script>
