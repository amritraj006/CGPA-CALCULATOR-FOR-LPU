# LPU CGPA Calculator

A modern, professional Academic GPA Console built with React and Vite. Features a sleek glassmorphism dark-mode UI with dynamic backgrounds.

## Local Development

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment Requirements

This project is perfectly configured to be deployed on [Vercel](https://vercel.com/). 

### Step-by-Step Deployment:
1. Push this repository to your GitHub account.
2. Log in to Vercel and click **Add New Project**.
3. Import your GitHub repository.
4. **CRITICAL STEP**: In the project configuration, set the **Root Directory** to `client`.
5. Vercel will automatically detect the **Vite** framework. The build command (`npm run build`) and output directory (`dist`) will be configured automatically.
6. Click **Deploy**.

*Note: A `vercel.json` file is already included in the `client` directory to ensure that direct URL routing works seamlessly for single-page applications.*
