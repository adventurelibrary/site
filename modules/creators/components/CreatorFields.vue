<template>
	<div class="form-wrapper">
		<InputGroup
				label="Name"
				v-model="copy.name"
		/>
		<UserSelect label="Owner" v-model="copy.owner_id" />
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import InputGroup from "~/components/forms/InputGroup.vue";
import UserSelect from "~/modules/users/components/UserSelect.vue";

@Component({
	components: {
		UserSelect,
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
