<template>
	<LoadingContainer :loading="$fetchState.pending" :error="$fetchState.error">
		<template v-if="creator.id">
			<CreatorPage :creator="creator">
				<template v-if="creator">
					Welcome to management for {{creator.name}}
				</template>
			</CreatorPage>
		</template>
	</LoadingContainer>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import CreatorsManage from "~/mixins/CreatorsManage";
import CreatorPage from "~/pages/creators/-components/CreatorPage.vue";
import {getManageCreatorById, newCreator} from "~/modules/creators/creator-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {Creator} from "~/modules/creators/creator-types";
@Component({
	components: {
		LoadingContainer,
		CreatorPage
	}
})
export default class CreatorsCreatorIndex extends mixins(CreatorsManage) {
	public creator : Creator = newCreator()
	async fetch () {
		const creator = await getManageCreatorById(this.creatorId)
		this.creator = creator
		console.log('creator', creator)
	}
}
</script>
