import { db } from '../database/database.js';
import * as queryHelper from './utils/queryHelper.js';

const tableName = 'channels';

export const find = async (selectColumnObj) => {
    const columns = selectColumnObj ? selectColumnObj.join() : '*';
    const sql = `SELECT ${columns} FROM ${tableName};`
    const [result] = await db.query(sql);
    return result;
}

/**
 * 
 * @param {*} columns { name: 'thor', age: In([20,22,29]) }
 * @returns 
 */
export const getOneEqual = async (columns) => {
    const condition = queryHelper.transformWhereCondition(columns);
    const sql = `SELECT * FROM ${tableName} WHERE ${condition} LIMIT 1;`
    const [result] = await db.query(sql);
    return result.length === 0 ? undefined : result[0];
}

export const getManyByTitle = async (title) => {
    const [result] = await db.query(`SELECT * FROM ${tableName} WHERE title LIKE '%${title}%' LIMIT 6;`);
    return result.length === 0 ? undefined : result;
}

export const saveOne = async (channel) => {
    for (const key in channel) {
        channel[key] = queryHelper.fitValueInSql(channel[key]);
    }
    const {
        channel_id,
        title,
        description,
        thumbnail_url,
        published_at,
        category,
    } = channel;
    const query = `
        INSERT INTO ${tableName} (id, channel_id, title, description, thumbnail_url, published_at, category)
        VALUES(DEFAULT, ${channel_id}, ${title}, ${description}, ${thumbnail_url}, ${published_at}, ${category ?? 'NULL'});
    `;
    await db.query(query);
}

/**
 * 
 * @param {*} where  { age: 200 }
 * @param {*} setColmns { name: 'thor' }
 * @returns 
 */
export const update = async (where, setColmns) => {
    const selectedList = queryHelper.transformSetSelectedList(setColmns);
    const condition = queryHelper.transformWhereCondition(where);
    const sql = `UPDATE ${tableName} SET ${selectedList} WHERE ${condition};`;
    const [result] = await db.query(sql);
    return result;
}