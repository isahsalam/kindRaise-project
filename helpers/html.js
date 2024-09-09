const signUpTemplate = (verifyLink, fullName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>hurray!!! you've successfully signed-up as a </title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          background: #007bff;
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #ddd;
          color: #fff;
        }
        .content {
          padding: 20px;
          color: #333;
        }
        .footer {
          background: #333;
          padding: 10px;
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #ccc;
        }
        .button {
          display: inline-block;
          background-color: #ff9900;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kind raise serves you best!</h1>
        </div>
        <div class="content">
          <p>congratulation ${fullName},</p>
          <p>Thank you for joining our community! We're happy to have you with us.</p>
          <p>Please click the button below to verify your account:</p>
          <p>
            <a href="${verifyLink}" class="button">Verify My Account</a>
          </p>
          <p>If you did not create an account, please, kindly ignore this email.</p>
          <p>Best of luck,<br>kind raise team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()}  kindRaise team.. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


const verifyTemplate = (verifyLink, fullName) => {
    return `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HURRAY!!! congratulation,welcome to THE CURVE TO-DO APP</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f7f7f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    .header {
      background: #007bff;
      padding: 10px;
      text-align: center;
      border-bottom: 1px solid #ddd;
      color: #fff;
    }
    .content {
      padding: 20px;
      color: #333;
    }
    .footer {
      background: #333;
      padding: 10px;
      text-align: center;
      border-top: 1px solid #ddd;
      font-size: 0.9em;
      color: #ccc;
    }
    .button {
      display: inline-block;
      background-color: #ff9900;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
    </style>
    </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Account</h1>
      </div>
      <div class="content">
        <p>Hello ${fullName},</p>
        <p>We're excited to have you on board! Please click the button below to verify your account:</p>
        <p>
          <a href="${verifyLink}" class="button">Verify My Account</a>
        </p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best of luck,<br>Isah's co-operation</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()}  Isah Abdulwahab Enterprise.. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;
};
const forgotPasswordTemplate = (resetLink, firstName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
      body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .header {
          background: #007bff;
          padding: 10px;
          text-align: center; 
          border-bottom: 1px solid #ddd;
          color: #fff;
        }
        .content {
          padding: 20px;
          color: #333;
        }
        .footer {
          background: #333;
          padding: 10px;
          text-align: center;
          border-top: 1px solid #ddd;
          font-size: 0.9em;
          color: #ccc;
        }
        .button {
          display: inline-block;
          background-color: #ff9900;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
          <p>Click the button below to reset your password:</p>
          <p>
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>
          <p>Best regards,<br> kind raise Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()}  kindRaise co-operation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
const donationTamplate = ( ) => {
  return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Thank You for Your Donation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: white;
            text-align: center;
            padding: 20px;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
            text-align: left;
            color: #333;
        }
        .content p {
            line-height: 1.6;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Donation!</h1>
        </div>
        <div class="content">
            <p>Dear <strong>[Donor's Name]</strong>,</p>
            <p>We sincerely appreciate your generous donation of <strong>₦[Donation Amount]</strong> to our <strong>[Campaign Name]</strong> campaign. Your contribution will help us make a real difference in [brief impact of the donation].</p>
            <div class="details">
                <p><strong>Donation Details:</strong></p>
                <p>Donation Amount: ₦[Donation Amount]</p>
                <p>Campaign: [Campaign Name]</p>
                <p>Date: [Donation Date]</p>
                <p>Transaction ID: [Transaction ID]</p>
            </div>
            <p>We will keep you updated on the progress of the campaign and how your donation is helping us reach our goals.</p>
            <p>If you have any questions, feel free to <a href="mailto:[Support Email]" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
            <a href="[Website URL]" class="button">Visit Our Website</a>
        </div>
        <div class="footer">
            <p>&copy; [Organization Name] | [Organization Address] | [Contact Information]</p>
        </div>
    </div>
</body>
</html>`
}



module.exports = { signUpTemplate,verifyTemplate,forgotPasswordTemplate,donationTamplate};
