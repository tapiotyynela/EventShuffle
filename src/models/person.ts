import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../db/index";
import Vote from "./vote";

class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  declare personId: CreationOptional<number>;
  declare name: string;
}

Person.init(
  {
    personId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "person",
    sequelize,
  }
);

Person.hasMany(Vote, {
  foreignKey: "person",
});
Vote.belongsTo(Person, {
  foreignKey: "person",
});

export default Person;
