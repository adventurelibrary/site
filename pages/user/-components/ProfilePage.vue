<template>
	<article class="user-profile" v-if="user">
		<section class="profile-details">
			<img src="~/assets/coolicons/svg/user/user.svg" class="profile-image">
			<h1 class="username">
				{{user.username}}
				<a class="logout-button" @click="logout">Sign out</a>
			</h1>
			
			<ul class="user-meta">
				<li class="join-date">Date Joined: {{user.dateJoined}}</li>
				<li>My Coins: {{numCoins}}</li>

<!--			<li class="status">Status: {{user.status}}</li>-->
<!--			<li class="asset-count">Assets: {{user.assetCount}}</li>-->
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
					:to="{name: 'user-assets'}"
					class="tab-control"
					:class="{active: activeTab === 'assets'}">
				My Assets
			</nuxt-link>
			<nuxt-link
					:to="{name: 'user-purchases'}"
					class="tab-control"
					:class="{active: activeTab === 'purchases'}">
				Purchases
			</nuxt-link>
			<nuxt-link
					v-if="isCreator"
					:to="{name: 'creators'}"
					class="tab-control highlight">
				Creator Area
			</nuxt-link>
			<slot name="actions"></slot>
		</nav>
		<section class="tab active" :class="'tab-' + activeTab">
			<slot></slot>
		</section>
	</article>
  <div v-else>You must be logged in to see this page. <nuxt-link to="/">Back to home page</nuxt-link> or <nuxt-link :to="{name: 'login'}">login</nuxt-link></div>
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
	@State('user') user : User | null
	@State('userCoins') numCoins : number
	@Prop() activeTab : string

	async logout () {
		await this.$store.dispatch('logout')
		this.notifySuccess('Logged out')
		this.$router.push('/')
	}
}
</script>
