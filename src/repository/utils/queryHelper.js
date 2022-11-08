export const In = (values) => {
    const result = values.map((value) => {
        return typeof value === 'string' ? `'${value}'` : `${value}`
    })
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
        const condition = typeof value === 'string' ? `'${value}'` : `${value}`;
        const result = `${columnName} = ${condition}`;
        conditions.push(result);
    }
    const condition = conditions.join(' AND ');
    return condition;
}

export const transfromSetSelectedList = (setColmns) => {
    const updateList = [];
    for (let columnName in setColmns) {
        const value = setColmns[columnName];
        const updateValue = typeof value === 'string' ? `'${value}'` : `${value}`;
        const result = `${columnName} = ${updateValue}`;
        updateList.push(result);
    }
    const list = updateList.join(', ');
    return list;
}