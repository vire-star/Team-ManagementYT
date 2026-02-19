import nodemailer from 'nodemailer'
import { ENV } from './env.js'

export const transporter = nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port:587,
    secure:false,
    auth:{
        user:ENV.BREVO_MAIL,
        pass:ENV.BREVO_SMTP
    }
})


transporter.verify((error, success)=>{
    if(error){
        console.log('error connection')
    } else{
        console.log("brevo mail ready")
    }
})