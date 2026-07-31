import * as cdk from 'aws-cdk-lib';

export class Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        console.log('Hello, AWS!');
    }
}
