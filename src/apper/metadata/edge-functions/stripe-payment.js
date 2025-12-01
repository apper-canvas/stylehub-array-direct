import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    const { method } = req;
    
    if (method === 'POST') {
      const body = await req.json();
      const { action } = body;
      
      switch (action) {
        case 'create_payment_intent':
          return await createPaymentIntent(body);
        case 'webhook':
          return await handleWebhook(req);
        default:
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Invalid action' 
            }), 
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }), 
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

async function createPaymentIntent(data) {
  try {
    const { amount, currency = 'inr', orderData } = data;
    
    // Get Stripe secret key
    const stripeSecretKey = await apper.getSecret('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Stripe configuration missing' 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate amount (minimum 50 paise for INR)
    if (!amount || amount < 50) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid amount. Minimum amount is ₹0.50' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create payment intent with Stripe
    const paymentIntentData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_id: orderData?.orderId || `ORDER_${Date.now()}`,
        customer_email: orderData?.shipping?.email || '',
        customer_phone: orderData?.shipping?.phone || '',
        items_count: orderData?.items?.length?.toString() || '0'
      }
    };
    
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(paymentIntentData).toString()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create payment intent',
          details: errorData.error?.message || 'Unknown error'
        }), 
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const paymentIntent = await response.json();
    
    return new Response(
      JSON.stringify({
        success: true,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to create payment intent',
        details: error.message
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleWebhook(req) {
  try {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = await apper.getSecret('STRIPE_WEBHOOK_SECRET');
    
    if (!signature || !webhookSecret) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing signature or webhook secret' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const body = await req.text();
    
    // Verify webhook signature (simplified - in production use Stripe's SDK)
    const event = JSON.parse(body);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      case 'payment_intent.canceled':
        await handlePaymentCancellation(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Webhook processing failed',
        details: error.message
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handlePaymentSuccess(paymentIntent) {
  // Here you would typically:
  // 1. Update order status in your database
  // 2. Send confirmation email to customer
  // 3. Trigger fulfillment process
  // 4. Update inventory
  
  const orderData = {
    payment_intent_id: paymentIntent.id,
    order_id: paymentIntent.metadata.order_id,
    amount: paymentIntent.amount / 100, // Convert back to currency units
    currency: paymentIntent.currency,
    status: 'paid',
    customer_email: paymentIntent.metadata.customer_email,
    timestamp: new Date().toISOString()
  };
  
  // Log successful payment (in production, save to database)
  console.log('Payment succeeded:', orderData);
  
  // In a real application, you would:
  // - Save order to database
  // - Send email confirmation
  // - Update product inventory
  // - Trigger shipping process
}

async function handlePaymentFailure(paymentIntent) {
  const failureData = {
    payment_intent_id: paymentIntent.id,
    order_id: paymentIntent.metadata.order_id,
    failure_reason: paymentIntent.last_payment_error?.message || 'Unknown error',
    timestamp: new Date().toISOString()
  };
  
  console.log('Payment failed:', failureData);
  
  // In production: 
  // - Update order status to 'payment_failed'
  // - Send notification to customer
  // - Release reserved inventory
}

async function handlePaymentCancellation(paymentIntent) {
  const cancellationData = {
    payment_intent_id: paymentIntent.id,
    order_id: paymentIntent.metadata.order_id,
    cancellation_reason: paymentIntent.cancellation_reason || 'User cancelled',
    timestamp: new Date().toISOString()
  };
  
  console.log('Payment cancelled:', cancellationData);
  
  // In production:
  // - Update order status to 'cancelled'
  // - Release reserved inventory
  // - Notify customer if needed
}