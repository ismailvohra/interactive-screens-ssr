# Experiment 2: Intentions Poll (Active Communication)

A real-time lunch voting application for Flavoria restaurant that helps optimize dining times and reduce food waste.

This repository contains the source code for the Experiment 2 conducted as part of my Master's thesis titled "Designing for Engagement: An Affordance-Based Model for Interactive Screens to trigger user driven actions in Self-Service Restaurants."

![Experiment 2 Demo](https://github.com/user-attachments/assets/a410347e-c20c-49df-898e-392eb0009ec8)

## Features

- 🗳️ Real-time voting system for lunch plans
- 🕒 Smart time recommendations to avoid rush hours (defined in code, based on historical data)
- 📊 Daily voting statistics and progress tracking
- 🌍 Bilingual support (Finnish/English)
- 📱 Responsive design for all devices
- ✨ Interactive UI with animations and visual feedback
- ♻️ Helps reduce food waste through better planning
- 🔗 Device-level tracking via hashed URLs

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
- Base API URL is configured in `src/api/flavoria.ts`. For security reasons, the API endpoint is removed from this repository.

## API Schema
Following is a sample JSON schema of the API:
```
{
created: "2025-03-25T09:20:32.027+02:00",
answer: true,
time_given: null,
deviceid: 1
}
```

## Project Structure

```
src/
├── api/          # API integration
├── components/   # Reusable UI components
├── config/       # Configuration files
├── lib/          # Utility functions
└── translations/ # Localization files
```

## Thesis Context

This experiment is the second of the three experiments to form the empirical basis for validating the affordance-based design model proposed in the thesis. For a comprehensive understanding of the theoretical background, model development, experimental design, results, and discussion, please refer to the full thesis document available at University of Turku library.

## Acknowledgement

This research was supported by Business Finland, under the Veturi program with the Dining Flow project (6547/31/2022).
