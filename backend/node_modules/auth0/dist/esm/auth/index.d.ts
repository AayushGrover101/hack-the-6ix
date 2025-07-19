import { IBackchannel } from './backchannel.js';
import { AuthenticationClientOptions } from './base-auth-api.js';
import { Database } from './database.js';
import { OAuth } from './oauth.js';
import { Passwordless } from './passwordless.js';
import { ICustomTokenExchange } from './tokenExchange.js';
export * from './database.js';
export * from './oauth.js';
export * from './passwordless.js';
export { IDTokenValidateOptions, IdTokenValidatorError } from './id-token-validator.js';
export { AuthApiError, AuthenticationClientOptions } from './base-auth-api.js';
export declare class AuthenticationClient {
    database: Database;
    oauth: OAuth;
    passwordless: Passwordless;
    backchannel: IBackchannel;
    tokenExchange: ICustomTokenExchange;
    constructor(options: AuthenticationClientOptions);
}
