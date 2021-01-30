<template>
	<div class="asset">
		<div class="thumbnail">

		</div>
		<div class="meta">
			<h3><AssetLink :asset="asset">{{asset.title}}</AssetLink></h3>
			<h6 v-if="type">{{type.singular}}</h6>
			<div>
				{{asset.description}}
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Prop, Watch} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset, AssetType} from "adventurelibrary/dist/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {getAssetType} from "adventurelibrary/dist/assets/asset-helpers";

@Component({
	components: {
		AssetLink: AssetLink
	}
})
class AssetListing extends Vue {
	type : AssetType | null

	@Prop() asset : Asset

	@Watch('asset.type', {
		immediate: true
	})
	typeChanged () {
		console.log('asset type', this.asset.type)
		this.type = getAssetType(this.asset.type)
	}
}
export default AssetListing
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
}

.asset .meta {
	margin-left: 0.75em;
}
</style>
