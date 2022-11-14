export class ChannelMonthlyRevenueDto {
    constructor(
        readonly date: string,
        readonly profitPerShare: number
    ) {
        this.date = new Date(date).toISOString().split('T')[0];
    }
}

export class GetChannelMonthlyRevenueRes {
    constructor(
        private history: ChannelMonthlyRevenueDto[],
        private years: string[],
    ) {
    }
}