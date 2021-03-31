<template>
	<li class="asset-card">		
		<AssetLink :asset="asset" class="asset-thumb" :style="`background-image: url(${asset.thumbnailSrc});`"></AssetLink>
		<!--
		<div class="thumbnail" :style="`background-image: url(${asset.thumbnailSrc});`">
		</div>
		-->

		<div class="meta">
			<h3 class="title"><AssetLink :asset="asset">{{asset.name}}</AssetLink></h3>
			<figure class="pricing">
				<h4 class="coin-price">
					<span class="amount"><!--{{asset.price}}-->$$</span>
					<label class="currency">Coins</label>
				</h4>
			</figure>

			<div class="meta-full">
				<h4 class="author">
					<label>by</label>
					<span>
						<!-- Should be a profile link -->
						<a href="">{{asset.creatorName}}</a>
					</span>
				</h4>

				<div>
					{{asset.description}}
				</div>
			</div>
			<!--div>
				{{asset.description}}
			</div-->
			<!--div>
				<Category :category-id="asset.categoryID" />
				<TagList :tags="asset.tags" />
			</div-->


		</div>
		<figure class="asset-action">
			<AssetDownload :asset="asset" />
		</figure>
	</li>
</template>
<script lang="ts">
import {Component, Prop, Watch} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {getCategoryById} from "~/lib/categories/categories-api";
import Category from "~/modules/categories/components/Category.vue";
import TagList from "~/modules/tags/TagList.vue";
import {Category as CategoryType} from "~/lib/categories/categories-types"
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";

@Component({
	components: {
		AssetLink: AssetLink,
		Category: Category,
		TagList: TagList,
		AssetDownload: AssetDownload
	}
})
class AssetCard extends Vue {
	category : CategoryType | null

	@Prop() asset : Asset

	@Watch('asset.type', {
		immediate: true
	})
	typeChanged () {
		this.category = getCategoryById(this.asset.categoryID)
	}
}
export default AssetCard
</script>
