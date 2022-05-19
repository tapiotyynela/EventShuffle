import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import sequelize from "../db/index";

class VoteEventDate extends Model<
  InferAttributes<VoteEventDate>,
  InferCreationAttributes<VoteEventDate>
> {
  declare eventDateId: number;
  declare voteId: number;
}

VoteEventDate.init(
  {
    eventDateId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    voteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "voteEventDate",
    sequelize,
  }
);

export default VoteEventDate;
