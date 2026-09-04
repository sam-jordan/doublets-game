import { Amplify } from 'aws-amplify';
import { viteEnvironment } from './types';

export default function configureAmplify() {
    console.log(import.meta.env);
    const env = viteEnvironment.safeParse(import.meta.env);

    if (env.success) {
        Amplify.configure({
            Auth: {
                Cognito: {
                    userPoolId: env.data.VITE_USER_POOL_ID,
                    userPoolClientId: env.data.VITE_USER_POOL_CLIENT_ID,
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
}
