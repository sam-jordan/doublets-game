import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCurrentUser, signIn, signUp } from 'aws-amplify/auth';
import configureAmplify from './configure-amplify';
import { statsSchema, type SignInOptions, type Stats } from './types';
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

export function useStats(options: {
    username: string | undefined;
    enabled: boolean;
}): UseQueryResult<Stats> {
    configureAmplify();
    const { username, enabled } = options;

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
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
