/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */
import {fetchJson} from "@/sheet/api";
import {writeToSheet} from "@/sheet/sheet_util";
import {FacebookAccount, FacebookDataResponse, FacebookInsightResponse} from "../../common/env";

class MyPreProcessedInsightType {
    date: string
    metric_type: string
    page_id: string
    page_name: string
    value: number

    constructor(date: string, metric_type: string, page_id: string, page_name: string, value: number) {
        this.date = date;
        this.metric_type = metric_type;
        this.page_id = page_id;
        this.page_name = page_name;
        this.value = value;
    }
    getKey() {
        return [this.date, this.page_id].join('--')
    }
}

interface MyProcessedInsightType {
    date: string
    page_id: string
    page_name: string

    [x: string]: number | string
}


function getFacebookPageInsights(facebookAccount: FacebookAccount, metrics: string[], period = 'day', date_preset = 'last_90d') {
    console.log('writeFacebookPagesInsights', arguments)
    const insightsData: MyPreProcessedInsightType[] = [];
    const accessToken = facebookAccount.access_token;
    let pageableUrl = `https://graph.facebook.com/v16.0/${facebookAccount.id}/insights?metric=${metrics.join(',')}&period=${period}&date_preset=${date_preset}`
    let page = 0
    do {
        console.log(facebookAccount.name, 'page', ++page)
        const {data, paging} = fetchJson({
            url: pageableUrl,
            headers: {Authorization: `Bearer ${accessToken}`}
        }) as FacebookInsightResponse
        // console.log(data);
        for (const metric of data) {
            // console.log(metric)
            for (const value of metric.values) {
                // console.log(value)
                const insight = new MyPreProcessedInsightType(
                    value.end_time.substring(0, 10),
                    metric.name,
                    facebookAccount.id,
                    facebookAccount.name,
                    value.value
                );
                insightsData.push(insight);
            }
        }
        pageableUrl = paging && paging.next
    }
    while (pageableUrl)

    return insightsData;
}

export function writeFacebookPagesInsights(facebookAccounts: FacebookAccount[], metrics: string[], period = 'day', date_preset = 'last_90d') {
    const processedMetricType: MyProcessedInsightType[] = facebookAccounts.map(facebookAccount => {
        return getFacebookPageInsights(facebookAccount, metrics, period, date_preset);
    }).flat().reduce((all, ele, i) => {
        const {getKey, metric_type, value, ...rest} = ele
        all[ele.getKey()] ||= {...rest}
        all[ele.getKey()][metric_type] = value
        return all
    }, [] as MyProcessedInsightType[])
    writeToSheet('Facebook Pages', Object.values(processedMetricType));
}
