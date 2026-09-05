import type { Duration } from 'luxon';

export function formatDuration(duration: Duration) {
    const hours = Math.floor(duration.as('milliseconds') / (1000 * 60 * 60));
    const minutes =
        Math.floor(duration.as('milliseconds') / (1000 * 60)) - hours * 60;
    const seconds =
        Math.floor(duration.as('milliseconds') / 1000) - minutes * 60;

    return `${hours > 0 ? `${hours}:` : ''}${hours > 0 && minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
