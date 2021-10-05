<template>
	<ul class="search-results">
		<AssetCard v-for="asset in assets" :asset="asset" :key="asset.slug" />
	</ul>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "nuxt-property-decorator";
import {Asset} from "../asset-types";
import AssetCard from "~/modules/assets/components/AssetCard.vue";
@Component({
	components: {
		AssetCard
	}
})
export default class AssetList extends Vue {
	@Prop() assets : Asset[]
}
</script>
