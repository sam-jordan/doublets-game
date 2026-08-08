import z from "zod";

export const environment = z.object({
    CERTIFICATE_ARN: z.string(),
});