const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = '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'

sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshayunmetered1@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

module.exports = {
    sendWelcomeEmail
}