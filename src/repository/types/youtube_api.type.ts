export type YouTubeSearchJSON = {
    items: {
        snippet: {
            channelId: string,
            title: string,
            description: string,
            publishedAt: string,
            thumbnails: {
                medium: {
                    url: string
                }
            }
        }
    }[]
}

export type YouTubeHistoryJSON = {
    items: [{
        statistics: {
            subscriberCount: number
            videoCount: number
            viewCount: number
        },
        topicDetails: { topicCategories: string[] }
    }],
    error: { code: string }
}

export type YouTubeHistoryResult = {
    channel_id: string,
    subscriber_count: number,
    video_count: number,
    total_view_count: number,
    category: string,
}
