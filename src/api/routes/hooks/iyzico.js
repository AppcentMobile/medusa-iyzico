import { PostgresError } from "@medusajs/medusa/dist/utils"

export default async (req, res) => {
  const signature = req.headers["stripe-signature"]

  let event
  try {
    const iyzicoProviderService = req.scope.resolve("iyzico-payment")
    event = iyzicoProviderService.constructWebhookEvent(req.body, signature)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  function isPaymentCollection(id) {
  }

  async function handleCartPayments(event, req, res, cartId) {
    
    }

    res.sendStatus(200)
  }

  async function handlePaymentCollection(event, req, res, id, paymentIntentId) {
  
  }


  


