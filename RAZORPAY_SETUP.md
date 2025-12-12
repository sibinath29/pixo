# Razorpay Payment Integration Setup

This guide will help you set up Razorpay payment gateway for your Pixo e-commerce website.

## Prerequisites

1. A Razorpay account (Sign up at https://razorpay.com/)
2. Your Razorpay API keys

## Setup Steps

### 1. Get Your Razorpay API Keys

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to **Settings** → **API Keys**
3. Generate Test/Live keys as needed
4. Copy your **Key ID** and **Key Secret**

### 2. Add Environment Variables

Add the following to your `.env.local` file:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Important:** 
- Never commit these keys to version control
- Use test keys for development
- Use live keys only in production

### 3. Test Mode

Razorpay provides test cards for testing payments:

**Test Cards:**
- **Success:** `4111 1111 1111 1111`
- **Failure:** `4000 0000 0000 0002`
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

### 4. Features Implemented

✅ **Order Creation API** (`/api/payments/create-order`)
   - Creates Razorpay order
   - Saves order to MongoDB
   - Returns order details for payment

✅ **Payment Verification API** (`/api/payments/verify-payment`)
   - Verifies payment signature
   - Updates order status
   - Prevents payment fraud

✅ **Checkout Page** (`/checkout`)
   - Customer details form (name, email, phone, address)
   - Order summary
   - Razorpay payment integration

✅ **Payment Success Page** (`/payment/success`)
   - Shows success message
   - Displays order ID
   - Links to continue shopping

✅ **Payment Failed Page** (`/payment/failed`)
   - Shows error message
   - Option to retry payment
   - Links back to cart

✅ **Order Model** (MongoDB)
   - Stores complete order information
   - Tracks payment status
   - Customer and item details

## Payment Flow

1. User adds items to cart
2. User clicks "Proceed to Checkout"
3. User fills in shipping details
4. User clicks "Pay" button
5. Razorpay payment modal opens
6. User completes payment
7. Payment is verified on server
8. Order is saved to database
9. User is redirected to success/failure page

## Security Features

- ✅ Payment signature verification
- ✅ Server-side order creation
- ✅ Server-side payment verification
- ✅ Order tracking in database
- ✅ Secure API key storage

## Order Information Stored

Each order in the database contains:
- Order ID (unique)
- Razorpay Order ID
- Razorpay Payment ID
- Customer details (name, email, phone, address)
- Items purchased (product details, quantity, size)
- Total amount
- Payment status (pending/paid/failed/refunded)
- Timestamps

## Testing

1. Use test API keys in development
2. Use test cards provided by Razorpay
3. Check order status in MongoDB
4. Verify payment in Razorpay dashboard

## Production Checklist

- [ ] Switch to Live API keys
- [ ] Update `.env.local` with production keys
- [ ] Test complete payment flow
- [ ] Set up webhook for payment updates (optional)
- [ ] Configure email notifications for orders
- [ ] Set up order management dashboard

## Support

For Razorpay support, visit: https://razorpay.com/support/

For issues with this integration, check:
- API keys are correct
- MongoDB connection is working
- Environment variables are set
- Razorpay dashboard for transaction logs

