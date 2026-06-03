import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { amount, recurring } = req.body
  if(!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })

  try{
    const isRecurring = !!recurring
    const line_item = {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Donation to Indian Caucus' },
        unit_amount: Math.round(Number(amount) * 100)
      },
      quantity: 1
    }

    if(isRecurring){
      // For recurring, add recurring interval
      line_item.price_data.recurring = { interval: 'month' }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [line_item],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/donate?canceled=1`
    })

    return res.status(200).json({ url: session.url })
  }catch(err){
    console.error('Stripe error:', err)
    return res.status(500).json({ error: 'Stripe error' })
  }
}
