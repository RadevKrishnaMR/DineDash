export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'cashier' | 'waiter' | 'kitchen';
    createdAt: string;
}


export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'cashier' | 'waiter' | 'kitchen';
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}