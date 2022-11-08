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
    let addedData = await channelHistoryRepository.getOneEqual({ channel_id: channel.channel_id });
    const now = new Date();
    const nowDate = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();
    if (addedData.date !== nowDate) addedData = await createChannelHistory(channel.channel_id);
    channel.subscriber_count = addedData.subscriber_count;
    channel.video_count = addedData.video_count;
    channel.view_count = addedData.view_count;
    channel.category = addedData.category;
    return channel;
}

async function createChannelHistory(channel_id) {
    const viewAndSubCount = await youtubeApi.getViewAndSubAccCount(channel_id);
    await channelHistoryRepository.saveOne(viewAndSubCount);
    return viewAndSubCount;
}