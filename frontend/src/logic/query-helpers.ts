import { fetchAuthSession } from 'aws-amplify/auth';
import { sessionSchema, StatsApiError, type CallApiOptions } from './types';

export async function callApi(options: CallApiOptions) {
    const { endpoint, method } = options;
    const url = import.meta.env.PROD
        ? `${import.meta.env.VITE_API_URL}/${endpoint.path}`
        : `/${endpoint.path}`;

    const session = sessionSchema.safeParse(await fetchAuthSession());
    if (session.success) {
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: session.data.tokens.accessToken.toString(),
            },
            body: JSON.stringify(options.body ?? undefined),
        });

        if (!response.ok) {
            throw new StatsApiError(
                `Error fetching from ${endpoint.path}`,
                response.status
            );
        }

        const parsed = endpoint.schema.safeParse(await response.json());
        if (parsed.success) {
            return parsed.data;
        }
    }
}
