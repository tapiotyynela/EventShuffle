import { Transaction } from "sequelize/types";
import Person from "../models/person";

export const findOrCreatePerson = async (name: string, t?: Transaction) => {
  const person = await Person.findOne({
    where: {
      name: name,
    },
  });
  if (person === null) {
    return await Person.create(
      {
        name: name,
      },
      { transaction: t }
    );
  }
  return person;
};
