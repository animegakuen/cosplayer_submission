<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/cosplayers">Cosplayers</RouterLink>
      <RouterLink to="/submit">Submit cosplayer</RouterLink>
      <RouterLink to="/jury">Jury</RouterLink>
    </nav>
  </header>

  <div style="height: 90%; width: 90%;">
    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
}

a {
  padding: 3px 15px;
}
</style>
