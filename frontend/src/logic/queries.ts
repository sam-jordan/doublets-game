import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, signIn, signUp } from 'aws-amplify/auth';
import configureAmplify from './configure-amplify';
import type { SignInOptions } from './types';

export function useCurrentUser() {
    configureAmplify();

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        retry: false,
    });
}

export function useSignIn(options: SignInOptions) {
    configureAmplify();
    const { username, password, submitted } = options;

    return useQuery({
        queryKey: [username],
        queryFn: async () =>
            signIn({
                username,
                password,
            }),
        enabled: submitted,
    });
}

export function useSignUp(options: SignInOptions) {
    configureAmplify();
    const { username, password, submitted } = options;

    return useQuery({
        queryKey: [username],
        queryFn: async () =>
            signUp({
                username,
                password,
            }),
        enabled: submitted,
    });
}
