'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { initiativeService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Initiative, Participant } from '@/types';

export default function CollabsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [activeTab, setActiveTab] = useState('all'); // all, mine, joined
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Rediriger si non connecté
        if (!user && !loading) {
            router.push('/login');
            return;
        }

        // Récupérer les initiatives
        const fetchInitiatives = async () => {
            try {
                setLoading(true);
                const data = await initiativeService.getInitiatives();
                setInitiatives(data as Initiative[]);
            } catch (err) {
                setError('Impossible de charger les collaborations. Veuillez réessayer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitiatives();
    }, [user, router, loading]);

    // Filtrer les initiatives selon l'onglet actif
    const filteredInitiatives = initiatives.filter(initiative => {
        if (activeTab === 'all') return true;
        if (activeTab === 'mine') return initiative.creatorId === user?.id;
        if (activeTab === 'joined') {
            return initiative.participants?.some((participant: Participant) => participant.userId === user?.id);
        }
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PROPOSED':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Proposée</span>;
            case 'IN_PROGRESS':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">En cours</span>;
            case 'COMPLETED':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Terminée</span>;
            default:
                return null;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'PROJECT':
                return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Projet</span>;
            case 'ARTICLE':
                return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">Article</span>;
            case 'TRAINING':
                return <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">Formation</span>;
            case 'MEETING':
                return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Rencontre</span>;
            case 'OTHER':
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Autre</span>;
            default:
                return null;
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

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto pb-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mes Collabs</h1>
                    <Link href="/feed">
                        <Button variant="outline">
                            Explorer les posts
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'all'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        Toutes
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'mine'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('mine')}
                    >
                        Mes initiatives
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'joined'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('joined')}
                    >
                        Mes participations
                    </button>
                </div>

                {error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>Réessayer</Button>
                    </div>
                ) : filteredInitiatives.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune collaboration pour le moment</h3>
                        <p className="text-gray-500 mb-4">
                            {activeTab === 'all'
                                ? 'Aucune collaboration n\'est disponible actuellement.'
                                : activeTab === 'mine'
                                    ? 'Vous n\'avez pas encore créé d\'initiative de collaboration.'
                                    : 'Vous ne participez à aucune collaboration pour le moment.'}
                        </p>
                        <Button onClick={() => router.push('/feed')}>
                            Explorer les posts
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredInitiatives.map(initiative => (
                            <Card key={initiative.id} className="hover:shadow-md transition-shadow">
                                <Card.Header className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-bold">{initiative.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getStatusBadge(initiative.status)}
                                            {getTypeBadge(initiative.type)}
                                        </div>
                                    </div>

                                    <Link href={`/post/${initiative.postId}`}>
                                        <Button variant="outline" size="sm">
                                            Voir le post
                                        </Button>
                                    </Link>
                                </Card.Header>

                                <Card.Content>
                                    <p className="text-gray-700 mb-4">{initiative.description}</p>

                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <div>
                                            <span>Par: </span>
                                            <span className="font-medium">
                                                {initiative.creator ? `${initiative.creator.firstname} ${initiative.creator.name}` : 'Utilisateur inconnu'}
                                            </span>
                                        </div>

                                        {initiative.deadline && (
                                            <div>
                                                <span>Deadline: </span>
                                                <span className="font-medium">
                                                    {new Date(initiative.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            <span>Participants: </span>
                                            <span className="font-medium">
                                                {initiative.participants?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Card.Content>

                                <Card.Footer className="flex justify-end">
                                    {initiative.creatorId !== user?.id &&
                                        !initiative.participants?.some((p: Participant) => p.userId === user?.id) && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => initiativeService.joinInitiative(initiative.id)}
                                            >
                                                Rejoindre
                                            </Button>
                                        )}

                                    {initiative.creatorId === user?.id && (
                                        <Link href={`/collabs/${initiative.id}`}>
                                            <Button variant="primary" size="sm">
                                                Gérer
                                            </Button>
                                        </Link>
                                    )}

                                    {initiative.participants?.some((p: Participant) => p.userId === user?.id) && (
                                        <Link href={`/collabs/${initiative.id}`}>
                                            <Button variant="primary" size="sm">
                                                Voir les détails
                                            </Button>
                                        </Link>
                                    )}
                                </Card.Footer>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}