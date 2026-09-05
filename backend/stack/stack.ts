import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { type Environment } from './environment.js';

export class Stack extends cdk.Stack {
    constructor(
        scope: cdk.App,
        id: string,
        props: cdk.StackProps & Environment
    ) {
        super(scope, id, props);

        // Only link to domain in prod environment
        const IS_DEV = props.DEPLOY_ENV === 'dev';

        const bucket = new s3.Bucket(this, `${id}-bucket`, {
            bucketName: `${id}-bucket`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });

        new BucketDeployment(this, `${id}-bucket-deployment`, {
            destinationBucket: bucket,
            sources: [Source.asset('./frontend/build')],
        });

        new cf.Distribution(this, `${id}-distribution`, {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(bucket),
            },
            domainNames: IS_DEV ? undefined : ['www.doublets.app'],
            defaultRootObject: 'index.html',
            certificate: IS_DEV
                ? undefined
                : Certificate.fromCertificateArn(
                      this,
                      'certificate',
                      props.CERTIFICATE_ARN
                  ),
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/',
                },
            ],
        });

        const autoConfirmLambda = new NodejsFunction(
            this,
            `${id}-auto-confirm-lambda`,
            {
                functionName: `${id}-auto-confirm-lambda`,
                runtime: Runtime.NODEJS_24_X,
                entry: './backend/lambda/auto-confirm/index.ts',
            }
        );

        const userPool = new cognito.UserPool(this, `${id}-user-pool`, {
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true,
            },
            selfSignUpEnabled: true,
            removalPolicy: IS_DEV
                ? cdk.RemovalPolicy.DESTROY
                : cdk.RemovalPolicy.RETAIN,
            lambdaTriggers: {
                preSignUp: autoConfirmLambda,
            },
        });
        userPool.addClient(`${id}-client`, {
            authFlows: {
                userSrp: true,
            },
        });

        const table = new dynamo.TableV2(this, `${id}-stats-table`, {
            tableName: `${id}-stats-table`,
            partitionKey: {
                name: 'username',
                type: dynamo.AttributeType.STRING,
            },
            sortKey: { name: 'puzzle', type: dynamo.AttributeType.STRING },
            removalPolicy: IS_DEV
                ? cdk.RemovalPolicy.DESTROY
                : cdk.RemovalPolicy.RETAIN,
        });

        const statsApiLambda = new NodejsFunction(
            this,
            `${id}-stats-api-lambda`,
            {
                functionName: `${id}-stats-api-lambda`,
                runtime: Runtime.NODEJS_24_X,
                entry: './backend/lambda/stats-api/index.ts',
                environment: {
                    TABLE_NAME: `${id}-stats-table`,
                    DEV_DOMAIN: props.DEV_DOMAIN,
                },
            }
        );

        table.grantReadWriteData(statsApiLambda);

        const httpApi = new apigwv2.HttpApi(this, `${id}-stats-api`, {
            apiName: `${id}-stats-api`,
            corsPreflight: {
                allowMethods: [
                    apigwv2.CorsHttpMethod.GET,
                    apigwv2.CorsHttpMethod.POST,
                    apigwv2.CorsHttpMethod.PUT,
                ],
                allowOrigins: ['https://www.doublets.app', props.DEV_DOMAIN],
                allowHeaders: ['Authorization'],
            },
        });

        const integration = new HttpLambdaIntegration(
            `${id}-stats-api-lambda-integration`,
            statsApiLambda
        );

        // const issuer = `https://cognito-idp.eu-west-2.amazonaws.com/${props.USER_POOL_ID}`;
        // const authorizer = new HttpJwtAuthorizer(
        //     `${id}-stats-authorizer`,
        //     issuer,
        //     {
        //         jwtAudience: [props.USER_POOL_CLIENT_ID],
        //         identitySource: ['$request.header.Authorization'],
        //     }
        // );

        httpApi.addRoutes({
            path: '/game/{user}/attempted/{difficulty}',
            methods: [apigwv2.HttpMethod.POST],
            integration,
            // Authorizer,
        });
        httpApi.addRoutes({
            path: '/game/{user}/solved/{difficulty}',
            methods: [apigwv2.HttpMethod.PUT],
            integration,
            // Authorizer,
        });
        httpApi.addRoutes({
            path: '/stats/{user}',
            methods: [apigwv2.HttpMethod.GET],
            integration,
            // Authorizer,
        });
    }
}
