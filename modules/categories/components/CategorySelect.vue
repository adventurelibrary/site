<template>
	<Select
			label="Category"
			:options="options"
			v-bind:value="value"
			disabled-prompt="Select a category"
			v-on:input="(val) => $emit('input', val)" />
</template>
<script lang="ts">
import Vue from "vue"
import Select from "~/components/forms/Select.vue";
import {CategoryOptionsSingular} from "~/lib/categories/categories-consts";
export default Vue.extend({
	name: 'CategorySelect',
	components: {
		Select: Select
	},
	props: ['value'],
	data () {
		return {
			options: CategoryOptionsSingular
		}
	}
})
</script>
