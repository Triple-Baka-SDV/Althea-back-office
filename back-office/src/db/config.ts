import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: process.env.DATABASE_DIALECT as any });

export default sequelize