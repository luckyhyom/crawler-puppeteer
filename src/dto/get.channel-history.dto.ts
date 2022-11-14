export class GetChannelHistoryRes {
    constructor(
        private date: string,
        private viewCount: number,
        private subscriberCount: number,
    ) {
        this.date = new Date(date).toISOString().split('T')[0];
    }
}
