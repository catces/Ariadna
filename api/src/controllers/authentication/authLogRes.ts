import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')

dotenv.config()

export const registerUser = async (req:Request, res:Response, next: NextFunction)=>{
    try{
        const userBody = req.body;
        if(userBody.mail && userBody.password && userBody.name && userBody.streetType && userBody.streetNumber) {
            const searcheduser = await prisma.user.findFirst(
                {
                    where:{
                        mail: userBody.mail
                    }
                }
            )
            if(searcheduser){
                return res.json({error: 'Error. El usuario ya existe.'});
            }
            const hashedPass = await bcrypt.hash(
                userBody.password,
                Number(process.env.SALT_ROUNDS)
            )
            const newUser = await prisma.user.create({
                data: {
                    mail: userBody.mail,
                    password: hashedPass,
                    // password: userBody.password,
                    name: userBody.name,
                    streetType: userBody.streetType,
                    streetNumber: userBody.streetNumber,
                    department: userBody.department,
                    municipality: userBody.municipality,
                    url: userBody.url
                }
            })
            const token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET)

            return res.status(201).json({
                //newUser without password
                mail: newUser.mail,
                password: undefined,
                name: newUser.name,
                streetType: newUser.streetType,
                streetNumber: newUser.streetNumber,
                department: newUser.department,
                municipality: newUser.municipality,
                url: newUser.url,
                token: token
            })
        }else{
            return res.json({error: 'Todos los campos son requeridos'})
        }
    }
    catch(error){
        console.log(error)
        return res.status(505).send('Ha ocurrido un problema, intentelo mas tarde')
    }
}

export const loginUser = async (req:Request, res: Response, next:NextFunction) => {
    try {
        const {mail, password} = req.body;
        if(!mail || !password){
            return res.json({error:"mail y contraseña son requeridos."})
        }
        const user = await prisma.user.findUnique({where:{mail}})
        if(!user){
            return res.json({error: "¡No te encuentras registrado!. CREA UNA CUENTA",});
        }
        const comparePass = await bcrypt.compare(password,user.password);
        if(!comparePass){
            return res.json({error: "mail o contraseña incorrectos.",});
        }
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET)
        const userLoged = {
            mail: user.mail,
            password: undefined,
            name: user.name,
            streetType: user.streetType,
            streetNumber: user.streetNumber,
            department: user.department,
            municipality: user.municipality,
            url: user.url,
            token: token
        }
        //using cookie
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            userLoged
        })
        //

    } catch (error) {
        console.log(error)
        return res.status(505).send('Ha ocurrido un problema, intentelo mas tarde')
    }
}

export const deleteUser = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const { mail } = req.body;
        const user = await prisma.user.findUnique({where:{mail}})
        if(!user){
            return res.json({error:"Esta cuenta no está registrada."})
        }
        await prisma.user.delete({where:{mail}})
        return res.send('La cuenta ha sido eliminada')
    } catch (error) {
        console.log(error)
        return res.status(505).send('Ha ocurrido un problema, intentelo mas tarde')
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.body.user_id;
        const user = await prisma.user.findFirst({where:{id: user_id}})
        if(user){
            return res.json(user)
        }
        return res.json({error:'Usuario no encontrado'});            
    } catch (error) {
        next(error);
    }
}

export const deleteAllUsers = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const erase = await prisma.user.deleteMany();
        console.log(erase);
        return res.send('¡La base de datos ha sido eliminada!')
    } catch (error) {
        console.log(error)
        return res.status(505).send('Ha ocurrido un problema, intentelo mas tarde')
    }
}