import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email and password are required')
				}

				await connectDB()

				const user = await User.findOne({ email: credentials.email })

				if (!user) {
					throw new Error('Invalid email or password')
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password as string,
					user.password
				)

				if (!isPasswordValid) {
					throw new Error('Invalid email or password')
				}

				return {
					id: user._id.toString(),
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					phone: user.phone,
					image: user.image,
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.firstName = user.firstName
				token.lastName = user.lastName
				token.phone = user.phone
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.firstName = token.firstName as string
				session.user.lastName = token.lastName as string
				session.user.phone = token.phone as string | undefined
			}
			return session
		},
	},
	pages: {
		signIn: '/login',
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
})

