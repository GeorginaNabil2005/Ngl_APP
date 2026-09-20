import * as authService from '../service/auth.service.js';
import {toMs} from "../../common/utils/time.js";
import {json} from "express";

export async function register(req,res,next){
    try {
        const createUser = await authService.register(req.body);
        res.status(201).json({
            message: "Register success",
            data: createUser,
            success: true,
        });
    }
    catch(err){
        next(err);

    }
}

export async function verifyAccount (req,res,next){
    try {
        const{email,code}=req.body;
        const  updataUser = await authService.verifyAccount(email,code);
        res.status(201).json({
            message: "user verified success",
            data:updataUser,
            success: true,
        });
    }
    catch(err){
        next(err);

    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);

        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: toMs(1, 'hours')
        });

        res.json({
            message: 'User Login Successfully',
            success: true,
        });

    } catch (error) {
        next(error);
    }
}


export async function sendOtp(req, res, next) {
    try {
        const {email} = req.body;
        await  authService.send0tp(email);
        res.json({message: "new otp sent,check user email", success: true});
    } catch (err) {
        next(err);
    }
}