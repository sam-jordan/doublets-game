import { type Context, type PreSignUpTriggerEvent } from 'aws-lambda';

export async function handler(
    event: PreSignUpTriggerEvent,
    _context: Context
): Promise<PreSignUpTriggerEvent> {
    event.response.autoConfirmUser = true;

    return event;
}
