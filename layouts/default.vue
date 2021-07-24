<template>
<main class="body" :class="pageClass">
		<div class="shade"
			:visible="this.shade"
			v-on:click="hideOverlays()">
		</div>
		<header class="site-header">
			<NuxtLink class="branding" :to="{name: 'index'}">
				<h1 class="site-name">Adventure Library</h1>
			</NuxtLink>

			<AssetSearchRouter :visible="overlays.search"/>

			<button class="search-button"
				v-on:click="overlays.search = true">
				<i class="ci-search" title="Search"></i>
			</button>
			<button class="menu-button"
				v-on:click="overlays.menu = !overlays.menu">
				<i class="ci-hamburger" title="Menu"></i>
			</button>

			<ul class="main-navigation" :visible="this.overlays.menu">
				<li class="account-actions">
					<template v-if="isLoggedIn">
						<UserCoins />
						<a class="logout-button" @click="logout">Logout</a>
						<figure class="member-avatar">
							<i class="ci-user"></i>
							<!--img src="https://avatars.githubusercontent.com/u/1721836?v=4" alt="User Avatar"-->
						</figure>
						<nuxt-link :to="{name: 'user'}" class="account-link">{{user.username}}</nuxt-link>
					</template>
					<template v-else>
						<a @click="openLogin">Login</a>
						<a @click="openRegister">Register</a>
					</template>
				</li>
				<li><nuxt-link :to="{name: 'info-about-us'}">About Us</nuxt-link></li>
				<li><nuxt-link :to="{name: 'buy-coins'}">Buy Coins</nuxt-link></li>
				<li v-if="isLoggedIn"><nuxt-link :to="{name: 'user-bundles'}">My Bundles</nuxt-link></li>
				<li v-if="isCreator"><nuxt-link :to="{name: 'user-assets'}">My Assets</nuxt-link></li>
			</ul>
		</header>
		<main class="site-body">
			<Nuxt />
		</main>
		<footer class="site-footer">
			<!--h1 class="footer-heading">Adventure Library</h1-->
			<img class="footer-heading"
				src="https://cdn.discordapp.com/attachments/808965286915997726/833745227872337960/logo_wip_1line.svg">
			<p class="copyright-notice">Copyright ©{{new Date().getFullYear()}} Adventure Library</p>
			<nav class="footer-links">
				<ul>
					<li><nuxt-link :to="{name: 'info-about-us'}">About Us</nuxt-link></li>
					<li><nuxt-link :to="{name: 'info-terms-of-service'}">Terms of Service</nuxt-link></li>
					<li><nuxt-link :to="{name: 'info-faq'}">FAQ</nuxt-link></li>
					<li><nuxt-link :to="{name: 'info-feedback-and-support'}">Feedback &amp; Support</nuxt-link></li>
					<li><nuxt-link :to="{name: 'info-contact-us'}">Contact Us</nuxt-link></li>
				</ul>
			</nav>
			<section class="social-media">
				<ul>
					<li>
						<a href="https://www.facebook.com/The-Adventure-Library-103147418541648"
							title="Facebook">
							<i class="ci-facebook"></i>
						</a>
					</li>
					<li>
						<a href="https://twitter.com/TheAdvLibrary"
							title="Twitter">
							<i class="ci-twitter"></i>
						</a>
					</li>
					<li>
						<a href="https://www.instagram.com/theadvlibrary/"
							title="Instagram">
							<i class="ci-instagram"></i>
						</a>
					</li>
					<li>
						<a href="https://discord.gg/cqTFTgpmHN"
							title="Discord">
							<i class="ci-discord"></i>
						</a>
					</li>
					<li>
						<a href="https://tinyletter.com/AdventureLibrary"
							title="Newsletter">
							<i class="ci-mail"></i>
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
import {Component, Getter, State, Watch} from "nuxt-property-decorator";
import {Toast} from "~/store";
import Modals from "~/modules/modals/Modals.vue";
import {User} from "~/modules/users/user-types"
import {UserTracking} from "~/modules/users/user-tracking"
import UserCoins from "~/modules/users/components/UserCoins.vue";

@Component({
	components: {
		AssetSearchRouter: AssetSearchRouter,
		Modals: Modals,
		UserCoins: UserCoins
	}
})
export default class Default extends Vue {
	pageClass = ''

	@State('toasts') toasts : Toast[]
	@State('user') user : User
	@State('userTracking') userTracking : UserTracking
	@Getter('isLoggedIn') isLoggedIn: boolean
	@Getter('isCreator') isCreator : boolean
	@State(state => state.login.working) loginWorking : boolean

	// Returns the name of the page as a CSS selector we can apply to the <main /> component
	@Watch('$route', {
		immediate: true
	})
	watchRouter () {
		const name = this.$router.currentRoute.name
		this.pageClass = 'page-' + name
	}

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

	setTrackingPath () {
		this.$store.dispatch('userTrackingPath', this.$router.currentRoute.fullPath)
	}

	openLogin () {
		this.setTrackingPath()

		this.$store.dispatch('openLoginModal')
	}

	openRegister () {
		this.setTrackingPath()

		this.$store.dispatch('openRegisterModal')
	}


	async logout () {
		this.setTrackingPath()

		await this.$store.dispatch('logout')
		this.notifySuccess('Logged out')
	}
}
</script>
