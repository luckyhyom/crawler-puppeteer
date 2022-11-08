import { db } from '../database/database.js';

const tableName = 'channel_history';

export async function saveOne({
    channel_id,
    view_count,
    subscriber_count,
    video_count,
}) {
    const history = await getOneEqual({ channel_id: channel_id });
    const lastTotalViewCount = history?.total_view_count ?? view_count;
    const dailyViewCount = view_count - lastTotalViewCount;

    const now = new Date();
    const date = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();
    const query = `
        INSERT INTO ${tableName} (id, channel_id, date, subscriber_count, daily_view_count, total_view_count, video_count)
        VALUES (DEFAULT, '${channel_id}', '${date}', ${subscriber_count}, ${dailyViewCount}, ${view_count}, ${video_count});
    `
    const [result] = await db.query(query);
    return result;
}


// 타입이 없으니 channelId로 받을지 channel_id로 받을지 정할 수가 없다. 편리한 또는 원하는 인터페이스를 구현하기 어려워진다.
/**
 * 
 * @param {*} columns 
 * {
 *  name: 'ellie'
 * }
 * @returns 
 */
export async function getOneEqual(columns) {
    const conditions = [];
    for (let columnName in columns) {
        const value = columns[columnName];
        const condition = typeof value === 'string' ? `'${value}'` : `${value}`;
        const result = `${columnName} = ${condition}`;
        conditions.push(result);
    }
    const condition = conditions.join(' AND ');
    const query = `SELECT * FROM ${tableName} WHERE ${condition} ORDER BY date DESC LIMIT 1;`;
    const [result] = await db.query(query);
    return result;
}

// 생쿼리를 쓰던 ORM을 쓰던 Service에 영향을 미치지 않고 Repo에서만 수정하면 됨. 즉 작업할 파일을 기준을 두어 분리할 수 있음.