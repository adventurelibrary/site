<template>
	<div>
		<InputGroup
				label="Name"
				v-model="copy.name"
		/>
		<TextareaGroup
			label="Description"
			v-model="copy.description" />
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import InputGroup from "~/components/forms/InputGroup.vue";
import Textarea from "~/components/forms/Textarea.vue";

@Component({
	components: {
		InputGroup: InputGroup,
		TextareaGroup: Textarea
	}
})
export default class BundleFields extends Vue {
	@Model('changed',  {
		type: Object as PropType<any>
	})
	readonly copy! : any
}
</script>
