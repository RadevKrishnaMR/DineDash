export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Cashier' | 'Waiter' | 'Kitchen';
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
    // confirmPassword: string;
    role: 'Admin' | 'Cashier' | 'Waiter' | 'Kitchen';
}

export interface AuthResponse {
    data : {
        token: string;
        user: User;
    };
    user: User;
    token: string;
    message: string;
}