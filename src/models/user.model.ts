import mongoose  from "mongoose";

export type UserRole= 'admin' | 'customer' | 'dealer';

export interface UserInput{
    name: string,
    email: string,
    password: string,
    role: UserRole,
}

export interface UserDocument extends UserInput, mongoose.Document{}

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password:{ type: String, required: true },
    role: { type: String, enum: ['admin', 'customer', 'dealer'], required: true },
});

export const UserModel = mongoose.model<UserDocument>("User", userSchema);

