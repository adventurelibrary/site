<template>
	<div class="card">
		<div class="card-header">
			Add a Creator
		</div>
		<div class="card-body">
			<form @submit="submit">
				<FormErrors :error="form.error" />
				<CreatorFields v-model="form.data" />
				<div>
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import AdminPage from "~/admin/admin-page";
import {Creator} from "~/modules/creators/creator-types";
import {
	addCreator,
	creatorToFormData, getCreatorById,
	newCreatorAjax, saveCreator,
} from "~/modules/creators/creator-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import CreatorFields from "~/modules/creators/components/CreatorFields.vue";
import FormMixin from "~/mixins/Forms.vue";


@Component({
	components: {
		LoadingContainer: LoadingContainer,
		CreatorFields: CreatorFields
	}
})
export default class NewCreatorPage extends mixins(AdminPage, FormMixin) {

	head () {
		return {
			title: 'Add a Creator',
		}
	}

	validateForm(): string {
		if (!this.form.data.name) {
			return 'Name is required'
		}
		return ''
	}

	async formAction () {
		const id = await addCreator(this.form.data)
		this.notifySuccess('Creator added')
		this.$router.push({
			name: 'admin-creators-id',
			params: {
				id: id
			}
		})
	}

	async asyncData (ctx: Context) {
		const creatorAjax = newCreatorAjax()
		let data : any = {}
		try {
			const creator = await getCreatorById(ctx.route.params.id)
			creatorAjax.data = creator
			data = creatorToFormData(creator)
		} catch (ex) {
			creatorAjax.error = ex
		}
		creatorAjax.loading = false
		return {
			creatorAjax: creatorAjax,
			data: data,
			form: {
				data
			},
			id: ctx.params.id
		}
	}

	deleteCreator () {
		if (prompt('Type DELETE to delete creator') !== 'DELETE') {
			return
		}

		this.notifySuccess('Creator deleted (but not really yet)')
	}
}
</script>
