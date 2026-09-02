import { environment } from '../../stack/environment.js';

export const statsEnvironment = environment.pick({
    DEV_DOMAIN: true,
});
