import {FacebookAccount, FacebookDataResponse, FacebookVideoWithLifetimeInsights, SingleLevelInsight} from '../../common/env';
import {fetchJson} from '@/lib/api';
import {flattenObject, mapToArray} from '@/lib/object_util';
import {toastMessage, writeToSheet} from '@/lib/sheet_util';


const fields = [
    'content_tags',
    'created_time',
    'description',
    'custom_labels',
    'event',
    'from',
    'icon',
    'id',
    'is_crosspost_video',
    'is_crossposting_eligible',
    // 'is_episode',
    // 'is_instagram_eligible',
    'length',
    'post_views',
    'published',
    // 'scheduled_publish_time',
    'source',
    'status',
    'title',
    'universal_video_id',
    // 'updated_time',
    'views',
    // 'likes',
    'permalink_url',
    'picture',
    `video_insights{name,values}`
]


function getFacebookVideosWithLifetimeInsights(facebookAccount: FacebookAccount, datePageLimit) {
    console.log('writeFacebookPagesInsights', arguments);
    const videos : FacebookVideoWithLifetimeInsights[] = [];
    const accessToken = facebookAccount.access_token;
    let pageableUrl = `https://graph.facebook.com/v16.0/me/video_reels?fields=${encodeURIComponent(fields.join(','))}&limit=50`;
    let page = 0;
    let count = 0;
    let datePage = 0;
    do {
        console.log(facebookAccount.name, 'page', ++page,'datePage', datePage);
        toastMessage(facebookAccount.name, 'page', ++page,'datePage', datePage);
        const {data, paging} = fetchJson({
            url: pageableUrl,
            headers: {Authorization: `Bearer ${accessToken}`},
        }) as FacebookDataResponse<FacebookVideoWithLifetimeInsights>;
        // console.log(data);
        videos.push(...data)
        pageableUrl = paging && paging.next;
        count += data.length
        datePage = (new Date().getTime() - new Date(data[data.length-1].created_time).getTime())/(1000*60*60*24);
    }
    while (pageableUrl && datePage <= datePageLimit);
    return videos;
}

interface Output {
    video_insights: any[];
}

function processForSingleAndMultiLevelMetric(data: FacebookVideoWithLifetimeInsights[]) {
    const out = <Output>{
        video_insights: []
    }
    data.forEach(({from, status, video_insights, ...rest}) => {
        const rowPrefix = {id: rest.id}
        const processedVideoInsights = video_insights.data.reduce((innerAll, datum) => {
            let {name} = datum
            innerAll['video_insights'][0] ||= {...rest, ...flattenObject(from, 'from'), ...flattenObject(status, 'status')};
            innerAll['video_insights'][0][name] = (datum as SingleLevelInsight).values[0].value
            return innerAll;
        }, <Output>{
            video_insights: []
        });
        for (const key in out) {
            out[key].push(...processedVideoInsights[key].map((ele) => flattenObject(ele)))
        }
    });

    return out
}

export function writeFacebookReelsWithLifetimeInsights(facebookAccounts: FacebookAccount[], limit) {
    const facebookPostsWithLifetimeInsights = facebookAccounts.map(facebookAccount => {
        return getFacebookVideosWithLifetimeInsights(facebookAccount, limit);
    }).flat()

    const processedFacebookPostsWithLifetimeInsights = processForSingleAndMultiLevelMetric(facebookPostsWithLifetimeInsights)
    for (const key in processedFacebookPostsWithLifetimeInsights) {
        console.log('key', key)
        // console.log('processedFacebookPostsWithLifetimeInsights', processedFacebookPostsWithLifetimeInsights[key])
        writeToSheet(`fb_reel.${key}`, processedFacebookPostsWithLifetimeInsights[key]);
    }
}
