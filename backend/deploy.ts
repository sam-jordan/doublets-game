import process from 'node:process';
import * as cdk from 'aws-cdk-lib';
import { Stack } from './stack.js';
import { environment } from './environment.js';

process.loadEnvFile('./backend/.env');
const env = environment.parse(process.env);

const app = new cdk.App();
new Stack(app, 'doublets', env);
