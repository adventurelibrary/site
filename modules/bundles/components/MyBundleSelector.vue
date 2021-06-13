<template>
	<fragment>
		<input type="text" class="filter" v-model="filter" placeholder="Filter bundles" />
		<LoadingContainer :loading="bundlesAjax.loading" :error="bundlesAjax.error">
			<ul class="bundle-selector">
				<li v-for="bundle in bundles" :key="bundle.id" @click="() => toggleBundle(bundle)" :class="{active: bundle.active}" class="bundle">
					<div class="circle"></div>
					<h4 class="title">{{bundle.name}}</h4>
					<a class="link" href="#bundle-page">{{bundle.numAssets}} Asset<S :num="bundle.numAssets" /></a>
					<p class="description">{{bundle.description || "Filler text"}}</p>
					<img style="object-fit: contain;" src="~/assets/coolicons/svg/file/folder.svg">
				</li>
			</ul>
		</LoadingContainer>
	</fragment>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import {computeAjaxList, doAjax} from "~/lib/ajax";
import {Bundle, BundlesResponse} from "~/modules/bundles/bundle-types";
import {getMyBundles, newBundlesAjax} from "~/modules/bundles/bundles-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {Fragment} from "vue-fragment";

type BundleItem = Bundle & {
	active: boolean
}
@Component({
	components: {
		LoadingContainer,
		Fragment
	}
})
export default class MyBundleSelector extends Vue {
	filter : string = ''
	bundlesAjax = newBundlesAjax()


	@Model('changed',  {
		type: Array as PropType<string[]>
	})
	readonly selectedIds! : string[]

	async created () {
		await this.loadBundles()
	}

	async loadBundles () {
		await doAjax<BundlesResponse>(this.bundlesAjax, async () => {
			return await getMyBundles()
		})
	}

	toggleBundle (bundle: Bundle) {
		const index = this.selectedIds.indexOf(bundle.id)
		if (index == -1) {
			this.selectedIds.push(bundle.id)
		} else {
			this.selectedIds.splice(index, 1)
		}
		this.emitChanged()
	}

	emitChanged () {
		this.$emit('changed', this.selectedIds)
	}

	get bundles () : BundleItem[] {
		console.log('get bundles')
		const list = computeAjaxList(this.bundlesAjax, 'bundles')
		const filter = this.filter.trim().toLowerCase()
		const filtered = list.filter((bundle: Bundle) => {
			return bundle.name.toLowerCase().indexOf(filter) >= 0
		})
		return filtered.map((bundle : Bundle) : BundleItem => {
			const active = this.selectedIds.indexOf(bundle.id) >= 0
			console.log('active', active)
			return Object.assign({
				active: active,
			}, bundle)
		})
	}
}
</script>
