import nodemailer from 'nodemailer'
import Handlebars from 'handlebars'
import { ConfirmEmailTemplate } from './ConfirmEmailTemplate';
import { ForgotPasswordTemplate } from './ForgotPassEmailTemplate';

export async function sendMail({to , subject, body}:{to:string, subject:string, body: string}) {
const {SMPT_EMAIL,SMPT_HOST, SMPT_USER, SMPT_PASS} = process.env;  

// FUNCTION TO SEND MAIL WITH MAILTRAP.IO 
var transport = nodemailer.createTransport({
    host: SMPT_HOST,
    port: 587,
    secure: false,
    auth: {
      user: SMPT_USER,
      pass: SMPT_PASS
    }
  });
try {
   const sendResult = await transport.sendMail({
    from:SMPT_EMAIL,
    to,
    subject,
    html: body
   })
   return sendResult.accepted.length > 0? true : false;
    
} catch (error) {
    console.log(error);
    return error
}
    
}
// This is for sending conformation email 
export const compileActivationTemplate = (name:string, url:string)  =>{
    const template = Handlebars.compile(ConfirmEmailTemplate)
    const htmlBody = template({
        name,
        url

    })
    return htmlBody;
}
// This is for sending Rest Password link via email 
export const compileResetTemplate = (name:string, url:string)  =>{
    const template = Handlebars.compile(ForgotPasswordTemplate)
    const htmlBody = template({
        name,
        url

    })
    return htmlBody;
}