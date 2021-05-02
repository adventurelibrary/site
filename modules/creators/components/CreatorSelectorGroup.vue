<template>
	<FormGroup label="Creator">
		<select :disabled="creatorsAjax.loading"
						v-bind:value="creatorIdLocal"
						v-on:input="creatorChanged">
			<option value="-1" v-if="creatorsAjax.loading">Loading...</option>
			<option v-else value=""> - </option>
			<option v-for="creator in creators" :key="creator.id" :value="creator.id">{{creator.name}}</option>
		</select>
	</FormGroup>
</template>
<script lang="ts">
import FormGroup from "~/components/forms/FormGroup.vue";
import {Component, Model} from "nuxt-property-decorator";
import Vue from "vue"
import {computeAjaxList, doAjax, newAjax} from "~/lib/ajax";
import {getCreators} from "~/modules/creators/creator-api";
import {CreatorsResponse} from "~/modules/creators/creator-types";

@Component({
	components: {
		FormGroup: FormGroup
	}
})
export default class CreatorSelectorGroup extends Vue {
	creatorsAjax = newAjax<CreatorsResponse>({creators: [], total: 0})

	@Model('changed',  {
		type: String
	})
	readonly creatorIdLocal! : string

	created () {
		doAjax(this.creatorsAjax,async () => {
			return await getCreators()
		})
	}

	creatorChanged (e: any) {
		this.$emit('change', e.target.value)
	}

	get creators () {
		return computeAjaxList(this.creatorsAjax, 'creators')
	}
}
</script>
