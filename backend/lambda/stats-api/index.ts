import process from 'node:process';
import {
    type APIGatewayProxyEventV2,
    type APIGatewayProxyResult,
} from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DateTime } from 'luxon';
import { puzzleSchema } from './types.js';

export async function handler(
    event: APIGatewayProxyEventV2,
    _context: unknown
): Promise<APIGatewayProxyResult> {
    console.log(event);

    const client = new DynamoDBClient({ region: 'eu-west-2' });
    const documentClient = DynamoDBDocumentClient.from(client);

    switch (event.routeKey) {
        case 'POST /game/{user}/attempted/{difficulty}': {
            try {
                if (event.body === undefined) {
                    return {
                        statusCode: 400,
                        body: 'Bad Request',
                    };
                }

                const parsed = puzzleSchema.parse(JSON.parse(event.body));

                const date = DateTime.now()
                    .toUTC()
                    .toLocaleString(DateTime.DATE_SHORT);
                const puzzle = `[${date}]#[${event.pathParameters?.difficulty}]`;

                const command = new PutCommand({
                    TableName: process.env.TABLE_NAME,
                    Item: {
                        username: event.pathParameters?.username,
                        puzzle,
                        status: parsed,
                    },
                });

                await documentClient.send(command);
                return {
                    statusCode: 200,
                    body: 'Puzzle attempt stored successfully.',
                };
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: 'Internal Server Error',
                };
            }
        }

        case 'POST /game/{user}/solved/{difficulty}': {
            try {
                if (event.body === undefined) {
                    return {
                        statusCode: 400,
                        body: 'Bad Request',
                    };
                }

                const parsed = puzzleSchema.parse(JSON.parse(event.body));

                const date = DateTime.now()
                    .toUTC()
                    .toLocaleString(DateTime.DATE_SHORT);
                const puzzle = `[${date}]#[${event.pathParameters?.difficulty}]`;

                const command = new UpdateCommand({
                    TableName: process.env.TABLE_NAME,
                    Key: {
                        username: event.pathParameters?.username,
                        puzzle,
                    },
                    UpdateExpression: 'set puzzle = :puzzle',
                    ExpressionAttributeValues: {
                        ':puzzle': JSON.stringify(parsed),
                    },
                });

                await documentClient.send(command);
                return {
                    statusCode: 200,
                    body: 'Puzzle solve stored successfully.',
                };
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: 'Internal Server Error',
                };
            }
        }

        case 'GET /stats/{user}': {
            try {
                const command = new QueryCommand({
                    TableName: process.env.TABLE_NAME,
                    KeyConditionExpression: 'username = :username',
                    ExpressionAttributeValues: {
                        ':username': event.pathParameters?.username,
                    },
                    ConsistentRead: true,
                });

                const response = await documentClient.send(command);
                console.log(response);
                return {
                    statusCode: 200,
                    body: 'Stats!',
                };
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 500,
                    body: 'Internal Server Error',
                };
            }
        }

        default: {
            return {
                statusCode: 404,
                body: 'Not Found',
            };
        }
    }
}
