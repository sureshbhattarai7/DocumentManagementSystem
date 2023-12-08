exports.generate = function (newUser) {
  console.log(newUser);
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome New Member</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #3498db;
      color: #fff;
      padding: 20px;
      text-align: center;
    }

    .content {
      padding: 20px;
      text-align: left;
    }

    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }

    .details {
      font-size: 16px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome New Member!</h1>
    </div>
    <div class="content">
      <p class="greeting">Dear ${newUser.firstName},</p>
      <p class="details">Thank you for becoming a new member. We are excited to have you on board!</p>
      <p class="details">Here are your registration details:</p>
      <ul>
        <li><strong>Name:</strong> ${newUser.firstName} ${newUser.lastName}</li>
        <li><strong>Email:</strong> ${newUser.email}</li>
        <li><strong>Username:</strong> ${newUser.username}</li>
      </ul>
      <p class="details">Feel free to explore our platform and let us know if you have any questions.</p>
      <p class="details">Best regards,<br>Your Company Name</p>
    </div>
  </div>
</body>
</html>`;

  return htmlContent;
};
