<template>
	<SelectGroup
		:label="label"
		:options="userOptions"
		v-model="user_id"
		/>
</template>
<script lang="ts">
import {Component, VModel, Prop, Vue} from "nuxt-property-decorator";
import {computeAjaxList, doAjax, newAjax} from "~/lib/ajax";
import {User, UsersResponse} from "~/modules/users/user-types";
import {getUsers} from "~/modules/users/user-api";
import {SelectOption} from "~/lib/helpers";
import SelectGroup from "~/components/forms/SelectGroup.vue";

@Component({
	components: {
		SelectGroup: SelectGroup
	}
})
export default class UserSelect extends Vue {
	usersAjax = newAjax<UsersResponse>({
		total: 0,
		users: []
	})

	@Prop({
		default: 'User'
	}) label : string


	@VModel({ type: String }) user_id!: string

	async created () {
		await this.loadUsers()
	}

	async loadUsers () {
		await doAjax<UsersResponse>(this.usersAjax, async () => {
			return await getUsers()
		})
	}

	get userOptions () : SelectOption[] {
		const users = computeAjaxList(this.usersAjax, 'users')
		return users.map((user) => {
			return {
				label: user.username,
				value: user.id
			}
		})
	}

}
</script>
