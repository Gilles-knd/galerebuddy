'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        firstname: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatarUrl: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            const { ...registerData } = formData;

            await register(registerData);
            router.push('/feed');
        } catch (err) {
            console.error('Erreur d\'inscription:', err);
            setError('Une erreur est survenue lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-bold text-gray-900">
                    GalèreBuddy
                </h1>
                <h2 className="mt-2 text-center text-xl font-medium text-gray-600">
                    Créez votre compte
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Input
                                label="Prénom"
                                name="firstname"
                                type="text"
                                required
                                value={formData.firstname}
                                onChange={handleChange}
                                fullWidth
                            />

                            <Input
                                label="Nom"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                            />
                        </div>

                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                        />

                        <Input
                            label="Mot de passe"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            fullWidth
                        />

                        <Input
                            label="URL de l'avatar (optionnel)"
                            name="avatarUrl"
                            type="text"
                            value={formData.avatarUrl}
                            onChange={handleChange}
                            fullWidth
                        />

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                isLoading={loading}
                            >
                                Créer mon compte
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                  Déjà un compte?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href="/login">
                                <Button variant="outline" fullWidth>
                                    Se connecter
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}