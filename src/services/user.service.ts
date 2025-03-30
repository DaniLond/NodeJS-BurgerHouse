import { UserDocument, UserInput, UserModel } from "../models";

class UserService{
    async create(data: UserDocument){
        try{
            const user = await UserModel.create(data);
            return user;
        }catch(error){
            throw error;
        }
    }

    async delete(email: string){
        try {
            const user= await UserModel.findOneAndDelete({email: email});
            return user;
        } catch (error) {
            throw error;
        }

    }

    async findByEmail(email:string){
        try{
            const user = await UserModel.findOne({ email : email});
            return user;
        }catch(error){
            throw error;
        }
    }

    async getAll():Promise<UserDocument[]>{
        try{
            const users: UserDocument[] = await UserModel.find();
            return users;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async update(email:string, user: UserInput){
        try{
            const updatedStudent: UserDocument | null = await UserModel.findOneAndUpdate( { email: email}, user, {returnOriginal: false} );
            if(updatedStudent){
                updatedStudent.password = "";
            }
            return updatedStudent;
        }catch(error){
            throw error;
        }
    }

}

export const userService = new UserService();