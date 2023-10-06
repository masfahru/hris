import { ObjectId } from "bson";

export const generateUID = () => new ObjectId().toHexString();
