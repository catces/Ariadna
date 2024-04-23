import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
                // console.log('Ya existe');
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
                    name: userBody.name,
                    streetType: userBody.streetType,
                    streetNumber: userBody.streetNumber,
                    department: userBody.department,
                    municipality: userBody.municipality
                }
            })
            console.log(newUser)
            return res.json("Usuario creado exitosamente")
            // return newUser
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
        const token = jwt.sign({user_id:user.id}, process.env.JWT_SECRET)
        return res.json({token})
        
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

export const getUser = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const { mail } = req.body;
        const user = await prisma.user.findUnique({where:{mail}})
        if(!user){
            return res.json({error:"Esta cuenta no está registrada."})
        }
        return res.json(user)
    } catch (error) {
        console.log(error)
        return res.status(505).send('Ha ocurrido un problema, intentelo mas tarde')
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