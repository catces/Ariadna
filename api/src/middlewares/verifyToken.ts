import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
dotenv.config();

export const verifyToken = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const headerToken = req.get('Authorization');
        if(!headerToken){
            return res.send('Token no encontrado');
        }
        const token = headerToken.replace("Bearer ", "");
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.body.user_id = decoded.user_id;
            next();
        } catch (error) {
            console.log(error);
            return res.json({role:'invalid'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Intentelo mas tarde')    
    }
}