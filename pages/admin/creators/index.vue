<template>
	<div class="card">
		<div class="card-header">
			Creators
		</div>
		<div class="card-body">
			<nuxt-link :to="{name: 'admin-creators-new'}">Add Creator</nuxt-link>
			<LoadingContainer :loading="creatorsAjax.loading" :error="creatorsAjax.error">
				<Pagination :to="{name: 'admin-creators'}" :items-per-page="itemsPerPage" :total-items="totalCreators" />
				<DataTable :items="creators" :fields="['name']" :clickable-rows="false">
					<template #name="{item}">
						<td>
							<nuxt-link :to="{name: 'admin-creators-id', params: {id: item.id}}">{{item.name}}</nuxt-link>
						</td>
					</template>
				</DataTable>
				<Pagination :to="{name: 'admin-creators'}" :items-per-page="itemsPerPage" :total-items="totalCreators" />
			</LoadingContainer>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Watch} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import {computeAjaxList, computeAjaxTotal, doAjax} from "~/lib/ajax";
import {CreatorsResponse} from "~/modules/creators/creator-types";
import AdminPage from "~/admin/admin-page";
import {Route} from "vue-router";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {getCreators, newCreatorsAjax} from "~/modules/creators/creator-api";
import DataTable from "~/components/DataTable.vue";
@Component({
	components: {
		LoadingContainer,
		DataTable: DataTable
	}
})
export default class CreatorsIndex extends AdminPage {
	public creatorsAjax = newCreatorsAjax()
	public itemsPerPage = 20

	async asyncData (ctx: Context) {
		console.log('ctx page', ctx.route.query.page)
		const fn = async () => {
			return await getCreators()
		}
		const creatorsAjax = newCreatorsAjax()
		await doAjax<CreatorsResponse>(creatorsAjax, fn)
		return {
			creatorsAjax,
		}
	}

	@Watch('$route')
	async routeChanged (newRoute: Route) {
		console.log('route changed, probably should handle pagination', newRoute.query.page)
	}

	get creators () : any[] {
		const list = computeAjaxList(this.creatorsAjax, 'creators')
		return list
	}

	get totalCreators () : number {
		const total = computeAjaxTotal(this.creatorsAjax)
		return total
	}
}
</script>
