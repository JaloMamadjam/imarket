// cli/apiClient.ts
const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

export const apiClient = {
    async get(endpoint: string) {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return response.json();
    },

    async post(endpoint: string, data: any) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return response.json();
    },

    async put(endpoint: string, data: any) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return response.json();
    },

    async del(endpoint: string) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return response.json();
    }
};