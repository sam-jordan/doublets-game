import {
    type APIGatewayProxyEvent,
    type APIGatewayProxyResult,
} from 'aws-lambda';

export async function handler(
    _event: APIGatewayProxyEvent,
    _context: unknown
): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 200,
        headers: {},
        body: 'Hello, world!',
    };
}
