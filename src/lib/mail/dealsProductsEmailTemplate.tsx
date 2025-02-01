import * as React from 'react';

interface Product {
  name?: string;
  image?: string;
  originalPrice?: number;
  discountPrice?: number;
  targetPrice?:number;
  realPrice?:number
}

interface CartEmailProps {
  name: string;
  products: Product[];
}

export const CartEmailTemplate = ({ name, products }: CartEmailProps) => `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>Exclusive Discounts for ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * {
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      word-break: break-word;
      -webkit-font-smoothing: antialiased;
      background-color: #f4f4f5;
    }
    .container {
      width: 100%;
      background-color: #f5f5f5;
      padding: 32px 0;
    }
    .content {
      width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 32px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .content img {
      max-width: 100%;
      border: 0;
    }
    .content p {
      margin: 0;
      line-height: 1.5;
    }
    .product-table {
      width: 100%;
      margin-bottom: 32px;
      border-collapse: separate;
      border-spacing: 0 16px;
    }
    .product-table img {
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      background-color: #7c3aed;
      border-radius: 8px;
      text-align: center;
      text-decoration: none;
      box-shadow: 0 4px 6px rgba(124,58,237,0.5);
    }
    .button-outline {
      color: #7c3aed;
      background-color: #ffffff;
      border: 2px solid #7c3aed;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #4b5563;
      padding: 24px;
    }
    .footer p {
      margin: 0 0 8px 0;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
      margin-right: 8px;
    }
    @media (max-width: 620px) {
      .content {
        width: 100% !important;
        padding: 16px;
      }
      .sm-w-full {
        width: 100% !important;
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .sm-py-8 {
        padding-top: 32px !important;
        padding-bottom: 32px !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content sm-w-full sm-px-4 sm-py-8">
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://rupeespot.com">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rupeespot_logo_email-C6ry5v3bgOsmzqUExgabYvr4Q6Dge2.png" width="200" alt="RupeeSpot" style="border: 0; max-width: 100%; vertical-align: middle;" />
        </a>
      </div>
      <p style="font-size: 25px; font-weight: 700; color: #111827; margin-top: 20px">Hey ${name},</p>
      <p style="font-size: 18px; color: #4b5563;">We've got some incredible deals just for you! Check out these exclusive discounts on items in your cart and tracked products:</p>
      ${products
        ?.map(
          (product) => `
        <table class="product-table">
          <tr>
            <td style="width: 120px; padding-right: 24px; vertical-align: top;">
              <img src="${product.image}" alt="${product.name}" width="120" style="max-width: 100%; height: auto;" />
            </td>
            <td style="vertical-align: top;">
              <p style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 8px;">${product.name}</p>
              <p style="font-size: 16px; text-decoration: line-through; color: #6b7280; margin-bottom: 4px;">Original: ₹${product.realPrice}</p>
              <p style="font-size: 20px; font-weight: 700; color: #7c3aed; margin-bottom: 4px;">Now: ₹${product.discountPrice}</p>
              <p style="font-size: 16px; font-weight: 600; color: #059669; margin-bottom: 4px;">You save: ₹${product.realPrice! - product.discountPrice!}!</p>
              ${product.targetPrice ? `
              <p style="font-size: 16px; margin-bottom: 4px;">Your Target Price: ₹${product.targetPrice}</p>
              ` : ''}
            </td>
          </tr>
        </table>
      `
        )
        .join("")}
      <p style="font-size: 18px; color: #4b5563; margin-bottom: 24px;">
        Don't miss out on these deals! Click the buttons below to view the products and manage your tracking:
      </p>
      <table style="width: 100%;">
        <tr>
          <td style="padding-right: 12px;">
            <a href="https://rupeespot.com/mytracking" class="button" style="color:#ffffff;">
              View Products
            </a>
          </td>
          <td style="padding-left: 12px;">
            <a href="https://rupeespot.com/mytracking" class="button button-outline">
              Manage Tracking
            </a>
          </td>
        </tr>
      </table>
      <p style="font-size: 16px; color: #4b5563; margin-top: 24px;">
        Thank you for using RupeeSpot for price tracking. We're always here to help you find the best deals!
      </p>
      <p style="font-size: 16px; color: #4b5563; margin-top: 24px;">
        Best regards,<br />
        <strong style="color: #111827;">RupeeSpot - Made with Love in India</strong><br />
        Your Trusted Shopping Partner
      </p>
    </div>
    <div class="footer">
      <p>
        <a href="https://facebook.com/rupeespot">Facebook</a>
        <a href="https://twitter.com/rupeespot">Twitter</a>
        <a href="https://instagram.com/rupeespot">Instagram</a>
      </p>
      <p>
        You're receiving this email because you've set up price alerts with RupeeSpot. 
        To manage your alerts or unsubscribe, please visit your <a href="https://rupeespot.com/settings" style="color: #7c3aed; text-decoration: underline;">account settings</a>.
      </p>
    </div>
  </div>
</body>
</html>
`;

export default CartEmailTemplate;

CartEmailTemplate.defaultProps = {
  name: "Valued Customer",
  products: [
    {
      name: "Premium Leather Wallet",
      image: "https://d7f9db0756.imgdist.com/public/users/Integrators/BeeProAgency/1135475_1121068/wallet.jpg",
      originalPrice: 1999,
      discountPrice: 1499,
    },
    {
      name: "Wireless Bluetooth Earbuds",
      image: "https://d7f9db0756.imgdist.com/public/users/Integrators/BeeProAgency/1135475_1121068/earbuds.jpg",
      originalPrice: 3999,
      discountPrice: 2999,
    },
    {
      name: "Stainless Steel Water Bottle",
      image: "https://d7f9db0756.imgdist.com/public/users/Integrators/BeeProAgency/1135475_1121068/bottle.jpg",
      originalPrice: 899,
      discountPrice: 699,
    },
  ],
};