// Quick script to check if environment variables are loaded
// Run with: node check-env.js

require('dotenv').config({ path: '.env.local' });

console.log('Checking Razorpay environment variables...\n');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId) {
  console.log('✅ RAZORPAY_KEY_ID is set');
  console.log('   Value:', keyId.substring(0, 10) + '...' + keyId.substring(keyId.length - 4));
} else {
  console.log('❌ RAZORPAY_KEY_ID is NOT set');
}

if (keySecret) {
  console.log('✅ RAZORPAY_KEY_SECRET is set');
  console.log('   Value:', keySecret.substring(0, 10) + '...' + keySecret.substring(keySecret.length - 4));
} else {
  console.log('❌ RAZORPAY_KEY_SECRET is NOT set');
}

console.log('\n---');
if (keyId && keySecret) {
  console.log('✅ Both keys are configured!');
  console.log('⚠️  Make sure to restart your Next.js server after adding these keys.');
} else {
  console.log('❌ Keys are missing. Please add them to .env.local:');
  console.log('');
  console.log('RAZORPAY_KEY_ID=rzp_test_xxxxx');
  console.log('RAZORPAY_KEY_SECRET=xxxxx');
}

