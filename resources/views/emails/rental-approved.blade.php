<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rental Request Approved</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .detail-row {
            margin: 10px 0;
            padding: 5px 0;
        }
        .label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            width: 120px;
        }
        .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Rental Request Approved!</h1>
        <p>Your oxygen tank rental request has been approved</p>
    </div>

    <div class="content">
        <p>Dear {{ $customerName }},</p>
        
        <p>Good news! Your rental request for oxygen tanks has been approved. You can now proceed with pickup at our facility.</p>

        <div class="details">
            <h3>Rental Details:</h3>
            <div class="detail-row">
                <span class="label">Tank Type:</span>
                <span>{{ $tankType }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Quantity:</span>
                <span>{{ $quantity }} unit(s)</span>
            </div>
            <div class="detail-row">
                <span class="label">Start Date:</span>
                <span>{{ $startDate }}</span>
            </div>
            <div class="detail-row">
                <span class="label">End Date:</span>
                <span>{{ $endDate }}</span>
            </div>
        </div>

        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Visit our facility during business hours</li>
            <li>Bring a valid ID for verification</li>
            <li>Complete the rental agreement on-site</li>
            <li>Make payment for the rental period</li>
        </ul>

        <p>If you have any questions or need to modify your rental, please contact us immediately.</p>

        <div class="footer">
            <p><strong>MV Oxygen Trading</strong></p>
            <p>Phone: (123) 456-7890 | Email: info@mvoxygen.com</p>
            <p>Address: 123 Industrial Street, City, Country</p>
        </div>
    </div>
</body>
</html>
