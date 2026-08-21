import { Amplify } from 'aws-amplify';
import { amplifyEnvironment } from './types';

export default function configureAmplify() {
    const env = amplifyEnvironment.parse(import.meta.env);

    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolId: env.VITE_USER_POOL_ID,
                userPoolClientId: env.VITE_USER_POOL_CLIENT_ID,
                passwordFormat: {
                    minLength: 8,
                    requireLowercase: true,
                    requireUppercase: true,
                    requireNumbers: true,
                    requireSpecialCharacters: true,
                },
            },
        },
    });
}
