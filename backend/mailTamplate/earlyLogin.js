module.exports = ({ employeeName, shiftStartTime, loginTime, minutesBefore }) => {
    return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: Arial, sans-serif; background: #f6f6f6; color:#333; }
          .card { max-width: 600px; margin: 30px auto; background: #fff; padding: 20px; border-radius: 8px; }
          h2 { color: #DE4E26; }
          .meta { font-size: 14px; color: #555; }
          .footer { margin-top: 20px; font-size: 13px; color:#777 }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Early Login Alert</h2>
          <p>Hi ${employeeName},</p>
          <p>Our system detected that you logged in at <strong>${loginTime}</strong>, which is <strong>${minutesBefore} minutes</strong> before your scheduled shift start at <strong>${shiftStartTime}</strong>.</p>
          <p>If this was intentional, you can ignore this message. If not, please ensure you log in closer to your shift start time.</p>
          <div class="footer">This is an automated notification from HRMS.</div>
        </div>
      </body>
    </html>
  `;
};
