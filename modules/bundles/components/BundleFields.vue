<template>
	<fragment>
		<InputGroup
				label="Name"
				v-model="copy.name"
		/>
		<TextareaGroup
			label="Description"
			v-model="copy.description" />
		<SelectGroup
			label="Public"
			:options="publicOptions"
			v-model="copy.public" />
	</fragment>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import InputGroup from "~/components/forms/InputGroup.vue";
import Textarea from "~/components/forms/Textarea.vue";
import SelectGroup from "~/components/forms/SelectGroup.vue";
import {Fragment} from "vue-fragment";

@Component({
	components: {
		InputGroup: InputGroup,
		TextareaGroup: Textarea,
		SelectGroup: SelectGroup,
		Fragment
	}
})
export default class BundleFields extends Vue {
	publicOptions = [{value: false, label: 'Private'}, {value: true, label: 'Public'}]

	@Model('changed',  {
		type: Object as PropType<any>
	})
	readonly copy! : any
}
</script>
