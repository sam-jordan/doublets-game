import z from 'zod';

export const environment = z.object({
    CERTIFICATE_ARN: z.string(),
    DEPLOY_ENV: z.enum(['dev', 'prod']),
});

export type Environment = z.infer<typeof environment>;
