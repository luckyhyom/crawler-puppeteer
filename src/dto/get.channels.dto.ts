export class ChannelDto { // VO, Entity, DTO, Type
    //id?: number | undefined;
    //channel_id: string;
    //description: string;
    //thumbnail_url: string;
    //published_at: string;
    constructor(
        private title: string,
        private image: string,
        private subscriberCount: number,
        private channelId: string,
        private publishedAt: string,
        private category: string,
    ) {
    }
}