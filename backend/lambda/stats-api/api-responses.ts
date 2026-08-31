import { type APIGatewayProxyResult } from 'aws-lambda';

function addHeaders(origin?: string): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (origin?.includes('www.doublets.app')) {
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
