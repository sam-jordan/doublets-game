import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from 'aws-amplify/auth';
import configureAmplify from './configure-amplify';

export function useCurrentUser() {
    configureAmplify();

    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        retry: false,
    });
}
