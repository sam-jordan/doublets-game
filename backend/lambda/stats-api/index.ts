import process from 'node:process';
import {
    type APIGatewayProxyEventV2,
    type APIGatewayProxyResult,
} from 'aws-lambda';
import {
    ConditionalCheckFailedException,
    DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { DateTime } from 'luxon';
import {
    attemptedSchema,
    puzzleRecordsSchema,
    puzzleSchema,
    solvedSchema,
} from './types.js';
import { calculateStats } from './calculate-stats.js';
import {
    badRequest,
    internalServerError,
    notFound,
    ok,
} from './api-responses.js';

export async function handler(
    event: APIGatewayProxyEventV2,
    _context: unknown
): Promise<APIGatewayProxyResult> {
    console.log(event);

    const client = new DynamoDBClient({ region: 'eu-west-2' });
    const documentClient = DynamoDBDocumentClient.from(client);

    const origin = event.headers.Origin;
    switch (event.routeKey) {
        case 'POST /game/{user}/attempted/{difficulty}': {
            try {
                if (event.body === undefined) {
                    return badRequest(origin);
                }

                const parsed = attemptedSchema.safeParse(
                    JSON.parse(event.body)
                );

                if (!parsed.success) {
                    return badRequest(origin);
                }

                const date = DateTime.now()
                    .toUTC()
                    .toLocaleString(DateTime.DATE_SHORT);
                const puzzle = `[${date}]#[${event.pathParameters?.difficulty}]`;

                const command = new PutCommand({
                    TableName: process.env.TABLE_NAME,
                    Item: {
                        username: event.pathParameters?.user,
                        puzzle,
                        puzzleStatus: JSON.stringify(parsed.data),
                    },
                    ConditionExpression: 'attribute_not_exists(username)',
                });

                await documentClient.send(command);
                return ok('Puzzle attempt stored successfully.', origin);
            } catch (error) {
                console.error(error);

                // An item already exists for this puzzle
                if (error instanceof ConditionalCheckFailedException) {
                    return badRequest(origin);
                }

                return internalServerError(origin);
            }
        }

        case 'PUT /game/{user}/solved/{difficulty}': {
            try {
                if (event.body === undefined) {
                    return badRequest(origin);
                }

                const parsed = solvedSchema.safeParse(JSON.parse(event.body));

                if (!parsed.success) {
                    return badRequest(origin);
                }

                const date = DateTime.now()
                    .toUTC()
                    .toLocaleString(DateTime.DATE_SHORT);
                const puzzle = `[${date}]#[${event.pathParameters?.difficulty}]`;

                const command = new UpdateCommand({
                    TableName: process.env.TABLE_NAME,
                    Key: {
                        username: event.pathParameters?.user,
                        puzzle,
                    },
                    UpdateExpression: 'set puzzleStatus = :puzzleStatus',
                    ExpressionAttributeValues: {
                        ':puzzleStatus': JSON.stringify(parsed.data),
                    },
                });

                await documentClient.send(command);
                return ok('Puzzle solve stored successfully.', origin);
            } catch (error) {
                console.error(error);
                return internalServerError(origin);
            }
        }

        case 'GET /stats/{user}': {
            try {
                const command = new QueryCommand({
                    TableName: process.env.TABLE_NAME,
                    KeyConditionExpression: 'username = :username',
                    ExpressionAttributeValues: {
                        ':username': event.pathParameters?.user,
                    },
                    ConsistentRead: true,
                });

                const response = await documentClient.send(command);
                const parsed = puzzleRecordsSchema.parse(response.Items);

                const body = {
                    easy: calculateStats(
                        parsed
                            .filter(item => item.puzzle.includes('[easy]'))
                            .map(item =>
                                puzzleSchema.parse(
                                    JSON.parse(item.puzzleStatus)
                                )
                            )
                    ),
                    medium: calculateStats(
                        parsed
                            .filter(item => item.puzzle.includes('[medium]'))
                            .map(item =>
                                puzzleSchema.parse(
                                    JSON.parse(item.puzzleStatus)
                                )
                            )
                    ),
                    hard: calculateStats(
                        parsed
                            .filter(item => item.puzzle.includes('[hard]'))
                            .map(item =>
                                puzzleSchema.parse(
                                    JSON.parse(item.puzzleStatus)
                                )
                            )
                    ),
                };

                return ok(JSON.stringify(body), origin);
            } catch (error) {
                console.error(error);
                return internalServerError(origin);
            }
        }

        default: {
            return notFound(origin);
        }
    }
}
