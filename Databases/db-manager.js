import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

const tableName = 'Ingredients';

enablePromise(true);

export const getDBConnection = async () => {
  console.log('1')
  const db = await openDatabase({ name: 'ingredients.db', location: 'default' })
  console.log('2')
  await createTable(db)
  console.log('3')
  return db
};

export const createTable = async (db) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        Name TEXT NOT NULL,
        Price NUMBER,
        Unit TEXT NOT NULL,
    );`;

  await db.executeSql(query);
};

export const getIngredients = async (db) => {
  try {
    const Ingredients = [];
    const results = await db.executeSql(`SELECT rowid as id, value FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        Ingredients.push(result.rows.item(index))
      }
    });
    return Ingredients;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Ingredients !!!');
  }
};

export const saveIngredients = async (db, ingredients) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
    ingredients.map(i => `(${i.id}, '${i.value}')`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteIngredient = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const addIngredient = async (db, ingredient) => {
  const addQuery = `INSERT INTO ${tableName} VALUES (${ingredient.name}, ${ingredient.price}, ${ingredient.unit})`
  await db.executeSql(addQuery)
}

export const deleteTable = async (db) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};