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

    var value = pairSplit[1];
    console.log('value: ' + value);


    eventObj[key] = value;
  }

  console.log('eventObj.stripeToken: ' + eventObj.stripeToken);
  console.log('eventObj.amount: ' + eventObj.amount);

  const token = eventObj.stripeToken;
  const amount = eventObj.amount * 100; // multiplied by 100 to convert dollars entered by donor, into pennies that stripe counts in
  const currency = 'USD'; //hard coded per Guru

  return stripe.charges.create({ // Create Stripe charge with token
    amount,
    currency,
    description: 'Serverless Stripe Test charge Avram AWS',
    source: token,
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
