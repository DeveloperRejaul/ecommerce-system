/**
 * @Setup Article Link: https://www.programonaut.com/how-to-send-an-email-in-node-js-using-an-smtp-step-by-step/
 */
const {createTransport} = require("nodemailer");
const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "devrejaul.official@gmail.com",
        pass: "APCFyBLM0kp2jN9s",
    },
});

/**
 * @description this function using for sending mail to user 
 * @param {{to:string, subject:string, text:string, html:HTMLElement}}
 * @returns promise
 */
module.exports.sendMail = async ({to, subject, text , html})=>{
    try {
        transporter.sendMail({from:'devrejaul.official@gmail.com', subject, to, text , html}, (error, info)=>{
            if (error) {
                console.log(error);
            }else{
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}