import z from 'zod';

export const environment = z.object({
    CERTIFICATE_ARN: z.string(),
    DEPLOY_ENV: z.enum(['dev', 'prod']),
    // USER_POOL_ID: z.string(),
    // USER_POOL_CLIENT_ID: z.string(),
    DEV_DOMAIN: z.string(),
});

export type Environment = z.infer<typeof environment>;
