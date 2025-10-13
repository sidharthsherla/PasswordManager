<template>
  <div :class="{ 'dark': isDarkMode }" class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans transition-colors duration-300">
    <div v-if="token">
      <Dashboard @logout="handleLogout" :isDarkMode="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    </div>
    <div v-else>
      <AuthPage @set-token="handleSetToken" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AuthPage from './components/AuthPage.vue';
import Dashboard from './components/Dashboard.vue';

const token = ref(localStorage.getItem('token'));
const isDarkMode = ref(true);

onMounted(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});

const handleSetToken = (newToken) => {
  localStorage.setItem('token', newToken);
  token.value = newToken;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  token.value = null;
};

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark', isDarkMode.value);
}
</script>