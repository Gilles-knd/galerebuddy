import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import Cookies from 'js-cookie';
import {User} from "@/types";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Vérifie si l'utilisateur est déjà connecté
                const token = localStorage.getItem('token');

                if (token) {
                    // Récupérer l'utilisateur stocké comme fallback
                    const storedUserJson = localStorage.getItem('user');
                    let storedUser = null;

                    try {
                        if (storedUserJson) {
                            storedUser = JSON.parse(storedUserJson);
                            setUser(storedUser);
                        }
                    } catch (e) {
                        console.error('Erreur de parsing JSON:', e);
                    }

                    // Vérifier avec le serveur
                    try {
                        const currentUser = await authService.getCurrentUser();
                        if (currentUser) {
                            setUser(currentUser);
                            localStorage.setItem('user', JSON.stringify(currentUser));
                        } else if (!storedUser) {
                            // Si aucun utilisateur n'est trouvé et qu'il n'y a pas de fallback
                            localStorage.removeItem('token');
                        }
                    } catch (error) {
                        console.error("Erreur lors de la vérification de l'authentification:", error);
                        // Continuer avec l'utilisateur stocké si disponible
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { token, user } = await authService.login(email, password);

            // Sauvegarder également dans les cookies pour plus de sécurité
            Cookies.set('authToken', token, { expires: 7 }); // expire dans 7 jours

            setUser(user);
            return user;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    };

    const register = async (userData: User) => {
        try {
            const { token, user } = await authService.register(userData);

            // Sauvegarder également dans les cookies pour plus de sécurité
            Cookies.set('authToken', token, { expires: 7 }); // expire dans 7 jours

            setUser(user);
            return user;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        Cookies.remove('authToken');
        setUser(null);
        router.push('/login');
    };

    return { user, loading, login, register, logout };
}