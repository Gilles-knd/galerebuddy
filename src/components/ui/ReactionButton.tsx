import React, { useState } from 'react';
import { postService } from '@/services/api';

interface ReactionButtonProps {
    postId: string;
    initialCount: number;
    reactionType: 'LIKE' | 'LAUGH' | 'CRY';
    icon: React.ReactNode;
    label?: string;
}

export function ReactionButton({
                                   postId,
                                   initialCount,
                                   reactionType,
                                   icon,
                                   label
                               }: ReactionButtonProps) {
    const [count, setCount] = useState(initialCount);
    const [isReacting, setIsReacting] = useState(false);
    const [hasReacted, setHasReacted] = useState(false);

    const handleReaction = async () => {
        if (isReacting || hasReacted) return;

        setIsReacting(true);

        try {
            await postService.addReaction(postId, reactionType);
            setCount(prev => prev + 1);
            setHasReacted(true);
        } catch (error) {
            console.error('Erreur lors de la réaction:', error);
        } finally {
            setIsReacting(false);
        }
    };

    return (
        <button
            className={`flex items-center gap-1 ${
                hasReacted ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            } transition-colors`}
            onClick={handleReaction}
            disabled={isReacting || hasReacted}
        >
            {icon}
            <span>{label || count}</span>
        </button>
    );
}