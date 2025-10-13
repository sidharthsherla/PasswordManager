<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800/50 p-6 flex flex-col justify-between shadow-lg">
      <div>
        <div class="flex items-center space-x-3 mb-10">
          <Shield class="h-8 w-8 text-indigo-500" />
          <span class="text-2xl font-bold text-gray-800 dark:text-white">PassGuard</span>
        </div>
        <nav>
          <button @click="activePage = 'vault'" :class="['w-full flex items-center px-4 py-2 rounded-lg', { 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700': activePage === 'vault', 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700': activePage !== 'vault' }]">
            <Lock class="h-5 w-5 mr-3" />
            Vault
          </button>
          <button @click="activePage = 'profile'" :class="['w-full flex items-center px-4 py-2 mt-2 rounded-lg', { 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700': activePage === 'profile', 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700': activePage !== 'profile' }]">
            <User class="h-5 w-5 mr-3" />
            Profile
          </button>
        </nav>
      </div>
      <div class="space-y-2">
        <button @click="$emit('toggle-dark-mode')" class="w-full flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
          <component :is="isDarkMode ? Sun : Moon" class="h-5 w-5 mr-3" />
          {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <button @click="$emit('logout')" class="w-full flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
          <LogOut class="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">
      <div v-if="activePage === 'vault'">
        <header class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Your Vault</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Securely manage all your passwords in one place.</p>
        </header>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-2 relative">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input v-model="searchTerm" type="text" placeholder="Search by website name..." class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <AddPasswordModal @password-added="handlePasswordAdded" />
        </div>
        <PasswordList :passwords="filteredPasswords" :is-loading="isLoading" @password-deleted="handlePasswordDeleted" />
      </div>
      <div v-if="activePage === 'profile'">
        <ProfilePage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { Shield, Lock, Sun, Moon, LogOut, Search, User } from 'lucide-vue-next';
import api from '../services/api';
import PasswordList from './PasswordList.vue';
import AddPasswordModal from './AddPasswordModal.vue';

const ProfilePage = defineAsyncComponent(() => import('./ProfilePage.vue'));

defineProps({ isDarkMode: Boolean });
defineEmits(['logout', 'toggle-dark-mode']);

const passwords = ref([]);
const isLoading = ref(true);
const searchTerm = ref('');
const activePage = ref('vault');

const fetchPasswords = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/passwords');
    passwords.value = res.data;
  } catch (error) {
    console.error("Failed to fetch passwords", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPasswords);

const filteredPasswords = computed(() =>
  passwords.value.filter(p =>
    p.website_name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);
const handlePasswordAdded = (newPassword) => {
  passwords.value.unshift(newPassword);
};
const handlePasswordDeleted = (deletedId) => {
  passwords.value = passwords.value.filter(p => p.password_id !== deletedId);
};
</script>