import { describe, expect, it } from 'vitest';
import { addHeaders } from './api-responses.js';

describe('addHeaders', () => {
    it('should return the correct headers with no origin', () => {
        expect(addHeaders()).toStrictEqual({
            'Content-Type': 'application/json',
        });
    });

    it('should return the correct headers with an unauthorised origin', () => {
        expect(addHeaders('unauthorised-origin')).toStrictEqual({
            'Content-Type': 'application/json',
        });
    });

    it('should return the correct headers with the dev origin', () => {
        expect(addHeaders('test-domain')).toStrictEqual({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'test-domain',
        });
    });

    it('should return the correct headers with the prod origin', () => {
        expect(addHeaders('https://www.doublets.app')).toStrictEqual({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://www.doublets.app',
        });
    });
});
