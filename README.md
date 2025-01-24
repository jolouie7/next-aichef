# Ai Chef

AI-powered meal generator.

> Test login credentials:
>
> ```bash
> username: test@gmail.com
> password: test1234
> ```

[Live Demo](https://next-aichef.vercel.app/)

[Video Demo](https://www.loom.com/embed/b49ac0ec07ba4f64a130f1501811931b?sid=ec5fbfd5-9d44-4153-aa92-b92981644a8a)

## Tech Stack

- Next.js (React)
- TypeScript
- Tailwind CSS
- OpenAI (GPT and DALL-E)
- NextAuth
- Shadcn UI
- Vercel
- PostgreSQL (via NeonDB)
- Jest
- React Testing Library
- Playwright

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ai-chef.git
cd next-aichef
npm install
```

2. Create a `.env` file with the following variables:

```bash
DATABASE_URL="your_database_url"
NEXTAUTH_URL="your_nextauth_url" (If not deployed on Vercel)
NEXTAUTH_SECRET="your_nextauth_secret"
OPENAI_API_KEY="your_openai_api_key"
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future improvements

- Google OAuth
- Email verification
- Password reset
