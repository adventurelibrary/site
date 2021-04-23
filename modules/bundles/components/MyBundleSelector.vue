<template>
	<div>
		<input type="text" v-model="filter" placeholder="Filter bundles" />
		<div>
			<LoadingContainer :loading="bundlesAjax.loading" :error="bundlesAjax.error">
				<ul class="bundle-selector">
					<li v-for="bundle in bundles" :key="bundle.id" @click="() => toggleBundle(bundle)" :class="{active: bundle.active}" class="bundle">
						<div class="circle"></div>
						<div>
							<strong>{{bundle.name}}</strong>
							<a href="#bundle-page">{{bundle.numAssets}} Asset<S :num="bundle.numAssets" /></a>
						</div>
						<div class="fake-image">

						</div>
					</li>
				</ul>
			</LoadingContainer>
		</div>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import {computeAjaxList, doAjax} from "~/lib/ajax";
import {Bundle, BundlesResponse} from "~/lib/bundles/bundle-types";
import {getMyBundles, newBundlesAjax} from "~/lib/bundles/bundles-api";
import LoadingContainer from "~/components/LoadingContainer.vue";

type BundleItem = Bundle & {
	active: boolean
}
@Component({
	components: {
		LoadingContainer
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
<style scoped>
ul.bundle-selector {
	margin: 0px;
	padding: 0px;
	list-style: inside;
}

li.bundle {
	display: flex;
	padding: 1em;
}

li.bundle:hover {
	background: #1B1B1B;
	cursor: pointer;
}

.circle {
	border-radius: 50%;
	height: 20px;
	width: 20px;
	border: 2px solid #106466;
}

li.bundle.active .circle {
	background: #1AA9C9;
}

.fake-image {
	width: 100px;
	height: 60px;
	background: black;
}
</style>
