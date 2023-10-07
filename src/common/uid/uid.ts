import { ObjectId } from "bson";

export const generateUid = () => new ObjectId().toHexString();
