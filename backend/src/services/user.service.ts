import { UserMongoRepository } from "../repositories/user.repository";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";

const userRepository = new UserMongoRepository();

export class UserService {
    async registerUser(userData: RegisterUserDTO): Promise<IUser> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "An account with this email already exists");
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

        // Check email uniqueness if changing email
        if (userData.email && userData.email !== existingUser.email) {
            const emailTaken = await userRepository.getUserByEmail(userData.email);
            if (emailTaken) throw new HttpException(400, "This email is already in use");
        }

        // Hash new password if provided
        if (userData.password) {
            userData.password = await bcryptjs.hash(userData.password, 10);
        }

        const updatedUser = await userRepository.update(id, userData);
        if (!updatedUser) throw new HttpException(500, "Failed to update user");
        return updatedUser;
    }
}
