export interface User {
    _id: string;
    username: string;
    email: string;
    avatar?: {
        fileId: string;
        url: string;
    };
    lastSeen?: string;
    createdAt: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface SignupInput {
    username: string;
    email: string;
    password: string;
}

export interface Contact {
    _id: string;
    userId: string;
    contactId: string;
    contactUser: User;
    nickname?: string;
    isFavorite: boolean;
    status: "pending" | "accepted" | "blocked";
    initiatedBy: string;
    addedAt?: string;
    createdAt: string;
}

export interface UpdateProfileInput {
    username: string;
    avatar?: File;
}

export interface CallParticipant {
    userId: string;
    username: string;
}

export type CallState = 'idle' | 'ringing' | 'connecting' | 'connected' | 'ended';

export interface ActiveCall {
    participant: CallParticipant;
    state: CallState;
    isIncoming: boolean;
}