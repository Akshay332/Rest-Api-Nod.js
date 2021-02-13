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