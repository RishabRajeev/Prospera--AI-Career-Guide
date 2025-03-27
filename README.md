# AI Career Roadmap Generator

A Next.js application that helps users generate personalized career roadmaps using AI.

## Setup Instructions

### Method 1: Download as ZIP (Recommended for beginners)

1. Download the project files:
   - Click the green "Code" button above
   - Select "Download ZIP"
   - Extract the ZIP file to your computer

2. Open the project:
   - Open the extracted folder in your code editor (like VS Code)

3. Set up the environment:
   - Create a new file named `.env.local` in the project root folder
   - Add your Groq API key to the file:
     ```
     NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
     ```
   - You can get a Groq API key by signing up at [Groq](https://console.groq.com/)

4. Install dependencies:
   - Open a terminal in your code editor
   - Run this command:
     ```bash
     npm install
     ```

5. Start the application:
   - In the same terminal, run:
     ```bash
     npm run dev
     ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser

### Method 2: Using Git (For developers)

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [project-folder]
   ```

2. Create `.env.local` file and add your Groq API key:
   ```
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Uploading to GitHub

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com)
   - Click the "+" button in the top right
   - Select "New repository"
   - Name your repository
   - Don't initialize with README (since we already have one)
   - Click "Create repository"

2. Initialize Git in your project (if not already done):
   ```bash
   git init
   ```

3. Add your files to Git:
   ```bash
   git add .
   ```

4. Commit your changes:
   ```bash
   git commit -m "Initial commit"
   ```

5. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   ```

6. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```

## Features

- Generate personalized career roadmaps
- Student-specific career planning
- Detailed skill gap analysis
- Timeline and milestone planning
- Networking strategy recommendations
- Success metrics tracking

## Environment Variables

- `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API key (required)

## Note

Make sure to keep your API key secure and never commit it to version control. The `.env.local` file is already included in `.gitignore`. 