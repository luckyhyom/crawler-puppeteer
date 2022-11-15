import * as timer from '../utils/timer.js';
import * as channelsRepository from '../repository/channelsRepository.js';
import * as channelHistoryRepository from '../repository/channelHistoryRepository.js';
import * as youtubeApi from '../repository/yotube_api.js';
import { Channel } from '../repository/types/channel.type.js';
import { YouTubeHistoryResult } from '../repository/types/youtube_api.type.js';
import { ChannelDto } from '../dto/get.channels.dto.js';
import { GetChannelHistoryRes } from '../dto/get.channel-history.dto.js';
import { ChannelHistory } from '../repository/types/channelHistory.type.js';
import { ChannelMonthlyRevenueDto, GetChannelMonthlyRevenueRes } from '../dto/get.channel-monthly-revenue.dto.js';

// DTO 변경해야함
export const getManyByTitle = async (title: string): Promise<ChannelDto[]> => {
    const channelList = await channelsRepository.getManyByTitle(title) ?? await createChannelsBy(title);
    const added = channelList.map(async (channel: Channel) => {
        const history = await channelHistoryRepository.getOneEqual({ channel_id: channel.channel_id });
        const nowDate = timer.getPast();

        if (history?.date === nowDate) {
            return new ChannelDto(channel.channel_id, channel.thumbnail_url, history.subscriber_count, channel.channel_id, channel.published_at, channel.category);
        } else {
            const newHistory = await createChannelHistory(channel.channel_id);
            return new ChannelDto(channel.channel_id, channel.thumbnail_url, newHistory.subscriber_count, channel.channel_id, channel.published_at, newHistory.category);
        }
    });
    const result = await Promise.all(added);;
    return result;
}

export const getOneByChannelId = async (channel_id: string): Promise<ChannelDto> => {
    const channel = await channelsRepository.getOneEqual({ channel_id });
    const history = await channelHistoryRepository.getOneEqual({ channel_id: channel.channel_id });
    return new ChannelDto(channel.channel_id, channel.thumbnail_url, history.subscriber_count, channel.channel_id, channel.published_at, channel.category);
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

async function createChannelHistory(channel_id: string): Promise<YouTubeHistoryResult> {
    try {
        const viewAndSubCount = await youtubeApi.getCurrentViewAndSubAccCount(channel_id);
        await channelHistoryRepository.saveOne({
            channel_id: viewAndSubCount.channel_id,
            daily_view_count: 0,
            total_view_count: viewAndSubCount.total_view_count,
            subscriber_count: viewAndSubCount.subscriber_count,
            video_count: viewAndSubCount.video_count,
            date: timer.getPast(),
        });
        await channelsRepository.update({
            channel_id,
        }, { category: viewAndSubCount.category })
        return viewAndSubCount;
    } catch (error) {
        console.log(error);

        return {
            channel_id,
            total_view_count: 0,
            subscriber_count: 0,
            video_count: 0,
            category: '',
        }
    }
}

export async function getHistory(channel_id: string): Promise<GetChannelHistoryRes[]> {
    const result = await channelHistoryRepository.getMany(channel_id);
    console.log(result);

    return result.map((history) => new GetChannelHistoryRes(history.date, history.daily_view_count, history.subscriber_count));
}

export async function getMonthlyRevenue(channel_id: string): Promise<GetChannelMonthlyRevenueRes> {
    const historyList = await channelHistoryRepository.getMany(channel_id);
    const map = new Map<string, { date: string, profitPerShare: number }>();
    const history: ChannelMonthlyRevenueDto[] = [];
    const channel = await channelsRepository.getOneEqual({ channel_id });

    const years: string[] = historyList.map(item => {
        if (!map.get(item.getMonth())) {
            map.set(item.getMonth(), {
                date: item.getMonth(),
                profitPerShare: item.daily_view_count,
            });
            return item.getYear();
        }
        map.set(item.getMonth(), {
            date: item.getMonth(),
            profitPerShare: map.get(item.getMonth())!.profitPerShare + item.daily_view_count,
        });
        return item.getYear();
    });

    map.forEach((value) => {
        value.profitPerShare = Math.floor((value.profitPerShare * channel.for_calc_revenue) / channel.max_supply);
        history.push(new ChannelMonthlyRevenueDto(value.date, value.profitPerShare));
    });

    return new GetChannelMonthlyRevenueRes(history.sort((a, b) => +new Date(a.date) - +new Date(b.date)), [...new Set(years)]);
}