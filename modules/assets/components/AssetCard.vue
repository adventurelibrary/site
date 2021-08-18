<template>
	<li class="asset-card">
		<AssetLink :asset="asset" class="link">
			<!-- This Element Intentionally Left Empty -->
		</AssetLink>
		<AssetThumbnail :asset="asset" />
		<div class="meta">
			<h3 class="title">
				<AssetLink :asset="asset">{{asset.name}}</AssetLink>
			</h3>
			<h4 class="author">
				<Category :category="asset.category" />
				<span class="author-label">by</span>
				<span>
					<!-- Should be a profile link -->
					{{asset.creator_name}}
				</span>
			</h4>
<!--			<figure class="pricing">
				<h4 class="coin-price">
					<span class="amount">&lt;!&ndash;{{asset.price}}&ndash;&gt;$$</span>
					<span class="currency">Coins</span>
				</h4>
			</figure>-->
			<div class="description">
				{{asset.description}}
			</div>
			<slot name="extra-details"></slot>
			<div class="search-meta">
				<TagList :tags="asset.tags" />
			</div>
		</div>
		<figure class="asset-actions">
			<AssetDownload :asset="asset" />
			<AssetAddToBundle v-if="isLoggedIn" :asset="asset" />
			<slot name="extra-actions"></slot>
		</figure>
		
	</li>
</template>
<script lang="ts">
import {Component, Prop, Getter, Watch} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {getCategory} from "~/modules/categories/categories-api";
import Category from "~/modules/categories/components/Category.vue";
import TagList from "~/modules/tags/TagList.vue";
import {Category as CategoryType} from "~/modules/categories/categories-types"
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import AssetAddToBundleButton from "~/modules/assets/components/AssetAddToBundleButton.vue";
import AssetThumbnail from "~/modules/assets/components/AssetThumbnail.vue";

@Component({
	components: {
		AssetLink: AssetLink,
		Category: Category,
		TagList: TagList,
		AssetDownload: AssetDownload,
		AssetAddToBundle: AssetAddToBundleButton,
		AssetThumbnail: AssetThumbnail
	}
})
class AssetCard extends Vue {
	category : CategoryType | null

	@Getter('isLoggedIn') isLoggedIn : boolean

	@Prop() asset : Asset

	@Watch('asset.type', {
		immediate: true
	})
	typeChanged () {
		this.category = getCategory(this.asset.category)
	}
}
export default AssetCard
</script>
