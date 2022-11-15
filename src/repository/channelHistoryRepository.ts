import { db } from '../database/database.js';
import { ChannelHistory } from './types/channelHistory.type.js';
import { GetManyChannelHistoryRes } from './types/dto/channel-history/getManyChannelHistory.dto.js';

const tableName = 'channel_history';

export async function saveOne(arg: Partial<ChannelHistory>) {
    // 여기서 값을 정해버리면 활용성이 떨어진다. 어떤 곳에서는 view의 누적값만 가지고있기때문에 데일리 뷰를 계산 해야하는데.. 그걸 여기서 해버리면 dailyViewCount를 가지고 있는 객체는 이 함수를 사용 못한다.
    const query = `
        INSERT INTO ${tableName} (id, channel_id, date, subscriber_count, daily_view_count, total_view_count, video_count)
        VALUES (DEFAULT, '${arg.channel_id}', '${arg.date}', ${arg.subscriber_count}, ${arg.daily_view_count}, ${arg.total_view_count}, ${arg.video_count ?? 'NULL'});
    `;
    const [result] = await db.query(query);
    return result;
}

export async function getOneEqual(columns: Partial<ChannelHistory>): Promise<ChannelHistory> {
    const conditions = [];
    for (let columnName in columns) {
        const value = columns[columnName as keyof typeof columns];
        const condition = typeof value === 'string' ? `'${value}'` : `${value}`;
        const result = `${columnName} = ${condition}`;
        conditions.push(result);
    }
    const condition = conditions.join(' AND ');
    const query = `SELECT * FROM ${tableName} WHERE ${condition} ORDER BY date DESC LIMIT 1;`;
    const [result] = await db.query(query);
    return result.length === 0 ? undefined : result[0];
}

/**
 * 2022-10-13T15:00:00.000Z { date: 2022-10-13T15:00:00.000Z, profitPerShare: 0 } key,value
 * 쓰이는 date형식이 다르므로 이런 경우 Repo에서 변환하는 Dto를 주면 간편하다.
 */
export async function getMany(channel_id: string): Promise<GetManyChannelHistoryRes[]> {
    const query = `SELECT date, subscriber_count, daily_view_count FROM ${tableName} WHERE channel_id = "${channel_id}";`;
    const [result] = await db.query(query);
    return result.length === 0 ? undefined
        : result.map((history: { date: string; subscriber_count: number; daily_view_count: number; }) => new GetManyChannelHistoryRes(history.date, history.subscriber_count, history.daily_view_count));
}