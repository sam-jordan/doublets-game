import { Amplify } from 'aws-amplify';

export default function configureAmplify() {
    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolId: import.meta.env.VITE_USER_POOL_ID as string,
                userPoolClientId: import.meta.env
                    .VITE_USER_POOL_CLIENT_ID as string,
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
