<template>
	<CCard>
		<CCardHeader>
			Assets
		</CCardHeader>
		<CCardBody>
			<LoadingContainer :loading="assetsAjax.loading" :error="assetsAjax.error">
				<Pagination :to="{name: 'admin-assets'}" :items-per-page="search.size" :total-items="totalAssets" />
				<div>
					{{numSelected}} Asset(s) Selected
					<button type="button" :disabled="numSelected  == 0" @click="publishSelected">
						Publish
					</button>
					<button type="button" :disabled="numSelected  == 0" @click="deleteSelected">
						Delete
					</button>
				</div>
				<CDataTable :items="assets" :fields="['select', 'name', 'categoryName', 'tags']" :clickable-rows="true" @row-clicked="rowClicked">
					<template #select="{item}">
						<td>
							<input type="checkbox" :checked="selectedAssets[item.id]" />
						</td>
					</template>
					<template #name="{item}">
						<td>
							<AssetEditLink :asset="item">{{item.name}}</AssetEditLink>
						</td>
					</template>
					<template #categoryName="{item}">
						<td>
							<Category :category-id="item.categoryID" />
						</td>
					</template>
					<template #tags="{item}">
						<td>
							<TagList :tags="item.tags" />
						</td>
					</template>
				</CDataTable>
				<Pagination :to="{name: 'admin-assets'}" :items-per-page="search.size" :total-items="totalAssets" />
			</LoadingContainer>
		</CCardBody>
	</CCard>
</template>
<script lang="ts">
import Vue from "vue";
import {Component, Watch} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import {newAssetsAjax, searchAssets} from "~/lib/assets/asset-api";
import {computeAjaxList, computeAjaxTotal, doAjax} from "~/lib/ajax";
import {Asset, AssetSearchOptions, AssetsResponse} from "~/lib/assets/asset-types";
import {getRouteAssetSearchOptions} from "~/modules/assets/helpers";
import AdminPage from "~/admin/admin-page";
import TagList from "~/modules/tags/TagList.vue";
import AssetEditLink from "~/admin/components/AssetEditLink.vue";
import Category from "~/modules/categories/components/Category.vue";
import {Route} from "vue-router";
import LoadingContainer from "~/components/LoadingContainer.vue";
@Component({
	components: {
		LoadingContainer,
		TagList,
		AssetEditLink,
		Category: Category
	}
})
export default class AssetsIndex extends AdminPage {
	public assetsAjax = newAssetsAjax()
	public search : AssetSearchOptions
	public selectedAssets : Record<string, boolean> = {}

	async asyncData (ctx: Context) {
		const search = getRouteAssetSearchOptions(ctx.route)
		const fn = async () => {
			return await searchAssets(search)
		}
		const assetsAjax = newAssetsAjax()
		await doAjax<AssetsResponse>(assetsAjax, fn)
		return {
			assetsAjax,
			search
		}
	}

	@Watch('$route')
	async routeChanged (newRoute: Route) {
		const search = getRouteAssetSearchOptions(newRoute)
		this.search = search
		const fn = async () => {
			return await searchAssets(search)
		}
		await doAjax<AssetsResponse>(this.assetsAjax, fn)
	}


	// This is just some testing and demonstration, it will be removed later
	mounted () {
		this.notifySuccess('Successfully showed this message')
		setTimeout(() => {
			this.notifyError('Now an error')
		}, 1500)
	}

	rowClicked (item: Asset) {
		console.log('item', item)
		const val = this.selectedAssets[item.id] ? true : false
		Vue.set(this.selectedAssets, item.id, !val)
	}

	publishSelected () {
	}

	deleteSelected () {
	}

	get assets () : any[] {
		return computeAjaxList(this.assetsAjax)
	}

	get totalAssets () : number {
		return computeAjaxTotal(this.assetsAjax.data)
	}

	get numSelected () : number {
		let num = 0;
		Object.keys(this.selectedAssets).forEach((key: string) => {
			if (this.selectedAssets[key]) {
				num++
			}
		})
		return num
	}
}
</script>
