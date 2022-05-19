import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../db/index";
import Event from "./event";
import Vote from "./vote";

class EventDate extends Model<
  InferAttributes<EventDate>,
  InferCreationAttributes<EventDate>
> {
  declare eventDateId: CreationOptional<number>;
  declare date: string;
  declare event: number;
  declare Votes?: Vote[];
}

EventDate.init(
  {
    eventDateId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "eventDate",
    sequelize,
  }
);

EventDate.belongsTo(Event, {
  foreignKey: "event",
});

Event.hasMany(EventDate, {
  foreignKey: "event",
});

export default EventDate;
