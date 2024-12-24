import nodeMailer from 'nodemailer';

export const sendEmail = async({email, subject, message})=>{
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const options = {
        from: process.env.SMTP_MAIL, // yaani ye mail hmari traf se jayegi
        to: email, // yaani is bande ko bhejni hai jo uper se aarhai hai email, subject, message wale se 
        subject: subject,
        text: message
    }

    ///ab email ko bhejna hai 
    await transporter.sendMail(options);// sendMail options mangta hai 

}

// ab isko automation vaale me import krvaalo newsLetterCron.js me 