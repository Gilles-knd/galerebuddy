'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { postService, initiativeService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types';

export default function CollabProposalPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'PROJECT',
        deadline: '',
    });

    useEffect(() => {
        // Rediriger si non connecté
        if (!user && !loading) {
            router.push('/login');
            return;
        }

        // Vérifier que l'ID est défini
        if (!id) {
            setError("Identifiant de post manquant");
            setLoading(false);
            return;
        }

        // Récupérer les détails du post
        const fetchPostDetails = async () => {
            try {
                setLoading(true);
                const data = await postService.getPost(id);
                setPost(data as Post);

                // Préremplir le titre
                setFormData(prev => ({
                    ...prev,
                    title: `Collab sur "${(data as Post).title}"`,
                }));
            } catch (err) {
                setError('Impossible de charger ce post. Veuillez réessayer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [id, user, router, loading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.type) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await initiativeService.createInitiative({
                ...formData,
                postId: id,
            });

            setSuccess(true);

            // Rediriger après 2 secondes
            setTimeout(() => {
                router.push('/collabs');
            }, 2000);
        } catch (err) {
            console.error('Erreur lors de la création de l\'initiative:', err);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (error && !post) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => router.push('/feed')}>Retour au feed</Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto pb-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                </button>

                <h1 className="text-2xl font-bold mb-6">Proposer une collab</h1>

                {success ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-lg font-medium text-green-800 mb-1">Proposition envoyée !</h2>
                        <p className="text-green-700">Votre proposition de collab a été créée avec succès. Redirection en cours...</p>
                    </div>
                ) : (
                    <>
                        {post && (
                            <Card className="mb-6">
                                <Card.Header>
                                    <h2 className="text-lg font-semibold">Détails du post</h2>
                                </Card.Header>
                                <Card.Content>
                                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                    <p className="text-gray-700 mb-4">{post.problem.substring(0, 200)}...</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-sm text-gray-500">Auteur: </span>
                                            <span className="font-medium">
                                                {post.author ? `${post.author.firstname} ${post.author.name}` : 'Utilisateur inconnu'}
                                            </span>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span key={tag.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card.Content>
                            </Card>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre de la collab *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Expliquez ce que vous aimeriez faire en collaboration avec l'auteur..."
                                    rows={4}
                                    fullWidth
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type de collaboration *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="PROJECT">Projet</option>
                                    <option value="ARTICLE">Article</option>
                                    <option value="TRAINING">Formation</option>
                                    <option value="MEETING">Rencontre</option>
                                    <option value="OTHER">Autre</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date limite (optionnelle)
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}

                            <div className="pt-4 flex gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={submitting}
                                >
                                    Proposer la collab
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </MainLayout>
    );
}