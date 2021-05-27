<template>
	<div>
		<!-- Default user details and links -->
		<div v-if="user">
			<h2>Account Information</h2>			
			Username: {{user.username}}<br/>
			Public name: ---<br/>
			My coins: 0<br/>			
			<nuxt-link :to="{name: 'account-purchase-history'}">Purchase History</nuxt-link><br/>
			<nuxt-link :to="{name: 'account-change-password'}">Change Password</nuxt-link>
		</div>

		<!-- Creator user details and links -->
		<div v-if="user.creator==true">
			<h2>Creator Section</h2>
			<h3>Assets</h3>
			<nuxt-link :to="{name: 'assets?search=by%3A%20adminuser'}">View my assets</nuxt-link><br/>
			Create new asset<br/>
			<h3>Bundles</h3>
			<nuxt-link :to="{name: 'my-bundles'}">View my bundles</nuxt-link><br/>
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
