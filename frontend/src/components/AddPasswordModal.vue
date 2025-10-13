<template>
  <div>
    <button @click="isOpen = true" class="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
      <Plus class="h-5 w-5 mr-2" />
      Add New Password
    </button>
    
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h3 class="text-2xl font-bold mb-6">Add New Credential</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
          <input v-model="form.website_name" type="text" placeholder="Website Name" required class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input v-model="form.username" type="text" placeholder="Username or Email" required class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <div class="relative">
            <input v-model="form.password" type="text" placeholder="Password" required class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="button" @click="generatePassword" class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-indigo-500">
              <KeyRound class="h-5 w-5" />
            </button>
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Plus, KeyRound } from 'lucide-vue-next';
import api from '../services/api';

const emit = defineEmits(['password-added']);
const isOpen = ref(false);
const form = reactive({ website_name: '', username: '', password: '' });
const error = ref('');

const resetForm = () => {
    form.website_name = '';
    form.username = '';
    form.password = '';
    error.value = '';
}

const closeModal = () => {
    isOpen.value = false;
    resetForm();
}

const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let newPassword = '';
    for (let i = 0; i < 16; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.password = newPassword;
};

const handleSubmit = async () => {
    error.value = '';
    try {
        const res = await api.post('/passwords', form);
        emit('password-added', res.data);
        closeModal();
    } catch (err) {
        error.value = 'Failed to add password.';
    }
};
</script>

