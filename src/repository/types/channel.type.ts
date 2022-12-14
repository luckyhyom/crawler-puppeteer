export type Channel = {
    id?: number;
    channel_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    published_at: string;
    category: string;
    for_calc_revenue: number;
    max_supply: number;
    getCategory(): string[];
};
