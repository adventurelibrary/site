<template>
	<article class="user-profile">
		<section class="profile-details">
			<img src="~/assets/coolicons/svg/user/user.svg" class="profile-image">
			<h1 class="username">{{user.username}}</h1>
			<ul class="user-meta">				
				<li class="join-date">Date Joined: {{user.dateJoined}}</li>
				<li>My Coins: {{numCoins}}</li>
<!--				<li class="status">Status: {{user.status}}</li>-->
<!--				<li class="asset-count">Assets: {{user.assetCount}}</li>-->
			</ul>
		</section>
		<nav class="tabs">
			<nuxt-link
					:to="{name: 'user'}"
					class="tab-control"
					:class="{active: activeTab === 'settings'}">
				Settings
			</nuxt-link>
			<nuxt-link
					:to="{name: 'user-bundles'}"
					class="tab-control"
					:class="{active: activeTab === 'bundles'}">
				My Bundles
			</nuxt-link>
			<nuxt-link
					v-if="user.is_creator"
					:to="{name: 'user-assets'}"
					class="tab-control"
					:class="{active: activeTab === 'assets'}">
				My Assets
			</nuxt-link>
			<nuxt-link
					:to="{name: 'user-info'}"
					class="tab-control"
					:class="{active: activeTab === 'info'}">
				Information
			</nuxt-link>			
			<slot name="actions"></slot>
		</nav>
		<section class="tab active">
			<slot></slot>
		</section>
	</article>
</template>
<script lang="ts">
import {Component, State, Vue, Prop, Getter} from "nuxt-property-decorator";
import {User} from "~/modules/users/user-types"

// This component is like a mini-layout for the routes at `/user/XXX`
// It accepts a slot for the specific page's content
@Component({
	middleware: ['require_auth']
})
export default class ProfilePage extends Vue {
	@Getter('isCreator') isCreator : boolean
	@State('user') user : User
	@State('userCoins') numCoins : number
	@Prop() activeTab : string
}
</script>
