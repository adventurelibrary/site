<template>
	<div class="form-wrapper">
		<InputGroup
				label="Name"
				v-model="copy.name"
		/>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import InputGroup from "~/components/forms/InputGroup.vue";

@Component({
	components: {
		InputGroup: InputGroup,
	}
})
export default class BundleFields extends Vue {
	@Model('changed',  {
		type: Object as PropType<any>
	})
	readonly copy! : any
}
</script>
