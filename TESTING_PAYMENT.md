# Testing Razorpay Payment Integration

## Quick Test Guide

Now that you've added your Razorpay keys, follow these steps to test the payment flow:

### 1. Restart Your Development Server

**Important:** Restart your server to load the new environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Test the Complete Payment Flow

1. **Add Products to Cart**
   - Go to `/posters` or `/polaroids`
   - Click on a product
   - Click "Add to Cart"
   - Select a size if applicable

2. **Go to Cart**
   - Click the cart icon in the header
   - Verify items are in cart
   - Click "Proceed to Checkout"

3. **Fill Checkout Form**
   - Enter your details:
     - **Name:** Your full name
     - **Email:** Your email address
     - **Phone:** Your phone number (with country code, e.g., +91 9876543210)
     - **Address Line 1:** Your street address
     - **Address Line 2:** (Optional) Apartment, suite, etc.
     - **City:** Your city
     - **State:** Your state
     - **ZIP Code:** Your postal code
     - **Country:** India (default)

4. **Initiate Payment**
   - Click "Pay ₹[amount]" button
   - Razorpay payment modal should open

5. **Test Payment (Using Test Cards)**

   **For Successful Payment:**
   - **Card Number:** `4111 1111 1111 1111`
   - **Expiry:** Any future date (e.g., 12/25)
   - **CVV:** Any 3 digits (e.g., 123)
   - **Name:** Any name
   - Click "Pay"

   **For Failed Payment (Testing Error Handling):**
   - **Card Number:** `4000 0000 0000 0002`
   - **Expiry:** Any future date
   - **CVV:** Any 3 digits
   - **Name:** Any name
   - Click "Pay" (should show failure)

### 3. Verify Results

**After Successful Payment:**
- ✅ You should be redirected to `/payment/success`
- ✅ Order ID should be displayed
- ✅ Cart should be cleared
- ✅ Order should be saved in MongoDB with status "paid"

**After Failed Payment:**
- ✅ You should be redirected to `/payment/failed`
- ✅ Error message should be displayed
- ✅ Option to retry payment

### 4. Check Order in Database

You can verify orders are being saved:

```javascript
// In MongoDB or using a database viewer
// Orders collection should contain:
{
  orderId: "PIXO_...",
  razorpayOrderId: "order_...",
  customer: { ... },
  items: [ ... ],
  amount: 10000, // in paise
  status: "paid" or "pending" or "failed"
}
```

### 5. Check Razorpay Dashboard

1. Go to https://dashboard.razorpay.com/
2. Navigate to **Payments** → **Transactions**
3. You should see test transactions listed
4. Check order details and payment status

## Troubleshooting

### Issue: "Razorpay keys are not configured"
**Solution:** 
- Make sure `.env.local` file exists in project root
- Verify keys are added correctly:
  ```env
  RAZORPAY_KEY_ID=rzp_test_xxxxx
  RAZORPAY_KEY_SECRET=xxxxx
  ```
- Restart the development server

### Issue: Payment modal doesn't open
**Solution:**
- Check browser console for errors
- Verify Razorpay script is loading
- Check network tab for API errors
- Ensure you're using test keys (not live keys) for development

### Issue: Payment verification fails
**Solution:**
- Check server logs for error messages
- Verify `RAZORPAY_KEY_SECRET` is correct
- Ensure MongoDB connection is working
- Check order exists in database before verification

### Issue: Orders not saving to database
**Solution:**
- Verify MongoDB connection string in `.env.local`
- Check `MONGODB_URI` is set correctly
- Check server logs for database errors
- Ensure Order model is properly imported

## Test Checklist

- [ ] Server restarted after adding keys
- [ ] Can add products to cart
- [ ] Can navigate to checkout page
- [ ] Can fill customer details form
- [ ] Payment modal opens when clicking "Pay"
- [ ] Test card payment succeeds
- [ ] Redirects to success page after payment
- [ ] Order saved in database
- [ ] Cart cleared after successful payment
- [ ] Failed payment shows error page
- [ ] Can retry payment after failure

## Next Steps

Once testing is complete:
1. ✅ Test with real cards (if using live keys)
2. ✅ Set up email notifications for orders
3. ✅ Create admin dashboard to view orders
4. ✅ Set up webhooks for payment updates (optional)
5. ✅ Prepare for production deployment

## Support

If you encounter issues:
1. Check server console for errors
2. Check browser console for client-side errors
3. Verify all environment variables are set
4. Check Razorpay dashboard for transaction logs
5. Review MongoDB for saved orders

Happy testing! 🎉

