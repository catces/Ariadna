import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import app from './src/app';
import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});