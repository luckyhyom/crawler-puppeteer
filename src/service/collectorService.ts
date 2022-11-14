import * as timer from '../utils/timer.js';
import * as noxApi from '../repository/nox_api.js';
import * as channelsRepository from '../repository/channelsRepository.js';
import * as channelHistoryRepository from '../repository/channelHistoryRepository.js';


export const collectFromNox = async (key: string) => {
    const channels = await channelsRepository.find(['channel_id']);
    for (const channel of channels) {
        const date = timer.getPast(365);
        const history = await channelHistoryRepository.getOneEqual({ date });
        if (history) continue;

        const list = await noxApi.getHistory_ViewCount_SubscriberCount(channel.channel_id, key);
        for (const [key, data] of list) {
            await channelHistoryRepository.saveOne({
                channel_id: channel.channel_id,
                daily_view_count: data.daily_view_count,
                total_view_count: 0,
                subscriber_count: data.subscriber_count,
                date: key,
                video_count: undefined,
            });
        }
    }
}