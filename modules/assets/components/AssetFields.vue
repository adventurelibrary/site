<template>
	<div>
		<Input
				label="Title"
				:value="copy.title"
				v-on:input="(val) => fieldChanged('title', val)"
		/>
		<FormGroup label="Tags">
			<TagsInput
					v-model="copy.tags"
				/>
		</FormGroup>
		<Textarea
				label="Description"
				:value="copy.description"
				v-on:input="(val) => fieldChanged('description', val)"
		/>
		<TypeSelect
				label="Type"
				:value="copy.type"
				v-on:input="(val) => fieldChanged('type', val)"
		/>
	</div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"
import {Asset, AssetFormData} from "~/lib/assets/asset-types";
import Input from "~/components/forms/Input.vue";
import Textarea from "~/components/forms/Textarea.vue";
import AssetTypeSelect from "./AssetTypeSelect.vue";
import TagsInput from "~/components/forms/TagsInput.vue";
import FormGroup from "~/components/forms/FormGroup.vue";

export const fieldNames = ['title', 'description', 'type']

export default Vue.extend({
	props: {
		asset: {
			type: Object as PropType<AssetFormData>,
			required: true
		}
	},
	components: {
		Input: Input,
		Textarea: Textarea,
		TypeSelect: AssetTypeSelect,
		TagsInput: TagsInput,
		FormGroup: FormGroup
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
