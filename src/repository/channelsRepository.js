import { db } from '../database/database.js';
import * as queryHelper from './utils/queryHelper.js';

const tableName = 'channels';

/**
 * 
 * @param {*} columns
 * getOneEqual({
 *  name: 'thor',
 *  age: In([20,22,29])
 * })
 * @returns 
 */
export async function getOneEqual(columns) {
    const condition = queryHelper.transformWhereCondition(columns);
    const sql = `SELECT * FROM ${tableName} WHERE ${condition} LIMIT 1;`
    const [result] = await db.query(sql);
    return result;
}

export async function getManyByTitle(title) {
    const [result] = await db.query(`SELECT * FROM ${tableName} WHERE title LIKE '%${title}%' LIMIT 6;`);
    return result.length === 0 ? undefined : result;
}

export async function saveOne(channel) {
    const {
        channelId,
        title,
        description,
        thumbnails,
        published_at,
    } = channel;
    await db.query(`
        INSERT INTO ${tableName} (id, channel_id, title, description, thumbnail_url, published_at)
        VALUES(DEFAULT, '${channelId}', '${title}', '${description}', '${thumbnails.medium.url}', '${published_at}');
    `);
}

/**
 * 
 * @param {*} where  { age: 200 }
 * @param {*} setColmns { name: 'thor' }
 * @returns 
 */
export async function update(where, setColmns) {
    const selectedList = queryHelper.transfromSetSelectedList(setColmns);
    const condition = queryHelper.transformWhereCondition(where);
    const sql = `UPDATE ${tableName} SET ${selectedList} WHERE ${condition};`;
    const [result] = await db.query(sql);
    return result;
}

/**
 * varchar vs text
 * https://sir.kr/qa/250669
 */