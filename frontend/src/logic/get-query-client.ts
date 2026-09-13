import { QueryClient } from '@tanstack/react-query';
import { StatsApiError } from '../../../shared/types';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry(_failureCount, error) {
                // Retrying client errors will not change the result
                return !(
                    error instanceof StatsApiError &&
                    error.status >= 400 &&
                    error.status < 500
                );
            },
        },
    },
});

export function getClient() {
    return queryClient;
}
