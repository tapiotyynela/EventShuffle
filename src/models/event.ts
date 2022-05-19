import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'
import sequelize from '../db/index'

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    declare eventId: CreationOptional<number>
    declare name: string
    declare EventDates?: { date: string }[]
}

Event.init({
    eventId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}
,{
    tableName: 'event',
    sequelize,
})

export default Event