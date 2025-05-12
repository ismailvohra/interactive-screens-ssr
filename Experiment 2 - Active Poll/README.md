# Flavoria Lunch Voting App

A real-time lunch voting application for Flavoria restaurant that helps optimize dining times and reduce food waste.

![App Screenshot](https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80)

## Features

- 🗳️ Real-time voting system for lunch plans
- 🕒 Smart time recommendations to avoid rush hours
- 📊 Daily voting statistics and progress tracking
- 🌍 Bilingual support (Finnish/English)
- 📱 Responsive design for all devices
- ✨ Interactive UI with animations and visual feedback
- ♻️ Helps reduce food waste through better planning

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React Icons
- React Canvas Confetti

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Setup

The application uses environment variables for API configuration:
- Base API URL is configured in `src/api/flavoria.ts`

## Project Structure

```
src/
├── api/          # API integration
├── components/   # Reusable UI components
├── config/       # Configuration files
├── lib/          # Utility functions
└── translations/ # Localization files
```

## Deployment

The application is configured for deployment on Netlify with automatic builds and deployments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT