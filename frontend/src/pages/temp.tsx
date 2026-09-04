import { viteEnvironment } from '../logic/types';

export default function Temporary() {
    const parsed = viteEnvironment.safeParse(import.meta.env);
    return <p>{`${parsed.error?.name}:${parsed.error?.message}`}</p>;
}
