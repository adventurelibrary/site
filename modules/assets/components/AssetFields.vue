<template>
	<div>
		<Input
				label="Name"
				:value="copy.name"
				v-on:input="(val) => fieldChanged('name', val)"
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
		<CategorySelect
				label="Type"
				:value="copy.categoryID"
				v-on:input="(val) => fieldChanged('categoryID', val)"
		/>
	</div>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"
import {AssetFormData} from "~/lib/assets/asset-types";
import Input from "~/components/forms/Input.vue";
import Textarea from "~/components/forms/Textarea.vue";
import AssetCategorySelect from "~/modules/categories/components/CategorySelect.vue";
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
		CategorySelect: AssetCategorySelect,
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
