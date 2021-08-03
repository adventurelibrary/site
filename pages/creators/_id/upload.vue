<template>
	<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
		<CreatorPage :creator="creator" active-tab="upload">
			<UploadAssets
					:creator="creator"
					:as-admin="false" />
		</CreatorPage>
	</LoadingContainer>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import CreatorsManage from "~/mixins/CreatorsManage";
import CreatorPage from "~/pages/creators/-components/CreatorPage.vue";
import {getCreatorById, newCreator} from "~/modules/creators/creator-api";
import {Creator} from "~/modules/creators/creator-types";
import LoadingContainer from "~/components/LoadingContainer.vue";
import UploadAssets from "~/modules/assets/components/UploadAssets.vue";
@Component({
	components: {
		LoadingContainer,
		CreatorPage,
		UploadAssets: UploadAssets,
	}
})
export default class CreatorsCreatorIndex extends mixins(CreatorsManage) {
	creator : Creator = newCreator()
	async fetch () {
		const creator = await getCreatorById(this.creatorId)
		this.creator = creator
	}
}
</script>
