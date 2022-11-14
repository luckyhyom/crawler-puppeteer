import * as timer from '../utils/timer.js';
import * as channelsRepository from '../repository/channelsRepository.js';
import * as channelHistoryRepository from '../repository/channelHistoryRepository.js';
import * as youtubeApi from '../repository/yotube_api.js';
import { Channel } from '../repository/types/channel.type.js';
import { YouTubeHistoryResult } from '../repository/types/youtube_api.type.js';

export const getManyByTitle = async (title: string) => {
    const channelList = await channelsRepository.getManyByTitle(title) ?? await createChannelsBy(title);
    const added = channelList.map(async (channel: Channel) => await addViewAndSubCount(channel));
    const result = await Promise.all(added);;
    return result;
}

export const getOneByChannelId = async (channel_id: string) => {
    //const channelList = await channelsRepository.getManyByTitle(title) ?? await createChannelsBy(title);
    //const added = channelList.map(async (channel) => await addViewAndSubCount(channel));
    //const result = await Promise.all(added);;
    const channel = await channelsRepository.getOneEqual({ channel_id });
    return channel;
}

async function createChannelsBy(title: string) {
    const channelListFrom = await youtubeApi.searchTitle(title);
    const channelListAddedSubInfo = channelListFrom.map(async (channel) => {
        const existedChannel = await channelsRepository.getOneEqual({ channel_id: channel.channel_id });
        if (existedChannel) {
            await channelsRepository.update({ channel_id: channel.channel_id }, {
                title: channel.title,
                description: channel.description,
                thumbnail_url: channel.thumbnail_url,
                published_at: channel.published_at,
            });
        } else if (!existedChannel) {
            await channelsRepository.saveOne(channel);
        }
        return channel;
    });

    const result = await Promise.all(channelListAddedSubInfo);
    return result;
}

async function addViewAndSubCount(channel: Channel) {
    const gotone = await channelHistoryRepository.getOneEqual({ channel_id: channel.channel_id });
    const addedData = gotone[0];
    const nowDate = timer.getPast();
    if (addedData?.date !== nowDate) {
        const history = await createChannelHistory(channel.channel_id, addedData?.daily_view_count ?? 0);
        if (history) for (const key in history) addedData[key] = history[key as keyof typeof history];
    }
    if (addedData) for (const key in addedData) {
        const value = addedData[key]; // channel[key] = addedData[key]
        if (key === 'date') channel.channel_id = value;
        else if (key === 'subscriber_count') channel.title = value;
        else if (key === 'daily_view_count') channel.description = value;
        else if (key === 'total_view_count') channel.thumbnail_url = value;
        else if (key === 'video_count') channel.published_at = value;
    }
    return channel;
}

async function createChannelHistory(channel_id: string, daily_view_count: number): Promise<YouTubeHistoryResult> {
    try {
        const viewAndSubCount = await youtubeApi.getCurrentViewAndSubAccCount(channel_id);
        await channelHistoryRepository.saveOne({
            channel_id: viewAndSubCount.channel_id,
            daily_view_count,
            total_view_count: viewAndSubCount.total_view_count,
            subscriber_count: viewAndSubCount.subscriber_count,
            video_count: viewAndSubCount.video_count,
            date: timer.getPast(),
        });
        return viewAndSubCount;
    } catch (error) {
        return {
            channel_id,
            total_view_count: 0,
            subscriber_count: 0,
            video_count: 0,
            category: '',
        }
    }
}


export async function getHistory(channel_id: string) {
    return await channelHistoryRepository.getMany(channel_id);
}