const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = (event, context, callback) => {
  console.log('createCharge');

  console.log('eventBody: ' + event.body);

  const eventBodySplit = event.body.split('&');
  console.log('eventBodySplit: ' + eventBodySplit);

  const amountEquals = eventBodySplit[0];
  console.log('amountEquals: ' + amountEquals);

  const tokenEquals = eventBodySplit[1];
  console.log('tokenEquals: ' + tokenEquals);

  const amountEqualsSplit = amountEquals.split('=');
  console.log('amountEqualsSplit: ' + amountEqualsSplit);

  const tokenEqualsSplit = tokenEquals.split('=');
  console.log('tokenEqualsSplit: ' + tokenEqualsSplit);

  /*const requestBody = JSON.parse(event.body);
  console.log(requestBody);
  */
  const token = tokenEqualsSplit[1]; //requestBody.token.id;
  /* multiplied by 100 to convert dollars entered by donor, into pennies that stripe counts in */
  const amount = amountEqualsSplit[1] * 100; //requestBody.charge.amount;
  const currency = 'USD'; //requestBody.charge.currency;

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
