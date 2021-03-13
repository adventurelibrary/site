<template>
	<div>
		<Input
				label="Title"
				v-bind:value="copy.title"
				v-on:input="(val) => fieldChanged('title', val)"
		/>
		<Textarea
				label="Description"
				v-bind:value="copy.description"
				v-on:input="(val) => fieldChanged('description', val)"
		/>
		<TypeSelect
				label="Type"
				v-bind:value="copy.type"
				v-on:input="(val) => fieldChanged('type', val)"
		/>
	</div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"
import {Asset} from "~/lib/assets/asset-types";
import Input from "~/components/forms/Input.vue";
import Textarea from "~/components/forms/Textarea.vue";
import AssetTypeSelect from "./AssetTypeSelect.vue";

export const fieldNames = ['title', 'description', 'type']

export default Vue.extend({
	props: {
		asset: {
			type: Object as PropType<Asset>,
			required: true
		}
	},
	components: {
		Input: Input,
		Textarea: Textarea,
		TypeSelect: AssetTypeSelect
	},
	data () : {
		copy: any
	} {
		return {
			copy: {}
		}
	},
	watch: {
		asset: {
			immediate: true,
			deep: true,
			handler (newVal) {
				this.copy = Object.assign({}, newVal)
			}
		}
	},
	methods: {
		fieldChanged (field: string, value: any) {
			this.copy[field] = value;
			this.$emit('assetChanged', this.copy)
		}
	}
})
</script>
