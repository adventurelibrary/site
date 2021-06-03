<template>
	<CCard>
		<CCardHeader>
			Edit Creator {{creator.name}}
		</CCardHeader>
		<CCardBody>
			<LoadingContainer :loading="creatorAjax.loading" :error="creatorAjax.error">
				<form @submit="submit">
					<FormErrors :error="form.error" />
					<CreatorFields v-model="form.data" />
					<div>
						<CButton type="button" color="danger" style="float: right;" @click="deleteCreator">Delete</CButton>
						<CButton type="submit" color="primary">Submit</CButton>
					</div>
				</form>
			</LoadingContainer>
		</CCardBody>
	</CCard>
</template>
<script lang="ts">
import {Component, mixins} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import AdminPage from "~/admin/admin-page";
import {Creator} from "~/modules/creators/creator-types";
import {
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
export default class EditCreatorPage extends mixins(AdminPage, FormMixin) {
	public creatorAjax = newCreatorAjax()
	public id : string

	head () {
		const creator = this.creator
		if (creator == null) {
			return {
				title: '404 Creator',
				description: ''
			}
		}
		return {
			title: creator.name + ' - Creator',
		}
	}

	get creator () : Creator | null {
		if (this.creatorAjax.loading || this.creatorAjax.error || !this.creatorAjax.data) {
			return null
		}

		return this.creatorAjax.data
	}

	validateForm(): string {
		if (!this.form.data.name) {
			return 'Name is required'
		}
		return ''
	}

	async formAction () {
		await saveCreator(this.id, this.form.data)
		this.notifySuccess('Creator saved')
	}

	async asyncData (ctx: Context) {
		const creatorAjax = newCreatorAjax()
		let data : any = {}
		try {
			const creator = await getCreatorById(ctx.route.params.id)
			console.log('gotted', creator)
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
