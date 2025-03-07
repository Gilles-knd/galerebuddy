import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Post } from '@/types';
import { Card } from './Card';
import Image from "next/image";
import { ReactionButton } from './ReactionButton';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Card className="mb-4">
            <Card.Header className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden">
                        {post.author?.avatarUrl ? (
                            <Image
                                src={post.author.avatarUrl}
                                alt={`${post.author.firstname} ${post.author.name}`}
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

                <div className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                    {post._count?.comments || 0} commentaires
                </div>
            </Card.Header>

            <Card.Content>
                <Link href={`/post/${post.id}`} className="block">
                    <h2 className="text-xl font-bold mb-3 hover:text-blue-600">{post.title}</h2>

                    {post.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-100">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <h3 className="font-medium mb-1">Le problème :</h3>
                        <p className="text-gray-700">
                            {post.problem.length > 200
                                ? `${post.problem.substring(0, 200)}...`
                                : post.problem}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-medium mb-1">Le conseil :</h3>
                        <p className="text-gray-700">
                            {post.advice.length > 150
                                ? `${post.advice.substring(0, 150)}...`
                                : post.advice}
                        </p>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map(tag => (
                                <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag.name}
                </span>
                            ))}
                        </div>
                    )}
                </Link>
            </Card.Content>

            <Card.Footer className="flex justify-between">
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
                        <span>{post._count?.comments || 0}</span>
                    </button>
                </div>

                <Link
                    href={`/post/${post.id}/collab`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Proposer une collab</span>
                </Link>
            </Card.Footer>
        </Card>
    );
}