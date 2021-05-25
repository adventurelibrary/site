<template>
	<article class="user-profile">
		<section class="profile-details">
			<img src="~/assets/coolicons/svg/user/user.svg" class="profile-image">
			<h1 class="username">{{user.username}}</h1>
			<ul class="user-meta">
				<li class="join-date">Date Joined: {{user.joinDate}}</li>
				<li class="status">Status: {{user.status}}</li>
				<li class="asset-count">Assets: {{user.assetCount}}</li>
			</ul>
		</section>
		<nav class="tabs">
			<a href="" class="tab-control active">Assets & Bundles</a>
			<a href="" class="tab-control">History</a>
			<a href="" class="tab-control">Settings</a>
			<a href="" class="button upgrade">Become An Artist</a>
		</nav>
		<section class="tab inventory active">
			<div class="view-toggle">
				<a href="" class="toggle active">My Assets</a>
				<a href="" class="toggle">My Bundles</a>
			</div>
			
			<div class="my-assets"><!-- TODO: My Assets Component --></div>
			<div class="my-bundles">
				<!-- TODO: My Bundles Component -->
				<!-- MyBundleSelector v-model="bundleIds" /-->
			</div>
		</section>
		<section class="tab history">
			<!-- TODO: History Component -->
		</section>
		<section class="tab settings">
			<!-- TODO: Settings Component -->
		</section>
	</article>
</template>
<script lang="ts">
import {Component, State, Vue} from "nuxt-property-decorator";
import {User} from "~/lib/users/user-types"

@Component({
	//middleware: ['require_auth']
})
export default class UserProfile extends Vue {
	//@State('user') user : User
	user : any = {
		id: "id",
		admin: true,
		email: "contact@adventurelibrary.art",
		username: "Name of User",
		joinDate: "2021",
		status: "User",
		assetCount: "15"
	}
}
</script>