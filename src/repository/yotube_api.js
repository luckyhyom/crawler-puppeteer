import * as config from '../config.js';
import fetch from 'node-fetch';

export const searchTitle = async (title) => {
    const request = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${config.YOUTUBE_API_KEY1}&type=channel&maxResults=10&q=${title}`);
    const channelList = await request.json();
    const result = channelList.items.map((channel) => {
        return {
            channel_id: channel.snippet.channelId,
            title: channel.snippet.title,
            description: channel.snippet.description,
            published_at: channel.snippet.publishedAt?.split('T')[0],
            thumbnail_url: channel.snippet.thumbnails.medium.url,
        }
    });
    return result;
};

export const getCurrentViewAndSubAccCount = async (channel_id) => {
    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id&part=snippet&part=topicDetails&part=statistics&part=contentDetails&id=${channel_id}&key=${config.YOUTUBE_API_KEY1}`);
    const result = await res.json();
    if (result?.error?.code) return;
    let category;
    if (result?.items === undefined) category = undefined;
    else category = result.items[0].topicDetails.topicCategories.map(url => url.split('\/').slice(-1)[0]);

    const channelData = {
        channel_id,
        subscriber_count: result.items[0].statistics.subscriberCount,
        video_count: result.items[0].statistics.videoCount,
        view_count: result.items[0].statistics.viewCount,
        category: category.join(),
    }
    return channelData;
};








/**
 * https://www.googleapis.com/youtube/v3/search?part=snippet&key={API_KEY}&type=channel&maxResults=10&q=오킹
 * body.items[0].snippet.publidshedAt
 * body.items[0].snippet.channelId
 * body.items[0].snippet.title
 * body.items[0].snippet.description
 * body.items[0].snippet.thumbnails.medium.url
 */