import { User } from "../interfaces/userTypes";

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
    message: string;
}

export interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}