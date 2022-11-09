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