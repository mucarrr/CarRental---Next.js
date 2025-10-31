import { NextResponse } from "next/server"
import { CheckoutBody } from "@/types/next-auth"
import { getCurrentUser } from "@/lib/auth-utils"
import connectDB from "@/lib/mongodb"
import Car, { ICar } from "@/models/car"
import Stripe from "stripe"

// install stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    typescript: true,
})
// add product to stripe catalog
const createStripeProduct = async (car: ICar) => {
stripe.products.create({
    name: car.brand + ' ' + car.modelName,
    description: car.description,
    images: car.images,
    default_price_data: {
        currency: 'euro',
        unit_amount: car.pricePerDay * 100,
    },
    metadata: {
        carId: car._id.toString(),
    },
})
}
// list all products in stripe catalog
const getStripeProducts = async () => {
    
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
        // check if product already exists in stripe catalog

        // if not, create product in stripe catalog
        await createStripeProduct(car);




        return NextResponse.json({ success: true, message: 'Checkout successful' , body, carId: car._id, currentUser})
    } catch (error: any) {
        console.error('Error in checkout:', error)
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
    }
}           