import { Duration } from 'luxon';
import { describe, expect, it } from 'vitest';
import { formatDuration } from './format-duration';

describe('formatDuration', () => {
    it('should correctly format a Duration', () => {
        const duration = Duration.fromISO('PT12H12M12S');

        expect(formatDuration(duration)).toBe('12:12:12');
    });

    it('should omit displaying hours if Duration is less than 60 minutes', () => {
        const duration = Duration.fromISO('PT17M32S');

        expect(formatDuration(duration)).toBe('17:32');
    });

    it('should add an additional 0 with at least one hour and less than 10 minutes', () => {
        const duration = Duration.fromISO('PT1H9M43S');

        expect(formatDuration(duration)).toBe('1:09:43');
    });

    it('should add an additional 0 when seconds are less than 10', () => {
        const duration = Duration.fromISO('PT21M1S');

        expect(formatDuration(duration)).toBe('21:01');
    });
});
