import {FacebookAccount, FacebookDataResponse, FacebookVideoWithLifetimeInsights, MultiLevelInsight, SingleLevelInsight} from '../../common/env';
import {fetchJson} from '@/lib/api';
import {flattenObject, mapToArray} from '@/lib/object_util';
import {writeToSheet} from '@/lib/sheet_util';

const lifetime_video_metric = [
    'total_video_views',
    // 'total_video_views_unique',
    'total_video_views_autoplayed',
    'total_video_views_clicked_to_play',
    // 'total_video_views_organic',
    // 'total_video_views_organic_unique',
    // 'total_video_views_paid',
    // 'total_video_views_paid_unique',
    // 'total_video_views_sound_on',
    'total_video_views_by_distribution_type',
    'total_video_view_time_by_distribution_type',
    'total_video_view_time_by_country_id',
    'total_video_view_time_by_region_id',
    'total_video_view_time_by_age_bucket_and_gender',
    'total_video_play_count',
    'total_video_consumption_rate',
    'total_video_complete_views',
    // 'total_video_complete_views_unique',
    'total_video_complete_views_auto_played',
    'total_video_complete_views_clicked_to_play',
    // 'total_video_complete_views_organic',
    // 'total_video_complete_views_organic_unique',
    // 'total_video_complete_views_paid',
    // 'total_video_complete_views_paid_unique',
    'video_asset_60s_video_view_total_count_by_is_monetizable',
    'total_video_15min_excludes_shorter_views',
    'total_video_15min_excludes_shorter_views_unique',
    'total_video_60s_excludes_shorter_views',
    'total_video_30s_views',
    // 'total_video_30s_views_unique',
    'total_video_30s_views_auto_played',
    'total_video_30s_views_clicked_to_play',
    // 'total_video_30s_views_organic',
    // 'total_video_30s_views_paid',
    'total_video_10s_views',
    // 'total_video_10s_views_unique',
    'total_video_10s_views_auto_played',
    'total_video_10s_views_clicked_to_play',
    // 'total_video_10s_views_organic',
    // 'total_video_10s_views_paid',
    // 'total_video_10s_views_sound_on',
    'total_video_15s_views',
    'total_video_retention_graph',
    'total_video_retention_graph_autoplayed',
    'total_video_retention_graph_clicked_to_play',
    'total_video_retention_graph_gender_male',
    'total_video_retention_graph_gender_female',
    'total_video_avg_time_watched',
    'total_video_view_total_time',
    // 'total_video_view_total_time_organic',
    // 'total_video_view_total_time_paid',
    'total_video_impressions',
    // 'total_video_impressions_unique',
    // 'total_video_impressions_paid_unique',
    // 'total_video_impressions_paid',
    // 'total_video_impressions_organic_unique',
    // 'total_video_impressions_organic',
    // 'total_video_impressions_viral_unique',
    // 'total_video_impressions_viral',
    // 'total_video_impressions_fan_unique',
    'total_video_impressions_fan',
    // 'total_video_impressions_fan_paid_unique',
    // 'total_video_impressions_fan_paid',
    'total_video_stories_by_action_type',
    'total_video_reactions_by_type_total',
    'total_video_ad_break_earnings',
    'total_video_ad_break_ad_impressions',
    'total_video_ad_break_ad_cpm'
]


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
    `video_insights.metric(${lifetime_video_metric.join(',')}){name,values}`
]


function getFacebookVideosWithLifetimeInsights(facebookAccount: FacebookAccount, limit = 50) {
    console.log('writeFacebookPagesInsights', arguments);
    const videos = [];
    const accessToken = facebookAccount.access_token;
    let pageableUrl = `https://graph.facebook.com/v16.0/me/indexed_videos?fields=${encodeURIComponent(fields.join(','))}&limit=${limit}`;
    let page = 0;
    let count = 0;
    do {
        console.log(facebookAccount.name, 'page', ++page);
        const {data, paging} = fetchJson({
            url: pageableUrl,
            headers: {Authorization: `Bearer ${accessToken}`},
        }) as FacebookDataResponse<FacebookVideoWithLifetimeInsights>;
        // console.log(data);
        videos.push(...data)
        pageableUrl = paging && paging.next;
        count += data.length
    }
    while (pageableUrl && count < limit);
    return videos;
}

