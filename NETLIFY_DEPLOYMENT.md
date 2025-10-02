# Deploying to Netlify

This Next.js application can be deployed to Netlify. Follow these steps:

## Prerequisites

1. A Netlify account (sign up at https://netlify.com)
2. Git repository with your code (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. **Download your project**
   - Click the three dots in the top right of v0
   - Select "Download ZIP"
   - Extract the files

2. **Push to Git**
   - Create a new repository on GitHub/GitLab/Bitbucket
   - Push your code to the repository

3. **Connect to Netlify**
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select your repository

4. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - The `netlify.toml` file will automatically configure the rest

5. **Add environment variables** (if needed)
   - Go to Site settings → Environment variables
   - Add any required environment variables for your app

6. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application

### Option 2: Deploy via Netlify CLI

\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
\`\`\`

## Important Notes

- **Next.js Plugin**: Netlify automatically uses the `@netlify/plugin-nextjs` plugin for Next.js applications
- **Server Components**: Next.js App Router with Server Components is fully supported
- **API Routes**: All Next.js API routes will work as Netlify Functions
- **Environment Variables**: Make sure to add all required environment variables in Netlify's dashboard
- **Custom Domain**: You can add a custom domain in Site settings → Domain management

## Troubleshooting

If you encounter issues:
1. Check the build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set correctly
4. Check that Node version is 18 or higher

## Alternative: Deploy to Vercel (Recommended)

Since this is a Next.js app built in v0, deploying to Vercel is simpler:
1. Click the "Publish" button in the top right of v0
2. Your app will be automatically deployed to Vercel with optimal configuration

Vercel provides the best performance and features for Next.js applications.
