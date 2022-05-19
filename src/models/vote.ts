import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize'
import sequelize from '../db/index'
import EventDate from './eventDate'
import Event from './event'
import Person from './person'

class Vote extends Model<InferAttributes<Vote>, InferCreationAttributes<Vote>> {
    declare voteId: CreationOptional<number>
    declare person: number
    declare event: number
    declare EventDates?: EventDate[]
    declare Person?: Person
}

Vote.init({
    voteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    person: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}
,{
    tableName: 'vote',
    sequelize,
})

Vote.belongsToMany(EventDate, {
    through: 'voteEventDate',
    foreignKey: 'voteId',
    otherKey: 'eventDateId'
})
EventDate.belongsToMany(Vote, {
    through: 'voteEventDate',
    foreignKey: 'eventDateId',
    otherKey: 'voteId'
})
Vote.belongsTo(Event, {
    foreignKey: 'event'
})
Event.hasMany(Vote, {
    foreignKey: 'event'
})

export default Vote