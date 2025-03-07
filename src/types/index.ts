export interface User {
    id: string;
    email: string;
    firstname: string;
    name: string;
    avatarUrl?: string;
    role: 'ADMIN' | 'MEMBER';
    impactPoints: number;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    id: string;
    title: string;
    imageUrl?: string;
    problem: string;
    solution?: string;
    advice: string;
    lesson?: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author?: User;
    tags?: Tag[];
    _count?: {
        comments: number;
        reactions: number;
    };
}

export interface Tag {
    id: string;
    name: string;
}

export interface Comment {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: string;
    author?: User;
}

export interface Reaction {
    id: string;
    postId: string;
    userId: string;
    react: 'LIKE' | 'LAUGH' | 'CRY';
    createdAt: string;
    user?: User;
}

export interface Initiative {
    id: string;
    title: string;
    description: string;
    type: 'ARTICLE' | 'TRAINING' | 'PROJECT' | 'MEETING' | 'OTHER';
    status: 'PROPOSED' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
    deadline?: string;
    outcome?: string;
    postId: string;
    creatorId: string;
    creator?: User;
    participants?: Participant[];
}

export interface Participant {
    id: string;
    initiativeId: string;
    userId: string;
    joinedAt: string;
    user?: User;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstname: string;
    name: string;
    avatarUrl?: string;
}

export interface CreatePostDto {
    title: string;
    imageUrl?: string;
    problem: string;
    solution?: string;
    advice: string;
    lesson?: string;
    tags?: string[];
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}