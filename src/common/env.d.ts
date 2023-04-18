
export interface FacebookDataResponse<T> {
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


export interface FacebookAuthResponse {
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
