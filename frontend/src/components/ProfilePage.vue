<template>
    <div>
        <header class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">Manage your account details and security.</p>
        </header>

        <div class="space-y-8">
            <!-- Update Email Form -->
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center mb-6">
                    <Mail class="h-6 w-6 text-indigo-500 mr-3" />
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Change Email Address</h2>
                </div>
                
                <form @submit.prevent="updateEmail" class="space-y-4 max-w-md">
                    <!-- Status Message -->
                    <div v-if="emailStatus.message" 
                         :class="[
                           'px-4 py-3 rounded-lg text-sm font-medium',
                           emailStatus.isError 
                             ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' 
                             : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                         ]">
                        {{ emailStatus.message }}
                    </div>

                    <div>
                        <label for="newEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Email Address
                        </label>
                        <input 
                            v-model="emailForm.newEmail" 
                            type="email" 
                            id="newEmail" 
                            required 
                            :disabled="emailForm.isLoading"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            placeholder="Enter your new email address"
                        />
                    </div>

                    <div>
                        <label for="currentPasswordForEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password <span class="text-red-500">*</span>
                        </label>
                        <input 
                            v-model="emailForm.currentPassword" 
                            type="password" 
                            id="currentPasswordForEmail" 
                            required 
                            :disabled="emailForm.isLoading"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            placeholder="Enter current password to verify"
                        />
                    </div>

                    <button 
                        type="submit" 
                        :disabled="emailForm.isLoading || !emailForm.newEmail || !emailForm.currentPassword"
                        class="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Loader2 v-if="emailForm.isLoading" class="animate-spin h-5 w-5 mr-2" />
                        {{ emailForm.isLoading ? 'Updating Email...' : 'Update Email' }}
                    </button>
                </form>
            </div>

            <!-- Update Password Form -->
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="flex items-center mb-6">
                    <Lock class="h-6 w-6 text-indigo-500 mr-3" />
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                </div>
                
                <form @submit.prevent="updatePassword" class="space-y-4 max-w-md">
                    <!-- Status Message -->
                    <div v-if="passwordStatus.message" 
                         :class="[
                           'px-4 py-3 rounded-lg text-sm font-medium',
                           passwordStatus.isError 
                             ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' 
                             : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                         ]">
                        {{ passwordStatus.message }}
                    </div>

                    <div>
                        <label for="currentPasswordForPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password <span class="text-red-500">*</span>
                        </label>
                        <input 
                            v-model="passwordForm.currentPassword" 
                            type="password" 
                            id="currentPasswordForPassword" 
                            required 
                            :disabled="passwordForm.isLoading"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            placeholder="Enter your current password"
                        />
                    </div>

                    <div>
                        <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password <span class="text-red-500">*</span>
                        </label>
                        <input 
                            v-model="passwordForm.newPassword" 
                            type="password" 
                            id="newPassword" 
                            required 
                            :disabled="passwordForm.isLoading"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            placeholder="Enter your new password"
                        />
                    </div>

                    <div>
                        <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password <span class="text-red-500">*</span>
                        </label>
                        <input 
                            v-model="passwordForm.confirmNewPassword" 
                            type="password" 
                            id="confirmNewPassword" 
                            required 
                            :disabled="passwordForm.isLoading"
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                            placeholder="Confirm your new password"
                        />
                    </div>

                    <!-- Password strength indicator (optional) -->
                    <div v-if="passwordForm.newPassword" class="text-sm">
                        <div class="flex items-center space-x-2">
                            <div class="flex space-x-1">
                                <div v-for="i in 4" :key="i" 
                                     :class="[
                                       'h-2 w-6 rounded-full',
                                       getPasswordStrength() >= i ? getPasswordStrengthColor() : 'bg-gray-200 dark:bg-gray-600'
                                     ]">
                                </div>
                            </div>
                            <span :class="getPasswordStrengthTextColor()">
                                {{ getPasswordStrengthText() }}
                            </span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        :disabled="passwordForm.isLoading || !isPasswordFormValid"
                        class="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Loader2 v-if="passwordForm.isLoading" class="animate-spin h-5 w-5 mr-2" />
                        {{ passwordForm.isLoading ? 'Updating Password...' : 'Update Password' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { Mail, Lock, Loader2 } from 'lucide-vue-next';
import api from '../services/api';

// State for the email form
const emailForm = reactive({
    newEmail: '',
    currentPassword: '',
    isLoading: false,
});
const emailStatus = reactive({ message: '', isError: false });

// State for the password form
const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    isLoading: false,
});
const passwordStatus = reactive({ message: '', isError: false });

// Computed properties
const isPasswordFormValid = computed(() => {
    return passwordForm.currentPassword && 
           passwordForm.newPassword && 
           passwordForm.confirmNewPassword &&
           passwordForm.newPassword === passwordForm.confirmNewPassword &&
           passwordForm.newPassword.length >= 6;
});

// Password strength helpers
const getPasswordStrength = () => {
    const password = passwordForm.newPassword;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
};

const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-yellow-500';
    if (strength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
};

const getPasswordStrengthTextColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 1) return 'text-red-500';
    if (strength <= 2) return 'text-yellow-500';
    if (strength <= 3) return 'text-blue-500';
    return 'text-green-500';
};

const getPasswordStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
};

// Clear status messages after delay
const clearStatusAfterDelay = (statusObj, delay = 5000) => {
    setTimeout(() => {
        statusObj.message = '';
        statusObj.isError = false;
    }, delay);
};

const updateEmail = async () => {
    emailStatus.message = '';
    emailForm.isLoading = true;
    
    try {
        await api.put('/user/update-email', {
            newEmail: emailForm.newEmail,
            password: emailForm.currentPassword,
        });
        
        emailStatus.message = 'Email updated successfully!';
        emailStatus.isError = false;
        emailForm.newEmail = '';
        emailForm.currentPassword = '';
        
        clearStatusAfterDelay(emailStatus);
    } catch (err) {
        console.error('Email update error:', err);
        emailStatus.message = err.response?.data?.msg || 'Failed to update email. Please try again.';
        emailStatus.isError = true;
        clearStatusAfterDelay(emailStatus, 8000);
    } finally {
        emailForm.isLoading = false;
    }
};

const updatePassword = async () => {
    passwordStatus.message = '';
    
    // Client-side validation
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        passwordStatus.message = 'New passwords do not match.';
        passwordStatus.isError = true;
        clearStatusAfterDelay(passwordStatus);
        return;
    }
    
    if (passwordForm.newPassword.length < 6) {
        passwordStatus.message = 'New password must be at least 6 characters long.';
        passwordStatus.isError = true;
        clearStatusAfterDelay(passwordStatus);
        return;
    }
    
    passwordForm.isLoading = true;
    
    try {
        await api.put('/user/update-password', {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
        });
        
        passwordStatus.message = 'Password updated successfully!';
        passwordStatus.isError = false;
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmNewPassword = '';
        
        clearStatusAfterDelay(passwordStatus);
    } catch (err) {
        console.error('Password update error:', err);
        passwordStatus.message = err.response?.data?.msg || 'Failed to update password. Please try again.';
        passwordStatus.isError = true;
        clearStatusAfterDelay(passwordStatus, 8000);
    } finally {
        passwordForm.isLoading = false;
    }
};
</script>
