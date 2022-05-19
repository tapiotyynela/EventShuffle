import {Sequelize} from "sequelize"

const isTesting = process.env.NODE_ENV === 'test'

const sequelize = new Sequelize(isTesting ? process.env.TEST_DB : process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: isTesting ? false : true
});


export const initializeDb = async (models: any) => {
  const db: any = {}
  models.forEach(model => {
    db[model] = model
  })
}

export default sequelize