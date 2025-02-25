import { createTransport } from "nodemailer";

const sendMail = async (email, subject, htmlContent)=>{

    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            user: process.env.GMAIL,
            pass: process.env.GPASS,
        },
    });

    await transport.sendMail({
        from: process.env.GMAIL, 
        to: email, 
        subject, 
        html: htmlContent,
    });
};

export default sendMail;