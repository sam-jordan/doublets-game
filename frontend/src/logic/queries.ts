import {
    useQueries,
    useQuery,
    type UseQueryResult,
} from '@tanstack/react-query';
import { getCurrentUser, signIn, signUp } from 'aws-amplify/auth';
import { DateTime } from 'luxon';
import z from 'zod';
import configureAmplify from './configure-amplify';
import {
    DIFFICULTIES,
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
    body: Attempted;
    attempted: Record<'easy' | 'medium' | 'hard', boolean>;
}): UseQueryResult[] {
    configureAmplify();
    const { username, body, attempted } = options;

    const date = DateTime.now().toUTC().toLocaleString(DateTime.DATE_SHORT);
    return useQueries({
        queries: DIFFICULTIES.map(difficulty => ({
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
            enabled: attempted[difficulty],
            staleTime: Infinity,
        })),
    });
}

export function useSolved(options: {
    username: string | undefined;
    body: Record<Difficulties, Solved>;
    solved: Record<'easy' | 'medium' | 'hard', number | undefined>;
}): UseQueryResult[] {
    configureAmplify();
    const { username, body, solved } = options;

    const date = DateTime.now().toUTC().toLocaleString(DateTime.DATE_SHORT);
    return useQueries({
        queries: DIFFICULTIES.map(difficulty => ({
            queryKey: [`${username}-solved-${date}-${difficulty}`],
            async queryFn() {
                const response = await callApi({
                    endpoint: {
                        path: `game/${username}/solved/${difficulty}`,
                        schema: z.string(),
                    },
                    method: 'PUT',
                    body: body[difficulty],
                });

                return response;
            },
            enabled: solved[difficulty] !== undefined,
            staleTime: Infinity,
        })),
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
