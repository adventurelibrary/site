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
				<a class="logout-button">Logout</a>
				<figure class="member-avatar">
					<i class="ci-user"></i>
					<!--img src="https://avatars.githubusercontent.com/u/1721836?v=4" alt="User Avatar"-->
				</figure>
				<a class="account-link">My Account</a>
			</div>
			<ul class="main-navigation" :visible="this.overlays.menu">
				<li><a href="">About Us</a></li>
				<li><a href="">Purchase Coins</a></li>
				<li><NuxtLink to="/mockups/filler">Filler Mockup</NuxtLink></li>
				<li><NuxtLink to="/mockups/search">Searchbar Mockup</NuxtLink></li>
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
					<li><a href=""><img src="" alt="Facebook"></a></li>
					<li><a href=""><img src="" alt="Twitter"></a></li>
					<li><a href=""><img src="" alt="Instagram"></a></li>
				</ul>
			</section>
		</footer>
	</main>
</template>
<script lang="ts">
import Vue from "vue"
import AssetSearchRouter from "~/modules/assets/components/search/AssetSearchRouter.vue";
import {Component} from "nuxt-property-decorator";
@Component({
	components: {
		AssetSearchRouter: AssetSearchRouter,
	}
})
export default class Default extends Vue {
	overlays: { [s: string]: boolean; } = {
		search: false,
		menu: false
	}
	searchVisible = false;
	menuVisible = false;

	get shade() {
		return Object.values(this.overlays).some(o => o);
	}

	hideOverlays() {
		Object.keys(this.overlays).forEach(o => this.overlays[o] = false);
		console.debug(this.overlays);
	}
}
</script>
