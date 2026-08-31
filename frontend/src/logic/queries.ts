import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, signIn, signUp } from 'aws-amplify/auth';
import configureAmplify from './configure-amplify';
import { statsSchema, type SignInOptions } from './types';
import { callApi } from './query-helpers';

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
        queryKey: [`${username}-sign-in`],
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
        queryKey: [`${username}-sign-up`],
        queryFn: async () =>
            signUp({
                username,
                password,
            }),
        enabled: submitted,
    });
}

export function useStats(options: { username: string }) {
    const { username } = options;

    return useQuery({
        queryKey: [`${username}-stats`],
        async queryFn() {
            const response = await callApi({
                endpoint: {
                    path: `stats/${username}`,
                    schema: statsSchema,
                },
                method: 'GET',
            });

            return response;
        },
    });
}
