<template>
	<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
		<CreatorPage :creator="creator">
			<template v-if="creator">
				Welcome to management for {{creator.name}}
			</template>
		</CreatorPage>
	</LoadingContainer>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import CreatorsManage from "~/mixins/CreatorsManage";
import CreatorPage from "~/pages/creators/-components/CreatorPage.vue";
import {getCreatorById} from "~/modules/creators/creator-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
@Component({
	components: {
		LoadingContainer,
		CreatorPage
	}
})
export default class CreatorsCreatorIndex extends mixins(CreatorsManage) {
	creator : Creator | undefined
	async fetch () {
		const creator = await getCreatorById(this.creatorId)
		this.creator = creator
	}
}
</script>
