<template>
	<fragment>
		<input type="text" class="filter" v-model="filter" placeholder="Filter creators" />
		<LoadingContainer :loading="creatorsAjax.loading" :error="creatorsAjax.error">
			<ul class="creator-selector">
				<li v-for="creator in creators"
					:key="creator.id"
					@click="() => selectCreator(creator)" :class="{active: creator.active}" class="creator">
					{{creator.name}}
					<input type="checkbox" :checked="creator.active" />
				</li>
			</ul>
		</LoadingContainer>
	</fragment>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import {computeAjaxList, doAjax, newAjax} from "~/lib/ajax";
import {Creator, CreatorsResponse} from "~/modules/creators/creator-types";
import {getCreators} from "~/modules/creators/creator-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {Fragment} from "vue-fragment";

type CreatorItem = Creator & {
	active: boolean
}
@Component({
	components: {
		LoadingContainer,
		Fragment
	}
})
export default class MyCreatorSelector extends Vue {
	filter : string = ''
	creatorsAjax = newAjax<CreatorsResponse>({
		total: 0,
		creators: []
	})


	@Model('changed',  {
		type: Object as PropType<Creator | undefined>
	})
	readonly selected! : Creator | undefined

	async created () {
		await this.loadCreators()
	}

	async loadCreators () {
		await doAjax<CreatorsResponse>(this.creatorsAjax, async () => {
			return await getCreators()
		})
	}

	selectCreator (creator: Creator) {
		console.log('select this', creator)
		if (this.selected && this.selected.id === creator.id) {
			this.$emit('changed', undefined)
			console.log('emit it')
		} else {
			console.log('emit', creator)
			this.$emit('changed', creator)
		}
	}

	get creators () : CreatorItem[] {
		const list = computeAjaxList(this.creatorsAjax, 'creators')
		const filter = this.filter.trim().toLowerCase()
		const filtered = list.filter((creator: Creator) => {
			if (!creator.name) {
				return false
			}
			return creator.name.toLowerCase().indexOf(filter) >= 0
		})
		return filtered.map((creator : Creator) : CreatorItem => {
			const active = !!(this.selected && this.selected.id == creator.id)
			return Object.assign({
				active: active,
			}, creator)
		})
	}
}
</script>
