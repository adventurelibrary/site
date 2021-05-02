<template>
	<div>
		<CreatorSelectorGroup
				v-model="copy.uploadAsCreator"
				@change="uploadAsCreatorChanged"
			/>
		<Input
				label="Name"
				:value="copy.name"
				v-on:input="(val) => fieldChanged('name', val)"
		/>
		<FormGroup label="Tags">
			<TagsInput
					v-model="copy.tagObjects"
				/>
		</FormGroup>
		<Textarea
				label="Description"
				:value="copy.description"
				v-on:input="(val) => fieldChanged('description', val)"
		/>
		<CategorySelect
				label="Type"
				:value="copy.category"
				v-on:input="(val) => fieldChanged('category', val)"
		/>
		<Select
				:label="copy.visibility"
				:options="visOptions"
				:value="copy.visibility"
				v-on:input="(val) => fieldChanged('visibility', val)" />
	</div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"
import {AssetFormData} from "~/lib/assets/asset-types";
import Input from "~/components/forms/InputGroup.vue";
import Textarea from "~/components/forms/Textarea.vue";
import AssetCategorySelect from "~/modules/categories/components/CategorySelect.vue";
import TagsInput from "~/components/forms/TagsInput.vue";
import FormGroup from "~/components/forms/FormGroup.vue";
import Select from "~/components/forms/SelectGroup.vue";
import {VisibilityOptions} from "~/lib/assets/asset-consts";
import {SelectOption} from "~/lib/helpers";
import CreatorSelectorGroup from "~/modules/creators/components/CreatorSelectorGroup.vue";

// This is used by other components like the UploadAssets one to know keys from objects
// it receives are ones it should use to update an Asset object
export const fieldNames = ['name', 'tags', 'description', 'type', 'uploadAsCreator', 'visibility']

export default Vue.extend({
	props: {
		asset: {
			type: Object as PropType<AssetFormData>,
			required: true
		},
		asAdmin: {
			type: Boolean,
			required: false
		}
	},
	components: {
		CreatorSelectorGroup,
		Input: Input,
		Textarea: Textarea,
		CategorySelect: AssetCategorySelect,
		TagsInput: TagsInput,
		FormGroup: FormGroup,
		Select: Select
	},
	data () : {
		copy: any,
		visOptions: SelectOption[]
	} {
		return {
			copy: {},
			visOptions: VisibilityOptions
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
		},
		uploadAsCreatorChanged (val: string) {
			this.fieldChanged('uploadAsCreator', val)
		}
	}
})
</script>
