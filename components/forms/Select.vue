<template>
	<FormGroup :label="label">
		<select
				class="form-control"
				v-bind:value="value"
				v-on:input="input"
		>
			<option v-if="disabledPrompt" disabled>{{disabledPrompt}}</option>
			<option v-for="option in options" :key="option.value" v-bind:value="option.value">{{option.label}}</option>
		</select>
	</FormGroup>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import FormGroup from "./FormGroup.vue";

export default Vue.extend({
	name: 'Select',
	components: {
		FormGroup: FormGroup
	},
	props: {
		value: {
			type: String
		},
		label: {
			type: String,
			required: false
		},
		options: {
			type: Array as PropType<any[]>,
			required: true
		},
		disabledPrompt: {
			required: false,
			type: String
		}
	},
	template: ``,
	methods: {
		input ($event: any) {
			const val = $event.target.value
			this.$emit('input', val)
		}
	}
})
</script>
