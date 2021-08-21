<template>
	<UploadAssets
		:creator="creator"
		:as-admin="false" />
</template>
<script lang="ts">

import {Component, Vue} from "nuxt-property-decorator";
import UploadAssets from "~/modules/assets/components/UploadAssets.vue";
import {Context} from "@nuxt/types";
import {getManageCreatorById, newCreatorAjax} from "~/modules/creators/creator-api";
import {Creator} from "~/modules/creators/creator-types";

@Component({
	components: {
		UploadAssets: UploadAssets,
	}
})
export default class UploadPage extends Vue {
	creatorAjax = newCreatorAjax()

	// fetching asset data and related assets array
	async asyncData (ctx: Context) {
		const creatorAjax = newCreatorAjax()
		try {
			const creator = await getManageCreatorById(ctx.route.params.id)
			creatorAjax.data = creator
		} catch (ex) {
			creatorAjax.error = ex
		}
		creatorAjax.loading = false
		return {
			creatorAjax
		}
	}

	get creator() : Creator | undefined {
		return this.creatorAjax.data
	}
}
</script>
