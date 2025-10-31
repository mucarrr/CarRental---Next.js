import { auth } from '@/auth'

export const getSession = async () => {
	return await auth()
}
export const getCurrentUser = async () => {
	const session = await auth()
	return session?.user ?? null
}