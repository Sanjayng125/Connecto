import api from "../lib/axios";

export const contactApi = {
    sendContactRequest: async (contactUserId: string) => {
        const response = await api.post(`/api/contact/request`, { contactUserId });
        return response.data;
    },

    respondToContactRequest: async (contactUserId: string, action: 'accepted' | 'blocked') => {
        const response = await api.patch(`/api/contact/respond/${contactUserId}`, { action });
        return response.data;
    },

    getContacts: async (query?: string) => {
        const response = await api.get(`/api/contact${query?.trim() ? `?query=${query.trim()}` : ''}`);
        return response.data;
    },

    getContact: async (id: string) => {
        const response = await api.get(`/api/contact/${id}`);
        return response.data.contact;
    },

    updateContact: async (contactId: string, data: { nickname?: string; isFavorite?: boolean }) => {
        const response = await api.patch(`/api/contact/update/${contactId}`, data);
        return response.data;
    },

    deleteContact: async (contactUserId: string) => {
        const response = await api.delete(`/api/contact/delete/${contactUserId}`);
        return response.data;
    },

    getUsers: async (query?: string) => {
        const response = await api.get(`/api/contact/users${query?.trim() ? `?query=${query.trim()}` : ''}`);
        return response.data;
    },

    getUser: async (id: string) => {
        const response = await api.get(`/api/contact/user/${id}`);
        return response.data.user;
    },

    searchUsers: async (query: string) => {
        const response = await api.get(`/api/contact/search?query=${query}`);
        return response.data;
    },

    getIncomingRequests: async () => {
        const response = await api.get(`/api/contact/request/incoming`);
        return response.data;
    },

    getSentRequests: async () => {
        const response = await api.get(`/api/contact/request/sent`);
        return response.data;
    },
}