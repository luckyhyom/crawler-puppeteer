import fetch from 'node-fetch';
import { NoxHistoryJSON, SubscriberCountHistoryJSON, ViewCountHistoryJSON } from './types/nox_api.type';
/**
 * 1년전까지의 데이터 조회가 가능하다.
 */

/**
 * @returns {
 * { 
 *  '2022-11-11': {
 *      daily_view_count: 725000,
 *      subscriber_count: 7021500
 *  }
 * }
 */

export const getHistory_ViewCount_SubscriberCount = async (channel_id: string, key: string) => {
    const dailyViewCountHistoryAsync = getDailyViewCountHistory(channel_id, key);
    const subscriberCountHistoryAsync = getSubscriberCountHistory(channel_id, key);
    const viewCountHistory: ViewCountHistoryJSON = await dailyViewCountHistoryAsync;
    const subscriberCountHistory: SubscriberCountHistoryJSON = await subscriberCountHistoryAsync;

    const result = new Map();

    viewCountHistory.map((data) => {
        if (!result.get(data.date)) result.set(data.date, {});
        result.get(data.date)['daily_view_count'] = data.value;
    });

    subscriberCountHistory.map((data) => {
        if (!result.get(data.date)) result.set(data.date, {});
        result.get(data.date)['subscriber_count'] = data.value;
    });
    return result;
}


const getSubscriberCountHistory = async (channel_id: string, key: string) => {
    // 구독자수 type=total&dimension=sub&interval=daily
    const subscriberCountURL = `https://kr.noxinfluencer.com/ws/star/trend/${channel_id}?type=total&dimension=sub&interval=daily&r=${key}`;
    const subscriberCount = await fetch(subscriberCountURL);
    const data = await subscriberCount.json() as NoxHistoryJSON;
    return data.retData?.history ?? [];
}

const getDailyViewCountHistory = async (channel_id: string, key: string) => {
    // 조회수 type=increase&dimension=view&interval=daily
    const dailyViewCountURL = `https://kr.noxinfluencer.com/ws/star/trend/${channel_id}?type=increase&dimension=view&interval=daily&r=${key}`;
    const dailyViewCount = await fetch(dailyViewCountURL);
    const data = await dailyViewCount.json() as NoxHistoryJSON;
    return data.retData?.history ?? [];
}

