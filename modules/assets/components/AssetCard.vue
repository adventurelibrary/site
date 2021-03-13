<template>
	<div class="asset">
		<div class="thumbnail" :style="`background-image: url(${asset.thumbnailSrc});`">
		</div>
		<div class="meta">
			<h3><AssetLink :asset="asset">{{asset.title}}</AssetLink></h3>
			<div>
				{{asset.description}}
			</div>
			<div>
				<span class="badge badge-primary">{{type.singular}}</span><span class="badge badge-success ml-1" v-for="(tag, idx) in asset.tags">
					{{tag.label}}
				</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Prop, Watch} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset, AssetType} from "~/lib/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {getAssetType} from "~/lib/assets/asset-helpers";

@Component({
	components: {
		AssetLink: AssetLink
	}
})
class AssetCard extends Vue {
	type : AssetType | null

	@Prop() asset : Asset

	@Watch('asset.type', {
		immediate: true
	})
	typeChanged () {
		this.type = getAssetType(this.asset.type)
	}
}
export default AssetCard
</script>
<style>
.asset {
	display: flex;
	align-items: flex-start;
	padding: 0.25em;
	border: 1px solid #ccc;
}

.asset .thumbnail {
	background: #ccc;
	border: 1px solid #333;
	width: 100px;
	height: 100px;
	flex: 0 0 100px;
	background-size: cover;
	background-position: center;
}

.asset .meta {
	margin-left: 0.75em;
}
</style>
