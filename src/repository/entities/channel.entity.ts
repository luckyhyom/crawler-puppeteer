import { Channel } from '../types/channel.type';

type CategoryFactoeyType = {
    Society: '지식/정보';
};

export class ChannelEntity implements Channel {
    id?: number | undefined;
    channel_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    published_at: string;
    category: string;
    for_calc_revenue: number;
    max_supply: number;

    // 블링을 기준으로 카테고리 네이밍
    categoryFactory: CategoryFactoeyType = {
        Society: '지식/정보',
    };

    constructor(channel: Channel) {
        const cate = channel.category
            .split(',')
            .map((cate) => this.translate(cate))
            .join(',');
        this.id = channel.id;
        this.channel_id = channel.channel_id;
        this.title = channel.title;
        this.description = channel.description;
        this.thumbnail_url = channel.thumbnail_url;
        this.published_at = channel.published_at;
        this.category = cate;
        this.for_calc_revenue = channel.for_calc_revenue;
        this.max_supply = channel.max_supply;
    }

    private translate(value: string): string {
        //if(value === 'Society') this.categoryFactory[value as typeof value];
        //return this.categoryFactory[value as typeof value] ?? value;
        if (value === 'Society') return '지식/정보';
        return value;
    }

    getCategory(): string[] {
        return this.category.split(',');
    }
}
