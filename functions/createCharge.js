const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = (event, context, callback) => {
  console.log('createCharge');

  console.log('eventBody: ' + event.body);

  const eventBodySplit = event.body.split('=');
  console.log('eventBodySplit: ' + eventBodySplit);

  const eventBodySplit1stItem = eventBodySplit[1];
  console.log('eventBodySplit1stItem: ' + eventBodySplit1stItem);

  /*const requestBody = JSON.parse(event.body);
  console.log(requestBody);
  */
  const token = eventBodySplit1stItem; //requestBody.token.id;
  const amount = 1434; //requestBody.charge.amount;
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
