const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // First validate the request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { paymentMethodId, amount, email } = JSON.parse(event.body);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      receipt_email: email
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentIntent: paymentIntent
      })
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};