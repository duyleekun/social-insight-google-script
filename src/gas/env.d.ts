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

declare var google: { script: { run: GoogleScriptRun } };
