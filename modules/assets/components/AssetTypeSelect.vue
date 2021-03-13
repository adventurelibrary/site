<template>
	<Select
			label="Type"
			:options="types"
			v-bind:value="value"
			disabled-prompt="Select a type"
			v-on:input="(val) => $emit('input', val)" />
</template>
<script lang="ts">
import Vue from "vue"
import Select from "~/components/forms/Select.vue";
import {AssetTypeOptionsSingular} from "~/lib/assets/asset-consts";
export default Vue.extend({
	name: 'AssetTypeSelect',
	components: {
		Select: Select
	},
	props: ['value'],
	data () {
		return {
			types: AssetTypeOptionsSingular
		}
	}
})
</script>
