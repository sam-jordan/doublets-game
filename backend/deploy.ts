import * as cdk from 'aws-cdk-lib';
import { Stack } from './stack.js';

const app = new cdk.App();
new Stack(app, 'doublets', {});
