import * as config from '../config.js';
import fetch from 'node-fetch';
import { YouTubeHistoryJSON, YouTubeHistoryResult, YouTubeSearchJSON } from './types/youtube_api.type.js';
import { Channel } from './types/channel.type.js';

export const searchTitle = async (title: string): Promise<Partial<Channel>[]> => {
    const request = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${config.YOUTUBE_API_KEY()}&type=channel&maxResults=10&q=${title}`);
    const channelList = await request.json() as YouTubeSearchJSON;
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

export const getCurrentViewAndSubAccCount = async (channel_id: string): Promise<YouTubeHistoryResult> => {
    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id&part=snippet&part=topicDetails&part=statistics&part=contentDetails&id=${channel_id}&key=${config.YOUTUBE_API_KEY()}`);
    const result: YouTubeHistoryJSON = await res.json() as YouTubeHistoryJSON;
    if (result?.error?.code) {
        console.log(result?.error);
        throw new Error('50501');
    }
    const category: string[] = result?.items[0]?.topicDetails?.topicCategories?.map(url => url?.split('\/').slice(-1)[0]) ?? ['None'];

    const channelData = {
        channel_id,
        subscriber_count: result.items[0].statistics.subscriberCount,
        video_count: result.items[0].statistics.videoCount,
        total_view_count: result.items[0].statistics.viewCount,
        category: category?.join() ?? undefined,
    }
    return channelData;
};