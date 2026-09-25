import { describe, expect, it } from 'vitest';
import {
    addHeaders,
    badRequest,
    internalServerError,
    notFound,
    ok,
} from './api-responses.js';

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

describe('Responses', () => {
    it('should create a correct 200 OK response', () => {
        expect(ok('test')).toStrictEqual({
            statusCode: 200,
            body: 'test',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should create a correct 400 Bad Request response', () => {
        expect(badRequest()).toStrictEqual({
            statusCode: 400,
            body: 'Bad Request',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should create a correct 404 Not Found response', () => {
        expect(notFound()).toStrictEqual({
            statusCode: 404,
            body: 'Not Found',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    it('should create a correct 500 Internal Server Error response', () => {
        expect(internalServerError()).toStrictEqual({
            statusCode: 500,
            body: 'Internal Server Error',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
