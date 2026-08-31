import {
    type APIGatewayProxyEventV2,
    type APIGatewayProxyResult,
} from 'aws-lambda';

export async function handler(
    event: APIGatewayProxyEventV2,
    _context: unknown
): Promise<APIGatewayProxyResult> {
    console.log(event);

    switch (event.routeKey) {
        case 'POST /game/{user}/attempted': {
            return {
                statusCode: 200,
                body: 'Hello, world!',
            };
        }

        case 'POST /game/{user}/solved': {
            return {
                statusCode: 200,
                body: 'Hello, world!',
            };
        }

        case 'GET /stats/{user}': {
            return {
                statusCode: 200,
                body: 'Hello, world!',
            };
        }

        default: {
            return {
                statusCode: 404,
                body: 'Not Found',
            };
        }
    }
}
