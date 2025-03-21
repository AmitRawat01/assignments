import { Document, Types } from 'mongoose';
export type UserProfileDocument = UserProfile & Document;
export declare class UserProfile {
    user_id: Types.ObjectId;
    dob: Date;
    mobile_no: string;
}
export declare const UserProfileSchema: import("mongoose").Schema<UserProfile, import("mongoose").Model<UserProfile, any, any, any, Document<unknown, any, UserProfile> & UserProfile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserProfile, Document<unknown, {}, import("mongoose").FlatRecord<UserProfile>> & import("mongoose").FlatRecord<UserProfile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
