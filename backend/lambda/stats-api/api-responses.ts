export function ok(body: string) {
    return {
        statusCode: 200,
        body,
    };
}

export function badRequest() {
    return {
        statusCode: 400,
        body: 'Bad Request',
    };
}

export function notFound() {
    return {
        statusCode: 404,
        body: 'Not Found',
    };
}

export function internalServerError() {
    return {
        statusCode: 500,
        body: 'Internal Server Error',
    };
}
