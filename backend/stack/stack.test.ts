import { describe, expect, it } from 'vitest';
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from './stack.js';

describe('Stack', () => {
    it('synthesises correctly', () => {
        const app = new cdk.App({
            context: {
                'aws:cdk:bundling-stacks': [],
            },
        });
        const stack = new Stack(app, 'doublets-game-dev', {
            DEPLOY_ENV: 'dev',
            CERTIFICATE_ARN: 'test-arn',
            USER_POOL_ID: 'test-id',
            USER_POOL_CLIENT_ID: 'test-id',
            DEV_DOMAIN: 'test-domain',
        });

        const template = Template.fromStack(stack);
        expect(template.toJSON()).toMatchSnapshot();
    }, 20_000);
});
