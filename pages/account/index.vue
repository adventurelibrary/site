<template>
	<div>
		<!-- Default user details and links -->
		<div v-if="user">
			<h2>Account Information</h2>			
			Username: {{user.username}}<br/>
			My coins: <br/>
			<nuxt-link :to="{name: 'account-change-password'}">Change Password</nuxt-link>
		</div>

		<!-- Creator user details and links -->
		<div v-if="user.creator==true">
			<h2>Creator Section</h2>
			<h3>Assets</h3>
			View my assets<br/>
			Create new asset<br/>
			<h3>Bundles</h3>
			View my bundles
			Create new bundle
		</div>

		<!-- Admin user details and links -->
		<div v-if="user.admin==true">
			<h2>Administrator Section</h2>
			User to Creator<br/>
			Creator to User<br/>
			Creator to Admin<br/>
			Admin to Creator<br/>
		</div>
	</div>
</template>


<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"

@Component({
	middleware: ['require_auth']
})
export default class ChangePassword extends Vue {
	@State('user') user : User
	

}
</script>
