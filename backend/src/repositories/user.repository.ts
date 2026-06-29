import { UserModel, IUser } from "../models/user.model";

export interface IUserRepository {
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    createUser(user: Partial<IUser>): Promise<IUser>;
    getUserById(id: string): Promise<IUser | null>;
    getAll(): Promise<IUser[]>;
    getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }>;
    update(id: string, user: Partial<IUser>): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
}

export class UserMongoRepository implements IUserRepository {
    async getUserById(id: string): Promise<IUser | null> {
        return UserModel.findById(id);
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email: email.toLowerCase() });
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        return UserModel.findOne({ username });
    }

    async createUser(user: Partial<IUser>): Promise<IUser> {
        return UserModel.create(user);
    }

    async getAll(): Promise<IUser[]> {
        return UserModel.find();
    }

    async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IUser[]; total: number }> {
        const query: any = {};
        if (search) {
            query.$or = [
                { firstName:  { $regex: search, $options: "i" } },
                { lastName:   { $regex: search, $options: "i" } },
                { email:      { $regex: search, $options: "i" } },
                { username:   { $regex: search, $options: "i" } },
            ];
        }
        const total = await UserModel.countDocuments(query);
        const data  = await UserModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        return { data, total };
    }

    async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, user, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(id);
        return !!deleted;
    }
}
