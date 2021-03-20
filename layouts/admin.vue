<template>
  <main class="admin-layout">
    <header class="admin-header">
      Admin Header
			<div>
				<NuxtLink :to="{name: 'admin-assets'}">Assets</NuxtLink>
				<NuxtLink :to="{name: 'admin-assets-upload'}">Upload</NuxtLink>
			</div>
    </header>
    <main class="">
      <Nuxt />
    </main>
  </main>
</template>
<style>
.admin-layout {
	max-width: 960px;
	margin: 1em auto;
}
</style>
