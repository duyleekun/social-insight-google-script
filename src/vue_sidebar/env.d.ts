/// <reference types="vite/client" />
declare var google: { script: { run: GoogleScriptRun } };

interface GoogleScriptRun {
    withFailureHandler: (handler: (error: any) => void) => GoogleScriptRun;
    withSuccessHandler: (handler: (response: any) => void) => GoogleScriptRun;
    withUserObject: (userObject: any) => GoogleScriptRun;

    [x: string]: (...any) => void;
}

interface FacebookDataResponse<T> {
    data: Array<T>;
    paging?: {
        cursors?: {
            before?: string;
            after?: string;
        }
        previous?: string;
        next?: string;
    };
}

interface FacebookAuthResponse {
    status: string;
    authResponse: {
        accessToken: string;
        expiresIn: string;
        signedRequest: string;
        userID: string;
    };
}

export interface FacebookAccount {
    id: string;
    name: string;
    access_token: string;
    category: string;
    category_list: Array<{
        id: string;
        name: string;
    }>;
    tasks: Array<string>;
}
