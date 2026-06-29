import { UserMongoRepository } from "../repositories/user.repository";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO, CreateUserDTOAdmin } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

export class UserService {
    async registerUser(userData: RegisterUserDTO): Promise<IUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) throw new HttpException(400, "An account with this email already exists");

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        userData.password = hashedPassword;
        return userRepository.createUser(userData);
    }

    async createUser(userData: CreateUserDTOAdmin): Promise<IUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) throw new HttpException(400, "Email already exists");

        if (userData.username) {
            const existingUsername = await userRepository.getUserByUsername(userData.username);
            if (existingUsername) throw new HttpException(400, "Username already exists");
        }

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        userData.password = hashedPassword;
        return userRepository.createUser(userData);
    }

    async loginUser(loginData: LoginUserDTO): Promise<{ user: IUser; token: string }> {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) throw new HttpException(400, "Invalid email or password");

        const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);
        if (!isPasswordValid) throw new HttpException(400, "Invalid email or password");

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );
        return { user, token };
    }

    async updateUser(id: string, userData: UpdateUserDTO): Promise<IUser> {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) throw new HttpException(404, "User not found");

        if (userData.email && userData.email !== existingUser.email) {
            const emailTaken = await userRepository.getUserByEmail(userData.email);
            if (emailTaken) throw new HttpException(400, "This email is already in use");
        }

        if (userData.username && userData.username !== existingUser.username) {
            const usernameTaken = await userRepository.getUserByUsername(userData.username);
            if (usernameTaken) throw new HttpException(400, "Username already exists");
        }

        if (userData.password) {
            userData.password = await bcryptjs.hash(userData.password, 10);
        }

        const updatedUser = await userRepository.update(id, userData);
        if (!updatedUser) throw new HttpException(500, "Failed to update user");
        return updatedUser;
    }

    async deleteUser(id: string): Promise<boolean> {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) throw new HttpException(404, "User not found");

        const deleted = await userRepository.delete(id);
        if (!deleted) throw new HttpException(500, "Failed to delete user");
        return deleted;
    }

    async getUserById(id: string): Promise<IUser | null> {
        const user = await userRepository.getUserById(id);
        if (!user) throw new HttpException(404, "User not found");
        return user;
    }

    async getAllUserPaginated(page?: string, limit?: string, search?: string) {
        const currentPage  = page  && parseInt(page)  > 0 ? parseInt(page)  : 1;
        const currentLimit = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
        const currentSearch = search && search.trim() !== "" ? search : undefined;

        const { data, total } = await userRepository.getAllPaginated(currentPage, currentLimit, currentSearch);
        const totalPages = Math.ceil(total / currentLimit);

        return {
            data,
            pagination: { page: currentPage, limit: currentLimit, total, totalPages },
        };
    }
}
