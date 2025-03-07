'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PostCard } from '@/components/ui/PostCard';
import { Button } from '@/components/ui/Button';
import { postService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]); // Spécifiez le type Post[]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Spécifiez string | null
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Rediriger si non connecté
        if (!user && !loading) {
            router.push('/login');
            return;
        }

        // Récupérer les posts
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await postService.getPosts();
                setPosts(data as Post[]); // Cast vers Post[]
            } catch (err) {
                setError("Impossible de charger les posts. Veuillez réessayer.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts().then(r => r);
    }, [user, router, loading]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Réessayer</Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Fil d&#39;actualité</h1>

                {posts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune galère pour le moment</h3>
                        <p className="text-gray-500 mb-4">Soyez le premier à partager votre expérience !</p>
                        <Button onClick={() => router.push('/post/new')}>
                            Partager une galère
                        </Button>
                    </div>
                ) : (
                    <div>
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}