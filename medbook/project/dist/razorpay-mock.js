// This is a mock implementation of Razorpay for development purposes
// In production, this would be replaced by the actual Razorpay script

window.Razorpay = function(options) {
  return {
    open: function() {
      console.log('Razorpay payment initiated with options:', options);
      
      // Simulate a payment success after 2 seconds
      setTimeout(() => {
        if (typeof options.handler === 'function') {
          options.handler({
            razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 15),
            razorpay_order_id: options.order_id,
            razorpay_signature: 'signature_' + Math.random().toString(36).substring(2, 15)
          });
        }
      }, 2000);
    }
  };
};

console.log('Razorpay mock loaded');