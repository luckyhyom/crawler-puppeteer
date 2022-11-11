/**
 * @returns '2022-11-11'
 */

export const getPast = (day) => {
    const now = new Date();
    const time = day ? now.getTime() - (day * 86400000) : now.getTime();
    now.setTime(time);
    const dayStr = now.getDate().length === 1 ? '0' + now.getDate() : now.getDate();
    return now.getFullYear() + '-' + now.getMonth() + '-' + dayStr;
}