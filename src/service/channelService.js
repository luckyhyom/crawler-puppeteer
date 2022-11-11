import * as timer from '../utils/timer.js';
import * as channelsRepository from '../repository/channelsRepository.js';
import * as channelHistoryRepository from '../repository/channelHistoryRepository.js';
import * as youtubeApi from '../repository/yotube_api.js';

export const getManyByTitle = async (title) => {
    const channelList = await channelsRepository.getManyByTitle(title) ?? await createChannelsBy(title);
    const added = channelList.map(async (channel) => await addViewAndSubCount(channel));
    const result = await Promise.all(added);;
    return result;
}

async function createChannelsBy(title) {
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

async function addViewAndSubCount(channel) {
    const addedData = await channelHistoryRepository.getOneEqual({ channel_id: channel.channel_id });
    const nowDate = timer.getPast();

    if (addedData?.date !== nowDate) {
        const history = await createChannelHistory(channel.channel_id, addedData?.total_view_count ?? 0);
        if (history) for (const key in history) addedData[key] = history[key];
    }

    if (addedData) for (const key in addedData) channel[key] = addedData[key];
    return channel;
}

async function createChannelHistory(channel_id, total_view_count) {
    const viewAndSubCount = await youtubeApi.getCurrentViewAndSubAccCount(channel_id);
    await channelHistoryRepository.saveOne({
        channel_id: viewAndSubCount.channel_id,
        daily_view_count: viewAndSubCount.view_count,
        total_view_count,
        subscriber_count: viewAndSubCount.subscriber_count,
        video_count: viewAndSubCount.video_count,
        date: timer.getPast(),
    });
    return viewAndSubCount;
}