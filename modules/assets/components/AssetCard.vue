<template>
	<div class="asset-card">
		<div class="thumbnail" :style="`background-image: url(${asset.thumbnailSrc});`">
		</div>
		<div class="meta">
			<h3><AssetLink :asset="asset">{{asset.name}}</AssetLink></h3>
			<div>
				{{asset.description}}
			</div>
			<div>
				<Category :category-id="asset.categoryID" />
				<TagList :tags="asset.tags" />
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Prop, Watch} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/lib/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {getCategoryById} from "~/lib/categories/categories-api";
import Category from "~/modules/categories/components/Category.vue";
import TagList from "~/modules/tags/TagList.vue";

@Component({
	components: {
		AssetLink: AssetLink,
		Category: Category,
		TagList: TagList
	}
})
class AssetCard extends Vue {
	category : AssetCategory | null

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
<style>
.asset-card {
	display: flex;
	align-items: flex-start;
	padding: 0.25em;
	border: 1px solid #ccc;
}

.asset-card .thumbnail {
	background: #ccc;
	border: 1px solid #333;
	width: 100px;
	height: 100px;
	flex: 0 0 100px;
	background-size: cover;
	background-position: center;
}

.asset-card .meta {
	margin-left: 0.75em;
}
</style>
