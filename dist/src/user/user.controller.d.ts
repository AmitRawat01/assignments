import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUsers(): Promise<string>;
    getAverageAge(): Promise<{
        averageAge: number;
    }>;
    deleteUsersOlderThan25(): Promise<{
        message: string;
        deletedUserIds: string[];
    }>;
}
