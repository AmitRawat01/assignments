"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const user_profile_schema_1 = require("./schemas/user-profile.schema");
const md5 = require("md5");
let UserService = class UserService {
    userModel;
    userProfileModel;
    constructor(userModel, userProfileModel) {
        this.userModel = userModel;
        this.userProfileModel = userProfileModel;
    }
    async createUsers() {
        const users = [
            { firstName: 'Virat', lastName: 'Kohli', email: 'abc@gmail.com', password: md5('password1') },
            { firstName: 'Rishab', lastName: 'Pant', email: 'acd@gmail.com', password: md5('password2') },
            { firstName: 'Mahi', lastName: 'Dhoni', email: 'xyz@gmail.com', password: md5('password3') },
            { firstName: 'Rohit', lastName: 'Sharma', email: 'poq@gmail.com', password: md5('password4') },
            { firstName: 'Rahul', lastName: 'KL', email: 'xyzw@gmail.com', password: md5('password5') },
        ];
        const createdUsers = await this.userModel.insertMany(users);
        const usersProfiles = createdUsers.map(user => ({
            user_id: user._id,
            dob: new Date('1111-01-01'),
            mobile_no: '1234567890',
        }));
        await this.userProfileModel.insertMany(usersProfiles);
    }
    async calculateAverageAge() {
        const profiles = await this.userProfileModel.find();
        const currentDate = new Date();
        let totalAge = 0;
        profiles.forEach(profile => {
            const ageInMilliseconds = currentDate.getTime() - profile.dob.getTime();
            const ageInYears = new Date(ageInMilliseconds).getUTCFullYear() - 1970;
            totalAge += ageInYears;
        });
        return totalAge / profiles.length;
    }
    async deleteUsersOlderThan25() {
        const currentDate = new Date();
        const thresholdDate = new Date(currentDate.getFullYear() - 25, currentDate.getMonth(), currentDate.getDate());
        const profilesToDelete = await this.userProfileModel.find({ dob: { $lt: thresholdDate } });
        const userIds = profilesToDelete.map(profile => profile.user_id);
        await this.userProfileModel.deleteMany({ user_id: { $in: userIds } });
        await this.userModel.deleteMany({ _id: { $in: userIds } });
        return userIds.map(id => id.toString());
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_profile_schema_1.UserProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map