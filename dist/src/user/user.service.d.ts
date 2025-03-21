import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { UserProfileDocument } from './schemas/user-profile.schema';
export declare class UserService {
    private userModel;
    private userProfileModel;
    constructor(userModel: Model<UserDocument>, userProfileModel: Model<UserProfileDocument>);
    createUsers(): Promise<void>;
    calculateAverageAge(): Promise<number>;
    deleteUsersOlderThan25(): Promise<string[]>;
}
