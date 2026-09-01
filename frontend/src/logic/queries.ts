import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getCurrentUser, signIn, signUp } from 'aws-amplify/auth';
import { DateTime } from 'luxon';
import z from 'zod';
import configureAmplify from './configure-amplify';
import {
    statsSchema,
    type Attempted,
    type Difficulties,
    type SignInOptions,
    type Solved,
    type Stats,
} from './types';
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

export function useAttempted(options: {
    username: string | undefined;
    difficulty: Difficulties;
    body: Attempted;
    enabled: boolean;
}) {
    configureAmplify();
    const { username, difficulty, body, enabled } = options;

    const date = DateTime.now().toUTC().toLocaleString(DateTime.DATE_SHORT);
    return useQuery({
        queryKey: [`${username}-attempted-${date}-${difficulty}`],
        async queryFn() {
            const response = await callApi({
                endpoint: {
                    path: `game/${username}/attempted/${difficulty}`,
                    schema: z.string(),
                },
                method: 'POST',
                body,
            });

            return response;
        },
        enabled,
    });
}

export function useSolved(options: {
    username: string | undefined;
    difficulty: Difficulties;
    body: Solved;
    enabled: boolean;
}) {
    configureAmplify();
    const { username, difficulty, body, enabled } = options;

    const date = DateTime.now().toUTC().toLocaleString(DateTime.DATE_SHORT);
    return useQuery({
        queryKey: [`${username}-solved-${date}-${difficulty}`],
        async queryFn() {
            const response = await callApi({
                endpoint: {
                    path: `game/${username}/solved/${difficulty}`,
                    schema: z.string(),
                },
                method: 'PUT',
                body,
            });

            return response;
        },
        enabled,
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
    });
}
