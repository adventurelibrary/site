<template>
	<main class="body">
		<div class="shade"
			:visible="this.shade"
			v-on:click="hideOverlays()">
		</div>
		<header class="site-header">
			<figure class="logo">
				<NuxtLink class="brand" :to="{name: 'index'}">
					<img alt="Adventure Library"
						src="https://cdn.discordapp.com/attachments/808965286915997726/822728272654630972/al-logo-white.png"
						>
				</NuxtLink>
			</figure>
			<h1 class="site-name">Adventure Library</h1>

			<AssetSearchRouter :visible="overlays.search"/>

			<button class="search-button"
				v-on:click="overlays.search = true">
				Search
			</button>
			<button class="menu-button"
				v-on:click="overlays.menu = true">
				Menu
			</button>

			<div class="account-actions">
				<div v-if="isLoggedIn">
					<a class="logout-button" @click="logout">Logout</a>
					<figure class="member-avatar">
						<i class="ci-user"></i>
						<!--img src="https://avatars.githubusercontent.com/u/1721836?v=4" alt="User Avatar"-->
					</figure>
					<nuxt-link :to="{name: 'login'}" class="account-link">{{user.username}}</nuxt-link>
				</div>
				<div v-else>
					<a @click="openLogin">Login</a>
					<a @click="openRegister">Register</a>
				</div>
			</div>
			<ul class="main-navigation" :visible="this.overlays.menu">
				<li><a href="">About Us</a></li>
				<li><a href="">Purchase Coins</a></li>
				<li><NuxtLink to="/mockups/filler">Filler Mockup</NuxtLink></li>
			</ul>
		</header>
		<main class="site-body">
			<Nuxt />
		</main>
		<footer class="site-footer">
			<h1 class="footer-heading">Adventure Library</h1>
			<p class="copyright-notice">Copyright text</p>
			<nav class="footer-links">
				<ul>
					<li><a href="">Link 1</a></li>
					<li><a href="">Link 2</a></li>
					<li><a href="">Link 3</a></li>
					<li><a href="">Link 4</a></li>
					<li><a href="">Link 5</a></li>
				</ul>
			</nav>
			<section class="social-media">
				<ul>
					<li>
						<a href="">
							<i class="ci-facebook"></i>
						</a>
					</li>
					<li>
						<a href="">
							<i class="ci-twitter"></i>
						</a>
					</li>
					<li>
						<a href="">
							<i class="ci-instagram"></i>
						</a>
					</li>
				</ul>
			</section>
		</footer>
		<div class="toast-msgs">
			<div v-for="toast in toasts" :key="toast.id" class="toast-msg" :class="toast.type">
				{{toast.msg}}
			</div>
		</div>
		<Modals />
	</main>
</template>
<script lang="ts">
import Vue from "vue"
import AssetSearchRouter from "~/modules/assets/components/search/AssetSearchRouter.vue";
import {Component, Getter, State} from "nuxt-property-decorator";
import {Toast} from "~/store";
import Modals from "~/modules/modals/Modals.vue";
import {User} from "~/lib/users/user-types"

@Component({
	components: {
		AssetSearchRouter: AssetSearchRouter,
		Modals: Modals
	}
})
export default class Default extends Vue {
	@State('toasts') toasts : Toast[]
	@State('user') user : User
	@Getter('isLoggedIn') isLoggedIn: boolean
	@State(state => state.login.working) loginWorking : boolean

	overlays: { [s: string]: boolean; } = {
		search: false,
		menu: false
	}
	searchVisible = false;
	menuVisible = false;

	mounted () {
		this.loadSession()
	}

	async loadSession () {
		if (!process.client) {
			return
		}
		try {
			await this.$store.dispatch('fetchSession')
		} catch (ex) {
			this.notifyError('Error loading session')
		}
	}

	get shade() {
		return Object.values(this.overlays).some(o => o);
	}

	hideOverlays() {
		Object.keys(this.overlays).forEach(o => this.overlays[o] = false);
		console.debug(this.overlays);
	}

	openLogin () {
		this.$store.dispatch('openLoginModal')
	}

	openRegister () {
		this.$store.dispatch('openRegisterModal')
	}


	async logout () {
		await this.$store.dispatch('logout')
		this.notifySuccess('Logged out')
	}
}
</script>
