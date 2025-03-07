// app/post/new/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { postService, tagService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Tag } from '@/types';

export default function NewPostPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        problem: '',
        solution: '',
        advice: '',
        lesson: '',
    });

    // Charger les tags disponibles
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await tagService.getTags();
                setTags(data as Tag[]);
            } catch (err) {
                console.error('Erreur lors du chargement des tags:', err);
            }
        };

        fetchTags().then(r => r);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.problem || !formData.advice) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await postService.createPost({
                ...formData,
                tags: selectedTags
            });

            router.push('/feed');
        } catch (err) {
            console.error('Erreur lors de la création du post:', err);
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    // Rediriger si non connecté
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto pb-20">
                <h1 className="text-2xl font-bold mb-6">Partager une galère</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Titre de votre galère *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Le jour où MongoDB m'a fait pleurer"
                        fullWidth
                        required
                    />

                    <Input
                        label="URL de l'image (optionnelle)"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        fullWidth
                    />

                    <Textarea
                        label="Votre problème *"
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        placeholder="Décrivez la situation problématique que vous avez rencontrée..."
                        rows={4}
                        fullWidth
                        required
                    />

                    <Textarea
                        label="Votre solution (optionnelle)"
                        name="solution"
                        value={formData.solution}
                        onChange={handleChange}
                        placeholder="Comment avez-vous résolu ce problème ?"
                        rows={4}
                        fullWidth
                    />

                    <Textarea
                        label="Votre conseil *"
                        name="advice"
                        value={formData.advice}
                        onChange={handleChange}
                        placeholder="Quel conseil donneriez-vous à quelqu'un qui rencontre le même problème ?"
                        rows={3}
                        fullWidth
                        required
                    />

                    <Textarea
                        label="Leçon apprise (optionnelle)"
                        name="lesson"
                        value={formData.lesson}
                        onChange={handleChange}
                        placeholder="Quelle leçon avez-vous tirée de cette expérience ?"
                        rows={3}
                        fullWidth
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (optionnels)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        selectedTags.includes(tag.id)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
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
                            isLoading={loading}
                        >
                            Publier ma galère
                        </Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}