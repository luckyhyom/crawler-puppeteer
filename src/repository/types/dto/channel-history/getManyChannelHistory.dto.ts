export class GetManyChannelHistoryRes {
    constructor(
        readonly date: string,
        readonly subscriber_count: number,
        readonly daily_view_count: number
    ) {
        this.date = new Date(date).toISOString().split('T')[0];
    }

    getMonth() {
        const year = this.date.split('-')[0]
        const month = this.date.split('-')[1]
        return year + '-' + month
    }
    getYear() {
        return this.date.split('-')[0];
    }
}