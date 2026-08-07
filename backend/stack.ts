import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'bucket', {
            bucketName: 'doublets-game-static-bucket',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        new BucketDeployment(this, 'bucket-deployment', {
            destinationBucket: bucket,
            sources: [Source.asset('./frontend/build')],
        });

        new cf.Distribution(this, 'distribution', {
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(bucket),
            },
            defaultRootObject: 'index.html',
        });
    }
}
