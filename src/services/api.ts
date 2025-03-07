const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fonction utilitaire pour les appels API
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
    }

    return response.json();
}

// Service d'authentification
export const authService = {
    login: async (email: string, password: string) => {
        const response = await fetchApi<{ jwt: string; message: string }>('/auth/log-in', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        // Stocker le token
        if (response.jwt) {
            localStorage.setItem('token', response.jwt);

            // Faire une requête supplémentaire pour obtenir les informations de l'utilisateur
            const userInfo = await fetchApi<{ user: any }>('/users/me');
            if (userInfo.user) {
                localStorage.setItem('user', JSON.stringify(userInfo.user));
                return { token: response.jwt, user: userInfo.user };
            }
        }

        throw new Error("Échec de récupération des données utilisateur");
    },

    register: async (userData: any) => {
        const response = await fetchApi<{ jwt: string; message: string }>('/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        // Stocker le token
        if (response.jwt) {
            localStorage.setItem('token', response.jwt);

            // Faire une requête supplémentaire pour obtenir les informations de l'utilisateur
            const userInfo = await fetchApi<{ user: any }>('/users/me');
            if (userInfo.user) {
                localStorage.setItem('user', JSON.stringify(userInfo.user));
                return { token: response.jwt, user: userInfo.user };
            }
        }

        throw new Error("Échec de récupération des données utilisateur");
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Nouvelle méthode pour vérifier si l'utilisateur est connecté
    getCurrentUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        try {
            const userInfo = await fetchApi<{ user: any }>('/auth/me');
            return userInfo.user;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Si la requête échoue, l'utilisateur n'est probablement plus authentifié
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    }
};
// Service pour les posts
export const postService = {
    getPosts: () => fetchApi<any[]>('/post'),

    getTrending: () => fetchApi<any[]>('/post/trending'),

    getPost: (id: string) => fetchApi<any>(`/post/${id}`),

    createPost: (postData: any) =>
        fetchApi<any>('/post', {
            method: 'POST',
            body: JSON.stringify(postData),
        }),

    updatePost: (id: string, postData: any) =>
        fetchApi<any>(`/post/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(postData),
        }),

    deletePost: (id: string) =>
        fetchApi<void>(`/post/${id}`, {
            method: 'DELETE',
        }),

    getComments: (postId: string) => fetchApi<any[]>(`/post/${postId}/comments`),

    addComment: (postId: string, content: string) =>
        fetchApi<any>(`/post/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        }),

    addReaction: (postId: string, react: string) =>
        fetchApi<any>(`/post/${postId}/reactions`, {
            method: 'POST',
            body: JSON.stringify({ react, userId: JSON.parse(localStorage.getItem('user') || '{}').id }),
        }),
};

// Service pour les initiatives
export const initiativeService = {
    getInitiatives: () => fetchApi<any[]>('/initiative'),

    createInitiative: (data: any) =>
        fetchApi<any>('/initiative', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getInitiative: (id: string) => fetchApi<any>(`/initiative/${id}`),

    updateInitiative: (id: string, data: any) =>
        fetchApi<any>(`/initiative/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    joinInitiative: (id: string) =>
        fetchApi<any>(`/initiative/${id}/participants`, {
            method: 'POST',
        }),
};

// Service pour les tags
export const tagService = {
    getTags: () => fetchApi<any[]>('/tag'),
};