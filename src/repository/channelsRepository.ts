import { db } from '../database/database.js';
import { ChannelEntity } from './entities/channel.entity.js';
import { Channel } from './types/channel.type.js';
import * as queryHelper from './utils/queryHelper.js';

const tableName = 'channels';

export const find = async (
    selectColumnObj: Array<keyof Channel>
): Promise<Channel[]> => {
    const columns = selectColumnObj ? selectColumnObj.join() : '*';
    const sql = `SELECT ${columns} FROM ${tableName};`;
    const [result] = await db.query(sql);
    return result as Channel[];
};

/**
 *
 * @param {*} columns { name: 'thor', age: In([20,22,29]) }
 * @returns
 */
export const getOneEqual = async (
    columns: Partial<Channel>
): Promise<Channel> => {
    const condition = queryHelper.transformWhereCondition(columns);
    const sql = `SELECT * FROM ${tableName} WHERE ${condition} LIMIT 1;`;
    const [result] = await db.query(sql);
    return new ChannelEntity(result?.[0]);
};

export const getManyByTitle = async (title: string): Promise<Channel[]> => {
    const [result] = await db.query(
        `SELECT * FROM ${tableName} WHERE title LIKE '%${title}%' LIMIT 6;`
    );
    return result.length === 0 ? undefined : result;
};

export const saveOne = async (channel: Partial<Channel>) => {
    const a = {};
    for (const key in channel) {
        const value = queryHelper.fitValueInSql(
            channel[key as keyof typeof channel]
        );
        if (key === 'channel_id') channel.channel_id = value;
        else if (key === 'title') channel.title = value;
        else if (key === 'description') channel.description = value;
        else if (key === 'thumbnail_url') channel.thumbnail_url = value;
        else if (key === 'published_at') channel.published_at = value;
        else if (key === 'category') channel.category = value;
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
        VALUES(DEFAULT, ${channel_id}, ${title}, ${description}, ${thumbnail_url}, ${published_at}, ${
        category ?? 'NULL'
    });
    `;
    await db.query(query);
};

/**
 * UCM31rBPQdifQKUmBKtwVqBg 1qnsaks
 * Society 엔터테이먼트, 지식/정보
 * UCMKrPB54Da-61S2Obt-S3tw 지식
 * Society,Military 엔터테이먼트, 지식/정보
 * UCDLDbittWhk2KXvaCT0YpZQ 플레임
 * 게임, 게임
 * Strategy_video_game,Action-adventure_game,Action_game,Role-playing_video_game,Puzzle_video_game,Video_game_culture,Casual_game
 *
 * UC-ohedcemUvr4Qai26n560w 혜인라밥
 * 인물/블로그
 * Lifestyle_(sociology)
 *
 * @param {*} where  { age: 200 }
 * @param {*} setColmns { name: 'thor' }
 * @returns
 */
export const update = async (
    where: Partial<Channel>,
    setColmns: Partial<Channel>
) => {
    const selectedList = queryHelper.transformSetSelectedList(setColmns);
    const condition = queryHelper.transformWhereCondition(where);
    const sql = `UPDATE ${tableName} SET ${selectedList} WHERE ${condition};`;
    const [result] = await db.query(sql);
    return result;
};
