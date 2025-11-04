# Deployment Guide

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

### 1. Configure GitHub Secret

You need to add your Gemini API key as a GitHub secret:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key

### 2. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

### 3. Deploy

The deployment will trigger automatically on every push to the `main` branch. You can also manually trigger it:

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## AI Improvements with Vercel SDK

This project now uses the Vercel AI SDK (`ai` and `@ai-sdk/google`) which provides:

- **Improved streaming**: Better real-time response streaming
- **Enhanced error handling**: More robust error management
- **Type safety**: Full TypeScript support
- **Better developer experience**: Cleaner, more maintainable code
- **Modern architecture**: Uses the latest AI SDK patterns

### Key Features:

- Uses Gemini 2.0 Flash Experimental model for faster responses
- Streaming text generation for real-time chat experience
- Conversation history tracking
- Professional error handling with user-friendly messages

## Local Development

1. Create a `.env` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project URL

Once deployed, your site will be available at:
`https://tommy0storm.github.io/Phoneix/`
