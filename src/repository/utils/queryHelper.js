export const fitValueInSql = (value) => {
    if (value === undefined) return 'NULL';
    if (typeof value !== 'string') return value;
    const arr = value.match(/\"/g);
    if (arr) for (const escape in arr) value.replace(escape, "'");
    return `"${value}"`
}

export const In = (values) => {
    const result = values.map((value) => fitValueInSql(value));
    return `In(${result.join()})`;
}

export const transformWhereCondition = (columns) => {
    const conditions = [];
    for (let columnName in columns) {
        const value = columns[columnName];
        if (value === undefined) continue;
        if (typeof value === 'string' && value.match(/^In\(/g) !== null) {
            conditions.push(`${columnName} ${value}`);
            continue;
        }
        const condition = fitValueInSql(value);
        const result = `${columnName} = ${condition}`;
        conditions.push(result);
    }
    const condition = conditions.join(' AND ');
    return condition;
}

export const transformSetSelectedList = (setColmns) => {
    const updateList = [];
    for (let columnName in setColmns) {
        const value = setColmns[columnName];
        const updateValue = fitValueInSql(value);
        const result = `${columnName} = ${updateValue}`;
        updateList.push(result);
    }
    const list = updateList.join(', ');
    return list;
}