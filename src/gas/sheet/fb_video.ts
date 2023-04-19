import { FacebookAccount, FacebookDataResponse } from '../../common/env';
import { fetchJson } from '@/lib/api';
import {flattenObject, mapToArray} from '@/lib/object_util';
import { writeToSheet } from '@/lib/sheet_util';

type SingleLevelInsight = {
  name: string
  values: Array<{
    value: number
  }>
  id: string
}

type MultiLevelInsight =  {
  name: string
  values: Array<{
    value: {[k in string]: number}
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

function getFacebookVideosWithLifetimeInsights(facebookAccount: FacebookAccount, limit = 50) {
  console.log('writeFacebookPagesInsights', arguments);
  const videos = [];
  const accessToken = facebookAccount.access_token;
  let pageableUrl = `https://graph.facebook.com/v16.0/me/videos?fields=${encodeURIComponent('content_tags,created_time,description,custom_labels,event,from,icon,id,is_crosspost_video,is_crossposting_eligible,is_episode,is_instagram_eligible,length,place,post_views,published,scheduled_publish_time,source,status,title,universal_video_id,updated_time,views,likes,permalink_url,picture,video_insights{name,values}')}&limit=${limit}`;
  let page = 0;
  let count = 0;
  do {
    console.log(facebookAccount.name, 'page', ++page);
    const { data, paging } = fetchJson({
      url: pageableUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
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
  data.forEach(({ from, status, video_insights, ...rest }) => {

    // console.log(metric)
    const rowPrefix = {...rest, ...flattenObject(from, 'from'), ...flattenObject(status, 'status')}
    const processedVideoInsights = video_insights.data.reduce((innerAll, datum) => {
      let {name} = datum
      switch (name) {
        case 'total_video_retention_graph':
        case 'total_video_retention_graph_autoplayed':
        case 'total_video_retention_graph_gender_male':
        case 'total_video_retention_graph_gender_female':
        case 'total_video_retention_graph_clicked_to_play':
          innerAll[name] = mapToArray((datum as MultiLevelInsight).values[0].value,(k)=> {
            return {...rowPrefix, retention_slot: k}
          })
          break;
        case 'total_video_view_time_by_region_id':
          innerAll[name] = mapToArray((datum as MultiLevelInsight).values[0].value,(k)=> {
            return {...rowPrefix, region_id: k}
          })
          break;
        case 'total_video_view_time_by_age_bucket_and_gender':
          innerAll[name] = mapToArray((datum as MultiLevelInsight).values[0].value,(k)=> {
            const [gender, age_range] = k.split('.')
            return {...rowPrefix, gender, age_range}
          })
          break;
        case 'total_video_view_time_by_country_id':
          innerAll[name] = mapToArray((datum as MultiLevelInsight).values[0].value,(k)=> {
            return {...rowPrefix, country: k}
          })
          break
        default:
          innerAll['video_insights'][0] ||= {...rowPrefix};
          innerAll['video_insights'][0][name] = (datum as SingleLevelInsight).values[0].value
      }


      return innerAll;
    }, <Output>{
      total_video_retention_graph: [],
      total_video_retention_graph_gender_male: [],
      total_video_retention_graph_gender_female: [],
      total_video_retention_graph_autoplayed: [],
      total_video_retention_graph_clicked_to_play: [],

      total_video_view_time_by_region_id: [],
      total_video_view_time_by_age_bucket_and_gender: [],
      total_video_view_time_by_country_id: [],
      video_insights: []
    });
    for (const key in out) {
      out[key].push(...processedVideoInsights[key].map((ele)=> flattenObject(ele, key)))
    }
  });
  return out
}

export function writeFacebookPostsWithLifetimeInsights(facebookAccounts: FacebookAccount[], limit = 2) {
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
