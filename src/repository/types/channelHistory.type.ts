export type ChannelHistory = {
    id?: number
    channel_id: string,
    date: string,
    subscriber_count: number,
    daily_view_count: number,
    total_view_count: number,
    video_count: number,
}

//type a = Pick<ChannelHistory,'id', 'channel_id'>