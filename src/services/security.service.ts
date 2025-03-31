import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; 

class SecurityService{

    async encryptPassword (password: string){
        return await bcrypt.hash(password, 10);
    }

    async generateToken(_id: mongoose.Types.ObjectId, email: string, role: string){
        return await jwt.sign({_id, email, role}, 'secret', { expiresIn: '1h'});
    }

    async comparePasswords( password: string, currentPassword: string){
        return await bcrypt.compare(password, currentPassword);
    }

    async getUserFromToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        return decoded; 
    } catch (error) {
        throw new Error("Invalid token");
    }
}
async getClaims(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
            return {
                _id: decoded._id,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}


export const securityService = new SecurityService();