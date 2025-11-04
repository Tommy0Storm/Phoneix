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

### Advanced Features:

#### 1. Google Search Grounding
- **Real-time pricing**: The chatbot can search Google for current market prices of materials and components
- **Accurate estimates**: Uses live data to provide up-to-date cost information
- **Source attribution**: Mentions where prices were found for transparency

#### 2. Smart Pricing Calculation
- **Automated quotes**: Uses the `calculateJobQuote` tool to generate detailed estimates
- **Material markup**: Automatically applies 30% markup to all materials
- **Travel costs**: Includes R300 daily travel cost for on-site visits
- **Labor calculation**: R700 per hour rate (never shown directly to users)
- **Detailed breakdowns**: Shows itemized costs with materials, labor, and travel

#### 3. Voice Input with Web Speech API
- **Microphone button**: Users can speak their questions instead of typing
- **Real-time transcription**: Voice is converted to text automatically
- **Browser support**: Works in Chrome, Edge, and Safari
- **South African English**: Optimized for en-ZA language detection
- **Visual feedback**: Shows when listening and displays transcription progress

### Key Features:

- Uses Gemini 2.0 Flash Experimental model for faster responses
- Streaming text generation for real-time chat experience
- Tool calling for price calculations
- Conversation history tracking
- Professional error handling with user-friendly messages
- Voice input for hands-free interaction

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
