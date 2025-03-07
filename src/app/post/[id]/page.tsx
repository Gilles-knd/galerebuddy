'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { postService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Post, Comment } from '@/types';
import {ReactionButton} from "@/components/ui/ReactionButton";


export default function PostDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

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

                // Récupérer les commentaires
                const commentsData = await postService.getComments(id);
                setComments(commentsData as Comment[]);
            } catch (err) {
                setError('Impossible de charger ce post. Veuillez réessayer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails().then(r => r);
    }, [id, user, router, loading]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        setSubmittingComment(true);

        try {
            const comment = await postService.addComment(id, newComment);
            setComments(prev => [...prev, comment as Comment]);
            setNewComment('');
        } catch (err) {
            console.error('Erreur lors de l\'ajout du commentaire:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleProposalClick = () => {
        router.push(`/post/${id}/collab`);
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

    if (error || !post) {
        return (
            <MainLayout>
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error || 'Post introuvable'}</p>
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

                <Card>
                    <Card.Header>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden">
                                {post.author?.avatarUrl ? (
                                    <Image
                                        src={post.author.avatarUrl}
                                        alt={`${post.author.firstname} ${post.author.name}`}
                                        width={40}
                                        height={40}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-lg font-bold">
                                        {post.author?.firstname?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium">
                                    {post.author ? `${post.author.firstname} ${post.author.name}` : 'Utilisateur inconnu'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}
                                </p>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold">{post.title}</h1>
                    </Card.Header>

                    <Card.Content>
                        {post.imageUrl && (
                            <div className="mb-6 rounded-lg overflow-hidden relative h-96">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Le problème</h2>
                            <p className="text-gray-700 whitespace-pre-line">{post.problem}</p>
                        </div>

                        {post.solution && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">La solution</h2>
                                <p className="text-gray-700 whitespace-pre-line">{post.solution}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Le conseil</h2>
                            <p className="text-gray-700 whitespace-pre-line">{post.advice}</p>
                        </div>

                        {post.lesson && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">La leçon</h2>
                                <p className="text-gray-700 whitespace-pre-line">{post.lesson}</p>
                            </div>
                        )}

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.map(tag => (
                                    <span key={tag.id} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Card.Content>

                    <Card.Footer>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <ReactionButton
                                    postId={post.id}
                                    initialCount={post._count?.reactions || 0}
                                    reactionType="LIKE"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    }
                                />

                                <ReactionButton
                                    postId={post.id}
                                    initialCount={0} // Idéalement, vous auriez cette donnée de l'API
                                    reactionType="LAUGH"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />

                                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span>{comments.length}</span>
                                </button>
                            </div>

                            <Button
                                variant="primary"
                                onClick={handleProposalClick}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Proposer une collab
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>

                {/* Section commentaires */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Commentaires ({comments.length})</h2>

                    <form onSubmit={handleAddComment} className="mb-6">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Ajouter un commentaire..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={submittingComment}
                                disabled={!newComment.trim()}
                            >
                                Commenter
                            </Button>
                        </div>
                    </form>

                    {comments.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="p-4 border border-gray-200 rounded-md">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 overflow-hidden relative">
                                            {comment.author?.avatarUrl ? (
                                                <Image
                                                    src={comment.author.avatarUrl}
                                                    alt={`${comment.author.firstname} ${comment.author.name}`}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-sm font-bold">
                                                    {comment.author?.firstname?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm">
                                                {comment.author ? `${comment.author.firstname} ${comment.author.name}` : 'Utilisateur inconnu'}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}