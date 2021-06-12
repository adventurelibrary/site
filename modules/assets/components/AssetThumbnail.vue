<template>
	<div class="asset-thumbnail thumbnail" :style="`background-image: url(${asset.thumbnail});`">
		<!-- This Element Intentionally Left Empty -->
	</div>
</template>
<script lang="ts">

import {Component, Prop, Vue} from "nuxt-property-decorator";
import {Asset} from "~/lib/assets/asset-types";

@Component
export default class AssetThumbnail extends Vue {
	@Prop() asset : Asset
}
</script>
