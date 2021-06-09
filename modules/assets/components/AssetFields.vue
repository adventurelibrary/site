<template>
	<section class="asset-fields">
		<Input
				label="Title"
				:value="copy.name"
				v-on:input="(val) => fieldChanged('name', val)"
		/>
		<Textarea
				label="Description"
				:value="copy.description"
				v-on:input="(val) => fieldChanged('description', val)"
		/>
		<FormGroup label="Tags">
			<TagsInput
					v-model="copy.tagObjects"
				/>
		</FormGroup>
		<CategorySelect
				label="Type"
				:value="copy.category"
				v-on:input="(val) => fieldChanged('category', val)"
		/>
		<Select
				v-if="!hideVisibility"
				label="Visibility"
				:options="visOptions"
				:value="copy.visibility"
				v-on:input="(val) => fieldChanged('visibility', val)" />
	</section>
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

export const fieldNames = ['name', 'description', 'type']

export default Vue.extend({
	props: {
		asset: {
			type: Object as PropType<AssetFormData>,
			required: true
		},
		hideVisibility: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	components: {
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
		}
	}
})
</script>
