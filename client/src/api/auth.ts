import api from '../lib/axios';
import type { LoginInput, SignupInput, UpdateProfileInput } from '../types';

export const authApi = {
    signup: async (data: SignupInput) => {
        const response = await api.post('/api/user/auth/signup', data);
        return response.data;
    },

    login: async (data: LoginInput) => {
        const response = await api.post('/api/user/auth/login', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/api/user/auth/logout');
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post('/api/user/auth/refresh');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/api/user/auth/me');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileInput) => {
        const formData = new FormData();
        if (data.username) {
            formData.append('username', data.username);
        }
        if (data.avatar) {
            formData.append('file', data.avatar);
        }

        const response = await api.patch('/api/user/auth/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};