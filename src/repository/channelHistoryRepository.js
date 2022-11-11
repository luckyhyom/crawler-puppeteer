import { db } from '../database/database.js';

const tableName = 'channel_history';

export async function saveOne({
    channel_id,
    daily_view_count,
    total_view_count,
    subscriber_count,
    video_count,
    date,
}) {
    // 여기서 값을 정해버리면 활용성이 떨어진다. 어떤 곳에서는 view의 누적값만 가지고있기때문에 데일리 뷰를 계산 해야하는데.. 그걸 여기서 해버리면 dailyViewCount를 가지고 있는 객체는 이 함수를 사용 못한다.
    const query = `
        INSERT INTO ${tableName} (id, channel_id, date, subscriber_count, daily_view_count, total_view_count, video_count)
        VALUES (DEFAULT, '${channel_id}', '${date}', ${subscriber_count}, ${daily_view_count}, ${total_view_count}, ${video_count});
    `;
    const [result] = await db.query(query);
    return result;
}

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
    return result.length === 0 ? undefined : result;
}