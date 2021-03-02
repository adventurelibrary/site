<template>
  <div>
		<Head>
			<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
		</Head>
    <div id="header">
      <NuxtLink class="brand" :to="{name: 'index'}">Adventure Library</NuxtLink>
      <nav>
        <ul>
          <li><nuxt-link :to="{name: 'assets'}">Assets</nuxt-link></li>
          <li><nuxt-link :to="'/'">Creators</nuxt-link></li>
          <li><NuxtLink to="/mockups/filler">Adventure!</NuxtLink></li>
        </ul>
      </nav>
    </div>
    <div id="content">
      <Nuxt />
    </div>
  </div>
</template>

<!--style>
body {
  padding: 0px;
  margin: 0px;
  font-family: Arial, sans-serif;
	line-height: 1.4;
	font-size: 14px;
}

h1, h2, h3, h4, h5, h6 {
	margin: 0px;
	padding: 0px;
}

ul, ol {
	margin: 0px;
	padding: 0px;
}

#header {
  padding: 0em;
  background: #333;
  display: flex;
  align-items: center;
}

#header a {
  color: #fff;
  text-decoration: none;
}

#header a.brand {
  font-size: 18px;
  color: #ff4500;
  margin-right: 10px;
  padding: 1em;
}

#header nav ul {
  padding: 0px;
  margin: 0px;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

#header nav ul li a {
  padding: 0.5em 1em;
}

#content .container {
  max-width: 1020px;
  margin: 0 auto;
}
</style-->
