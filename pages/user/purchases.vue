<template>
	<ProfilePage active-tab="purchases">
		<Fragment slot="actions">
			<nuxt-link to="buy-coins" class="button cta">Buy Coins</nuxt-link>
		</Fragment>
		<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
			<div>Showing {{purchases.length}}. Total: {{purchasesResponse.total}}</div>
			<table>
				<thead>
					<tr>
						<th>Price</th>
						<th>Coins</th>
						<th>Processor</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="purchases.length === 0">
						<td colspan="3">
							No purchases to show.
						</td>
					</tr>
					<tr v-for="purchase in purchases">
						<td><CentsAsDollars :cents="purchase.cents" /></td>
						<td>{{purchase.coins.toLocaleString('en-us')}}</td>
						<td>{{purchase.provider}}</td>
						<td><DateTime :date-time="purchase.succeeded_date" /></td>
					</tr>
				</tbody>
			</table>
			<Pagination
					:items-per-page="itemsPerPage"
					:total-items="purchasesResponse.total"
					:active-page="activePage"
					:to="{name: 'user-purchases'}"
			/>
		</LoadingContainer>
	</ProfilePage>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import PaginationMixin from "~/mixins/PaginationMixin.vue";
import ProfilePage from "~/pages/user/-components/ProfilePage.vue";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {Fragment} from "vue-fragment";
import {getMyPurchases} from "~/modules/buy/buy-api";
import {CoinPurchase, CoinPurchasesResponse} from "~/modules/buy/buy-types";
import DateTime from "~/components/DateTime.vue";
import CentsAsDollars from "~/components/CentsAsDollars.vue";

@Component({
	middleware: ['require_auth'],
	components: {
		ProfilePage,
		DateTime: DateTime,
		CentsAsDollars: CentsAsDollars,
		Fragment: Fragment,
		LoadingContainer: LoadingContainer
	}
})
export default class MyPurchases extends mixins(PaginationMixin) {
	itemsPerPage = 20
	purchasesResponse : CoinPurchasesResponse = {
		results: [],
		total: 0
	}

	async pageChanged () {
		this.$fetch()
	}

	async fetch () {
		const res = await getMyPurchases(this.limit, this.skip)
		this.purchasesResponse = res
	}

	get purchases () : CoinPurchase[] {
		if (!this.purchasesResponse) {
			return []
		}
		return this.purchasesResponse.results
	}
}
</script>
