import {
    type APIGatewayProxyEvent,
    type APIGatewayProxyResult,
} from 'aws-lambda';

export async function handler(
    event: APIGatewayProxyEvent,
    _context: unknown
): Promise<APIGatewayProxyResult> {
    switch (event.resource) {
        case '/game/{user}/attempted': {
            return {
                statusCode: 200,
                body: 'Hello, world!',
            };
        }

        case '/game/{user}/solved': {
            return {
                statusCode: 200,
                body: 'Hello, world!',
            };
        }

        case '/stats/{user}': {
            return {
                statusCode: 200,
                body: 'Hello, world!',
            };
        }

        default: {
            return {
                statusCode: 404,
                body: `Bad Request: ${event.resource}`,
            };
        }
    }
}
