import * as authRepository from '../repository/auth.repo.js'
import * as otpRepository from '../repository/otp.repository.js'
import * as userRepository from '../../user/repository/user.repo.js '
import {toMs} from "../../common/utils/time.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'

import {sendEmailVerification} from "../../common/email/nodemailer.js";

import {
    invalidCode, invalidPassword,
    otpExpired,
    userAlreadyExist,
    userAlreadyVerified,
    userNotExist,
    userNotVerified
} from "../errors.js";
import jwt from "jsonwebtoken";
import { generate0TPCode} from "../../common/utils/otp.js";

export async function register(userData){
    const userExist =await authRepository.checkUserByemail(userData.email)
    if(userExist) throw userAlreadyExist

    userData.password = await bcrypt.hash(userData.password, 10)

    const createUser= await authRepository.createUser(userData)

    const code = generate0TPCode();

    await otpRepository.createOtp({
        code: code,
        email: userData.email,
        expiresAt: new Date(Date.now() + toMs(5, 'minutes')),
    });
    await sendEmailVerification(
        userData.email,
        "verification_code",
        `your verification code is ${code}`
    )
    return createUser
}

export async function verifyAccount(email, code) {

    const user = await authRepository.checkUserByemail(email);

    if (!user) throw userNotExist

    if (user.isVerified === true) throw userAlreadyVerified;


    const otp = await otpRepository.getOtpByemail(email);

    if (!otp) throw  otpExpired;

    if (otp.code !== code) throw  invalidCode;

    const updatedUser = await userRepository.updateUserByEmail (email, {isVerified: true});

    await otpRepository.deleteOtp(email);

    return updatedUser;
}


export async function login(email, password) {

    const user = await authRepository.checkUserByemail(email);// {} /nuzt

    if (!user) throw userNotExist;

    if (user.isVerified === false) throw userNotVerified;

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw invalidPassword;
    const token = jwt.sign(
        {id: user._id, email: user.email, name: user.name},
        process.env.JWT_SECRET,
        {expiresIn: toMs(1, 'hours')}
    );
    return token;

}

export async function send0tp(email) {

    const user = await authRepository.checkUserByemail(email);
    if (!user) throw userNotExist;

    await  otpRepository.deleteOtp(email);

    const code = generate0TPCode();
   await otpRepository.createOtp({
        code: code,
        email: email,
        expiresAt: Date.now() + toMs(3, 'minutes')
    })
    await sendEmailVerification(email, 'new otp', `your new otp is ${code}`);

}