interface Output {
    total_video_retention_graph: any[];
    total_video_retention_graph_autoplayed: any[];
    total_video_retention_graph_clicked_to_play: any[];
    total_video_view_time_by_region_id: any[];
    total_video_view_time_by_age_bucket_and_gender: any[];
    total_video_view_time_by_country_id: any[];
    video_insights: any[];
}

function processForSingleAndMultiLevelMetric(data: FacebookVideoWithLifetimeInsights[]) {
    const out = <Output>{
        total_video_retention_graph: [],
        total_video_retention_graph_gender_male: [],
        total_video_retention_graph_gender_female: [],
        total_video_retention_graph_autoplayed: [],
        total_video_retention_graph_clicked_to_play: [],
        total_video_view_time_by_region_id: [],
        total_video_view_time_by_age_bucket_and_gender: [],
        total_video_view_time_by_country_id: [],
        video_insights: []
    }
    data.forEach(({from, status, video_insights, ...rest}) => {

        // console.log(metric)
        const rowPrefix = {id: rest.id}
        const processedVideoInsights = <Output>{
            total_video_retention_graph: [],
            total_video_retention_graph_gender_male: [],
            total_video_retention_graph_gender_female: [],
            total_video_retention_graph_autoplayed: [],
            total_video_retention_graph_clicked_to_play: [],

            total_video_view_time_by_region_id: [],
            total_video_view_time_by_age_bucket_and_gender: [],
            total_video_view_time_by_country_id: [],
            video_insights: []
        }
        video_insights?.data.forEach((datum) => {
            let {name} = datum
            switch (name) {
                case 'total_video_retention_graph':
                case 'total_video_retention_graph_autoplayed':
                case 'total_video_retention_graph_gender_male':
                case 'total_video_retention_graph_gender_female':
                case 'total_video_retention_graph_clicked_to_play':
                    processedVideoInsights[name] = mapToArray((datum as MultiLevelInsight).values[0].value, (k) => {
                        return {...rowPrefix, retention_slot: k}
                    })
                    break;
                case 'total_video_view_time_by_region_id':
                    processedVideoInsights[name] = mapToArray((datum as MultiLevelInsight).values[0].value, (k) => {
                        return {...rowPrefix, region_id: k}
                    })
                    break;
                case 'total_video_view_time_by_age_bucket_and_gender':
                    processedVideoInsights[name] = mapToArray((datum as MultiLevelInsight).values[0].value, (k) => {
                        const [gender, age_range] = k.split('.')
                        return {...rowPrefix, gender, age_range}
                    })
                    break;
                case 'total_video_view_time_by_country_id':
                    processedVideoInsights[name] = mapToArray((datum as MultiLevelInsight).values[0].value, (k) => {
                        return {...rowPrefix, country: k}
                    })
                    break
                default:
                    processedVideoInsights['video_insights'][0] ||= {...rest, ...flattenObject(from, 'from'), ...flattenObject(status, 'status')};
                    processedVideoInsights['video_insights'][0][name] = (datum as SingleLevelInsight).values[0].value
            }


            return processedVideoInsights;
        });
        for (const key in out) {
            out[key].push(...processedVideoInsights[key].map((ele) => flattenObject(ele)))
        }
    });

    return out
}

export function writeFacebookVideosWithLifetimeInsights(facebookAccounts: FacebookAccount[], limit = 2) {
    const facebookPostsWithLifetimeInsights = facebookAccounts.map(facebookAccount => {
        return getFacebookVideosWithLifetimeInsights(facebookAccount, limit);
    }).flat()

    const processedFacebookPostsWithLifetimeInsights = processForSingleAndMultiLevelMetric(facebookPostsWithLifetimeInsights)
    for (const key in processedFacebookPostsWithLifetimeInsights) {
        console.log('key', key)
        // console.log('processedFacebookPostsWithLifetimeInsights', processedFacebookPostsWithLifetimeInsights[key])
        writeToSheet(`fb_video.${key}`, processedFacebookPostsWithLifetimeInsights[key]);
    }
}
