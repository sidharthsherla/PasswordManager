<template>
    <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
        <div class="rounded-md shadow-sm -space-y-px">
            <input v-model="email" type="email" required placeholder="Email address" class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
            <input v-model="password" type="password" required placeholder="Password" class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
            <input v-model="confirmPassword" type="password" required placeholder="Confirm Password" class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
        </div>
        <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
const emit = defineEmits(['set-token']);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const isLoading = ref(false);
const handleSignup = async () => {
    error.value = '';
    if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        return;
    }
    isLoading.value = true;
    try {
        const res = await api.post('/auth/register', { email: email.value, password: password.value });
        emit('set-token', res.data.token);
    } catch (err) {
        error.value = err.response?.data?.msg || 'Signup failed. Please try again.';
    } finally {
        isLoading.value = false;
    }
};
</script>