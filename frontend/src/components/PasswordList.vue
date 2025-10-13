<template>
  <div v-if="isLoading" class="text-center p-8">Loading passwords...</div>
  <div v-else-if="passwords.length === 0" class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">
    <h3 class="text-xl font-semibold">Vault is Empty</h3>
    <p class="text-gray-500 dark:text-gray-400 mt-2">Click "Add New Password" to get started.</p>
  </div>
  <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    <ul class="divide-y divide-gray-200 dark:divide-gray-700">
      <PasswordItem v-for="p in passwords" :key="p.password_id" :password-data="p" @password-deleted="$emit('password-deleted', p.password_id)" />
    </ul>
  </div>
</template>

<script setup>
import PasswordItem from './PasswordItem.vue';
defineProps({
  passwords: Array,
  isLoading: Boolean,
});
defineEmits(['password-deleted']);
</script>
