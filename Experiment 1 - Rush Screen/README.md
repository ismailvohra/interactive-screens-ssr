# Experiment 1: Rush Information Screen (Passive Communication)

A real-time lunch rush monitoring system for Flavoria restaurant at the University of Turku. This application helps diners plan their lunch breaks by providing current wait times and recommending optimal dining periods. For the purpose of the research, *real-time* updates here refers to wait time values defined in the code based on historical data.

![Experiment 1 Demo](https://github.com/user-attachments/assets/fbb98e65-27c3-4202-abbe-4988236fa33f)

*   **Objective**: To influence diner behavior (specifically, to encourage earlier arrival times) without requiring direct interaction, by displaying estimated wait times and suggesting less busy periods.
*   **Communication Type**: Passive.
*   **Key Metric**: Shift in the proportion of diners arriving during the early or late lunch slot.

## Features

- 🕒 Real-time wait time monitoring
- 🔄 Automatic updates every minute
- 📊 Visual rush-level indicator
- 📅 Day-specific recommended lunch times
- 🌐 Bilingual support (English/Finnish)
- 📱 Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons

## Project Structure

```
src/
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
├── index.css      # Global styles
└── vite-env.d.ts  # TypeScript declarations
```

## Development

The application uses Vite for development with hot module replacement (HMR). Run the development server with:

```bash
npm run dev
```

## Building for Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Acknowledgement

This research was supported by Business Finland, under the Veturi program with the Dining Flow project (6547/31/2022).
