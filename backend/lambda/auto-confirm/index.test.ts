import { describe, expect, it } from 'vitest';
import { type PreSignUpTriggerEvent } from 'aws-lambda';
import { handler } from './index.js';

describe('handler', () => {
    const event: PreSignUpTriggerEvent = {
        version: '1',
        region: 'test-region',
        userPoolId: 'test-region_test',
        userName: 'test-user',
        callerContext: {
            awsSdkVersion: 'aws-sdk-unknown-unknown',
            clientId: 'testid',
        },
        triggerSource: 'PreSignUp_SignUp',
        request: { userAttributes: {}, validationData: undefined },
        response: {
            autoConfirmUser: false,
            autoVerifyEmail: false,
            autoVerifyPhone: false,
        },
    };

    it('should auto-confirm users', async () => {
        const updated = await handler(event, {});

        expect(updated.response.autoConfirmUser).toBe(true);
    });
});
