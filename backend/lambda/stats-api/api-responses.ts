import process from 'node:process';
import { type APIGatewayProxyResult } from 'aws-lambda';
import { statsEnvironment } from './environment.js';

function addHeaders(origin?: string): Record<string, string> {
    const env = statsEnvironment.parse(process.env);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const allowedOrigins = ['https://www.doublets.app', env.DEV_DOMAIN];
    if (origin !== undefined && allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return headers;
}

export function ok(body: string, origin?: string): APIGatewayProxyResult {
    return {
        statusCode: 200,
        body,
        headers: addHeaders(origin),
    };
}

export function badRequest(origin?: string): APIGatewayProxyResult {
    return {
        statusCode: 400,
        body: 'Bad Request',
        headers: addHeaders(origin),
    };
}

export function notFound(origin?: string): APIGatewayProxyResult {
    return {
        statusCode: 404,
        body: 'Not Found',
        headers: addHeaders(origin),
    };
}

export function internalServerError(origin?: string) {
    return {
        statusCode: 500,
        body: 'Internal Server Error',
        headers: addHeaders(origin),
    };
}
