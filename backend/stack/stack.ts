import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
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

        new NodejsFunction(this, `${id}-auto-confirm-lambda`, {
            functionName: `${id}-auto-confirm-lambda`,
            runtime: Runtime.NODEJS_24_X,
        });

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
        });
        userPool.addClient(`${id}-client`, {
            authFlows: {
                userSrp: true,
            },
        });
    }
}
