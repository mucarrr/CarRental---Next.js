'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface Review {
	_id: string
	userName: string
	rating: number
	comment: string
	createdAt: string
}

interface CarReviewsProps {
	carId: string
	averageRating: number
	totalReviews: number
}

export default function CarReviews({ carId, averageRating, totalReviews }: CarReviewsProps) {
	const { data: session } = useSession()
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [rating, setRating] = useState(5)
	const [comment, setComment] = useState('')

	useEffect(() => {
		fetchReviews()
	}, [carId])

	const fetchReviews = async () => {
		setLoading(true)
		try {
			const res = await fetch(`/api/reviews?carId=${carId}`)
			const result = await res.json()
			if (result.success) {
				setReviews(result.data)
			}
		} catch (error) {
			console.error('Error fetching reviews:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!session) {
			toast.error('Please login to submit a review')
			return
		}

		if (comment.trim().length < 10) {
			toast.error('Comment must be at least 10 characters')
			return
		}

		setSubmitting(true)
		try {
			const res = await fetch('/api/reviews', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					carId,
					rating,
					comment: comment.trim(),
				}),
			})

			const result = await res.json()

			if (result.success) {
				toast.success('Review submitted successfully!')
				setComment('')
				setRating(5)
				fetchReviews()
				// Refresh page to update average rating
				window.location.reload()
			} else {
				toast.error(result.error || 'Failed to submit review')
			}
		} catch (error) {
			console.error('Error submitting review:', error)
			toast.error('Failed to submit review')
		} finally {
			setSubmitting(false)
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const renderStars = (rating: number, interactive = false, onHover?: (r: number) => void) => {
		return (
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`h-5 w-5 ${
							star <= rating
								? 'fill-yellow-400 text-yellow-400'
								: 'text-gray-300'
						} ${interactive ? 'cursor-pointer transition-colors hover:text-yellow-400' : ''}`}
						onClick={() => interactive && setRating(star)}
						onMouseEnter={() => interactive && onHover && onHover(star)}
					/>
				))}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Review Form */}
			{session ? (
				<div className="rounded-xl bg-white p-6 shadow-sm">
					<h3 className="mb-4 text-lg font-semibold text-gray-900">Write a Review</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="label-field mb-2">Rating</label>
							{renderStars(rating, true)}
						</div>

						<div>
							<label htmlFor="comment" className="label-field">
								Comment
							</label>
							<textarea
								id="comment"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								rows={4}
								maxLength={500}
								className="input-field resize-none"
								placeholder="Share your experience with this car..."
								required
								disabled={submitting}
							/>
							<p className="mt-1 text-xs text-gray-500">
								{comment.length}/500 characters
							</p>
						</div>

					<button
						type="submit"
						disabled={submitting || comment.trim().length < 10}
						className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
							submitting || comment.trim().length < 10
								? 'cursor-not-allowed bg-gray-300 text-gray-500'
								: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
						}`}
					>
						{submitting ? 'Submitting...' : 'Submit Review'}
					</button>
					</form>
				</div>
			) : (
				<div className="rounded-xl bg-blue-50 p-6 text-center">
					<p className="text-sm text-gray-600">
						Please <a href="/login" className="font-medium text-blue-600 hover:underline">login</a> to write a review
					</p>
				</div>
			)}

			{/* Reviews List */}
			<div className="rounded-xl bg-white p-6 shadow-sm">
				<h3 className="mb-6 text-lg font-semibold text-gray-900">
					Customer Reviews ({totalReviews})
				</h3>

				{loading ? (
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="animate-pulse">
								<div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
								<div className="mb-2 h-3 w-full rounded bg-gray-200"></div>
								<div className="h-3 w-3/4 rounded bg-gray-200"></div>
							</div>
						))}
					</div>
				) : reviews.length === 0 ? (
					<p className="py-8 text-center text-gray-500">No reviews yet. Be the first to review!</p>
				) : (
					<div className="space-y-6">
						{reviews.map((review) => (
							<div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
								<div className="mb-2 flex items-center justify-between">
									<div>
										<p className="text-sm font-bold text-gray-900">{review.userName}</p>
										<p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
									</div>
									{renderStars(review.rating)}
								</div>
								<p className="text-sm text-gray-700">{review.comment}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

