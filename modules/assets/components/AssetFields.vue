<template>
	<section class="asset-fields basic-form">
		<Input
			label="Title"
			v-model="copy.name"
		/>
		<Select
			label="Visibility"
			:options="visOptions"
			v-model="copy.visibility"/>
		<CategorySelect
			label="Type"
			v-model="copy.category"
		/>
		<FormGroup label="Tags" class="advanced">
			<TagsInput
				v-model="copy.tagObjects"
				/>
		</FormGroup>
		<Textarea
			label="Description"
			v-model="copy.description"
		/>
	</section>
</template>

<script lang="ts">
import Vue, {PropType} from "vue"
import {AssetFormData} from "~/modules/assets/asset-types";
import Input from "~/components/forms/InputGroup.vue";
import Textarea from "~/components/forms/Textarea.vue";
import AssetCategorySelect from "~/modules/categories/components/CategorySelect.vue";
import TagsInput from "~/components/forms/TagsInput.vue";
import FormGroup from "~/components/forms/FormGroup.vue";
import Select from "~/components/forms/SelectGroup.vue";
import {VisibilityOptions} from "~/modules/assets/asset-consts";
import {Component, Model, Prop} from "nuxt-property-decorator";

export const fieldNames = ['name', 'description', 'type']


@Component({
	components: {
		Input: Input,
		Textarea: Textarea,
		CategorySelect: AssetCategorySelect,
		TagsInput: TagsInput,
		FormGroup: FormGroup,
		Select: Select
	}
})
export default class AssetFields extends Vue {
	visOptions = VisibilityOptions

	@Model('changed',  {
		type: Object as PropType<AssetFormData>
	})
	readonly copy! : AssetFormData
}
</script>
