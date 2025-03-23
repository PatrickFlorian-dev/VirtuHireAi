export interface User {
    id?: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    position?: string;
    description?: string;
    userPrefs?: string;
    password?: string;
    companyName?: string;
    companyId?: string;
    roleId?: number;
    ssoProvider?: string;
    ssoId?: string;
    active?: boolean;
}

export interface UserState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
  