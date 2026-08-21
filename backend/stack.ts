import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { type Environment } from './environment.js';

export class Stack extends cdk.Stack {
    constructor(
        scope: cdk.App,
        id: string,
        props: cdk.StackProps & Environment
    ) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, `${id}-bucket-${props.DEPLOY_ENV}`, {
            bucketName: `${id}-bucket-${props.DEPLOY_ENV}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });

        new BucketDeployment(
            this,
            `${id}-bucket-deployment-${props.DEPLOY_ENV}`,
            {
                destinationBucket: bucket,
                sources: [Source.asset('./frontend/build')],
            }
        );

        // Only link to domain in prod environment
        const IS_DEV = props.DEPLOY_ENV === 'dev';

        new cf.Distribution(this, `${id}-distribution-${props.DEPLOY_ENV}`, {
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
    }
}
