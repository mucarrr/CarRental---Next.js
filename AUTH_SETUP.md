# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/carrental
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carrental?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/carrental`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Replace username and password in connection string
5. Use the connection string in MONGODB_URI

## Features Implemented

### User Registration
- **Route:** `/signup`
- **Fields:** Email, Password, First Name, Last Name, Phone (optional)
- Password hashing with bcryptjs
- Email validation and uniqueness check
- Strong password requirements (8+ chars, uppercase, lowercase, number, special char)

### User Login
- **Route:** `/login`
- Credentials authentication with NextAuth
- JWT session management

### Header Component
- Shows **Login/Sign up** buttons when not authenticated
- Shows **profile avatar, heart, bell, settings icons** when authenticated
- Profile dropdown with:
  - User info (name, email)
  - My Profile link
  - My Bookings link
  - Sign out button
- Avatar shows first letter of first name if no profile image

### API Routes
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

## Database Schema

### User Model
```typescript
{
  email: string (required, unique)
  password: string (required, hashed, min 8 chars)
  firstName: string (required)
  lastName: string (required)
  phone: string (optional)
  image: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

## Running the Project

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` with required variables

3. Start development server:
```bash
npm run dev
```

4. Visit http://localhost:3000

## Testing Authentication

1. Go to `/signup` and create an account
2. After registration, you'll be redirected to `/login`
3. Login with your credentials
4. You'll see your profile avatar in the header
5. Click avatar to see dropdown menu
6. Test sign out functionality

