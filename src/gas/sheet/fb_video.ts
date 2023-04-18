import { FacebookAccount, FacebookDataResponse } from '../../common/env';
import { fetchJson } from '@/sheet/api';
import { flattenObject } from '@/sheet/object_util';
import { writeToSheet } from '@/sheet/sheet_util';


interface FacebookVideoWithLifetimeInsights {
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
    data: Array<{
      name: string
      values: Array<{
        value: number | object
      }>
      id: string
    }>
  };
}
function getFacebookVideosWithLifetimeInsights(facebookAccount: FacebookAccount, limit = 50) {
  console.log('writeFacebookPagesInsights', arguments);
  const videos = [];
  const accessToken = facebookAccount.access_token;
  let pageableUrl = `https://graph.facebook.com/v16.0/me/videos?fields=${encodeURIComponent('content_tags,created_time,description,custom_labels,event,from,icon,id,is_crosspost_video,is_crossposting_eligible,is_episode,is_instagram_eligible,length,place,post_views,published,scheduled_publish_time,source,status,title,universal_video_id,updated_time,views,likes,permalink_url,picture,video_insights{name,values}')}&limit=100`;
  let page = 0;
  let count = 0;
  do {
    console.log(facebookAccount.name, 'page', ++page);
    const { data, paging } = fetchJson({
      url: pageableUrl,
      headers: { Authorization: `Bearer ${accessToken}` },
    }) as FacebookDataResponse<FacebookVideoWithLifetimeInsights>;
    // console.log(data);

    for (const { from, status, video_insights, ...rest } of data) {
      // console.log(metric)
      const processedVideoInsights = video_insights.data.reduce((all, { name, values }) => {
        all[name] = values[0].value;
        return all;
      }, {});
      count++
      videos.push({ ...rest, ...flattenObject(from, 'from'), ...flattenObject(status, 'status'), ...flattenObject(processedVideoInsights, 'video_insights') });
    }
    pageableUrl = paging && paging.next;
  }
  while (pageableUrl && count < limit);
  return videos;
}


export function writeFacebookPostsWithLifetimeInsights(facebookAccounts: FacebookAccount[], limit = 2) {
  const facebookPostsWithLifetimeInsights = facebookAccounts.map(facebookAccount => {
    return getFacebookVideosWithLifetimeInsights(facebookAccount, limit);
  }).flat()
  writeToSheet('videos', facebookPostsWithLifetimeInsights);
}
