import { NextResponse } from "next/server"
import { CheckoutBody } from "@/types/next-auth"
import { getCurrentUser } from "@/lib/auth-utils"
import connectDB from "@/lib/mongodb"
import Car, { ICar } from "@/models/car"
import Stripe from "stripe"
import Order from "@/models/order"
import mongoose from "mongoose"

// install stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
})
// check if product already exists in stripe catalog

// add product to stripe catalog (idempotent by carId)
const createStripeProduct = async (car: ICar) => {
	return await stripe.products.create(
		{
			name: car.brand + ' ' + car.modelName,
			description: car.description,
			images: car.images,
			default_price_data: {
				currency: 'eur',
				unit_amount: car.pricePerDay * 100,
			},
			metadata: {
				carId: car._id.toString(),
			},
		},
		{ idempotencyKey: `product_car_${car._id.toString()}` }
	)
}


// find a product by metadata.carId; fallback to list if search is unavailable
const getProductByCarId = async (carId: string) => {
	try {
		const res = await stripe.products.search({
			query: `metadata['carId']:'${carId}' AND active:'true'`,
		})
		return res.data[0] ?? null
	} catch (_) {
		// Some accounts may not have search; fallback to list+filter (best-effort)
		const res = await stripe.products.list({ limit: 100 })
		return (
			res.data.find((p) => (p.metadata as any)?.carId === carId) ?? null
		)
	}
}

const getOrCreateProduct = async (car: ICar) => {
	const carId = car._id.toString()
	const existing = await getProductByCarId(carId)
	if (existing) return existing
	return await createStripeProduct(car)
}



export async function POST(req: Request) {
	try {
        await connectDB()
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }
        const body = await req.json()
        const car: ICar | null = await Car.findById(body.carId)
        if (!car) {
            return NextResponse.json({ success: false, error: 'Car not found' }, { status: 404 })
        }
        if (!car.isAvailable) {
            return NextResponse.json({ success: false, error: 'Car is not available' }, { status: 400 })
        }
		// ensure product exists exactly once in Stripe (no duplicates)
		const product = await getOrCreateProduct(car)
       const productInfo={
        price: product.default_price as string,
        quantity: body.days
       }
       const proto = req.headers.get('x-forwarded-proto') || 'http'
       const host = req.headers.get('host') || 'localhost:3000'
       const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`
       const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [productInfo],
        mode: 'payment',
        success_url: `${baseUrl}/cars/${body.carId}?success=true`,
        cancel_url: `${baseUrl}/cars/${body.carId}?success=false`,
       })
       // create order in DB (pending)
       await Order.create({
        userId: new mongoose.Types.ObjectId(currentUser.id),
        carId: new mongoose.Types.ObjectId(body.carId),
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        pickupDate: body.pickupDate,
        dropoffDate: body.dropoffDate,
        pickupTime: body.pickupTime,
        dropoffTime: body.dropoffTime,
        days: body.days,
        total: body.total,
        status: 'pending',
        stripeSessionId: session.id,
       })

       return NextResponse.json({ success: true, message: 'Checkout successful' , session: session.url, user: currentUser })    
       


    } catch (error: any) {
        console.error('Error in checkout:', error)
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
    }
}           