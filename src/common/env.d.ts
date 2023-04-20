
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

export type SingleLevelInsight = {
    name: string
    values: Array<{
        value: number
    }>
    id: string
}

export type MultiLevelInsight = {
    name: string
    values: Array<{
        value: { [k in string]: number }
    }>
    id: string
}

export interface FacebookVideoWithLifetimeInsights {
    created_time: string;
    description: string;
    custom_labels: Array<string>;
    from: {
        name: string
        id: string
    };
    icon: string;
    id: string;
    is_crosspost_video: boolean;
    is_crossposting_eligible: boolean;
    is_episode: boolean;
    is_instagram_eligible: boolean;
    is_reference_only: boolean;
    length: number;
    post_views: number;
    published: boolean;
    source: string;
    status: {
        video_status: string
        uploading_phase: {
            status: string
        }
        processing_phase: {
            status: string
        }
        publishing_phase: {
            status: string
            publish_status: string
            publish_time: string
        }
    };
    title: string;
    universal_video_id: string;
    updated_time: string;
    views: number;
    permalink_url: string;
    picture: string;
    video_insights: {
        data: Array<MultiLevelInsight | SingleLevelInsight>
    };
}
