const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = (event, context, callback) => {
  console.log('createCharge');

  console.log('eventBody: ' + event.body);

  const eventObj = {}

  const eventBodySplit = event.body.split('&');
  console.log('eventBodySplit: ' + eventBodySplit);

  for(var i = 0; i < eventBodySplit.length; i++){
    console.log('i is: ' + i);

    var pair = eventBodySplit[i];
    console.log('pair: ' + pair);

    var pairSplit= pair.split('=');
    console.log('pairSplit: ' + pairSplit);

    var key = pairSplit[0];
    console.log('key: ' + key);

    var value = decodeURIComponent(pairSplit[1]);
    console.log('value: ' + value);


    eventObj[key] = value;
  }

  console.log('eventObj.amount typeof: ' + typeof(eventObj.amount));

  let actualAmount = eventObj.amount;

  if((eventObj.amount == undefined || eventObj.amount == "") && eventObj.amount_prefilled >= 1){
    actualAmount = eventObj.amount_prefilled;
  }

  console.log('eventObj.stripeToken: ' + eventObj.stripeToken);
  console.log('eventObj.amount: ' + eventObj.amount);
  console.log('eventObj.email: ' + JSON.stringify(eventObj.email));

  const token = eventObj.stripeToken;
  const amount = actualAmount * 100; // multiplied by 100 to convert dollars entered by donor, into pennies that stripe counts in
  const currency = 'USD'; //hard coded per Guru

  return stripe.charges.create({ // Create Stripe charge with token
    amount,
    currency,
    description: 'Serverless Stripe Test charge Avram AWS',
    source: token,
    receipt_email: eventObj.email,
    metadata: {'email': eventObj.email, 'phone': eventObj.phone}
  })
    .then((charge) => { // Success response
      console.log(charge);
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: `Charge processed succesfully!`,
          charge,
        }),
      };
      callback(null, response);
    })
    .catch((err) => { // Error response
      console.log(err);
      const response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: err.message,
        })
      };
      callback(null, response);
    })
};
