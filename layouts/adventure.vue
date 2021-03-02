<template>
  <main>
    <header class="site-header">
      <figure class="logo">
        <NuxtLink class="brand" :to="{name: 'index'}">Adventure Library</NuxtLink>
      </figure>
      <div class="searchbar">
        <input type="text" name="serach">
      </div>
      <div class="account-actions">
        <a class="logout-button">Logout</a>
        <figure class="member-avatar"></figure>
        <a class="account-link">My Account</a>
      </div>
      <nav class="main-navigation">
        <ul>
          <li><a href="">About Us</a></li>
          <li><a href="">Purchase Coins</a></li>
          <li><NuxtLink to="/mockups/filler">Filler</NuxtLink></li>
        </ul>
      </nav>
    </header>
    <main>
      <header class="page-header">
        <h1>Page Title</h1>
        <h2>Page call to action / subtitle.</h2>
      </header>
      <main class="page-body">
        <Nuxt />
      </main>
    </main>
    <footer>
      <h1>Adventure Library</h1>
      <p>Copyright text</p>
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