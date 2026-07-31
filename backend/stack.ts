import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'bucket', {
            bucketName: 'doublets-game-static-bucket',
            // AccessControl: s3.BucketAccessControl.PRIVATE,
            // enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteIndexDocument: 'index.html',
        });

        new BucketDeployment(this, 'bucket-deployment', {
            destinationBucket: bucket,
            sources: [Source.asset('./frontend/build')],
        });
    }
}
