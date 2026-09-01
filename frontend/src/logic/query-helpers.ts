import { fetchAuthSession } from 'aws-amplify/auth';
import {
    sessionSchema,
    StatsApiError,
    viteEnvironment,
    type CallApiOptions,
} from './types';

export async function callApi(options: CallApiOptions) {
    const env = viteEnvironment.parse(import.meta.env);

    const { endpoint, method } = options;
    const url = import.meta.env.PROD
        ? `${env.VITE_API_URL}/${endpoint.path}`
        : `/${endpoint.path}`;
    const session = sessionSchema.parse(await fetchAuthSession());

    const response = await fetch(url, {
        method,
        headers: {
            Authorization: session.tokens.accessToken.toString(),
        },
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
