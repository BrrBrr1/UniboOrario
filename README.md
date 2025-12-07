# Unibo Orario

A responsive Progressive Web App (PWA) designed to view and manage class schedules for the University of Bologna (Unibo). This application provides a clean, user-friendly interface to access real-time timetable data directly from Unibo's public services.

## Features

- **Intuitive Timetable**: View your schedule in **Weekly** or **Daily** modes with smooth transitions.
- **Smart Filtering**: 
  - Select your specific **Course** and **Year**.
  - Toggle specific **Classes/Modules** on or off to declutter your view.
  - Search/Filter by **Title**, **Teacher**, or **Location**.
- **Custom Courses**: Support for adding any Unibo course by providing its timetable JSON URL.
- **Offline Ready**: Fully functional PWA that can be installed on your device (iOS, Android, Desktop).
- **Personalization**:
  - **Dark/Light Mode**: Automatic system detection with manual override.
  - **Compact View**: For denser information density.
  - **Notifications**: Alerts for app updates and actions.
- **Gestures**: Swipe navigation support for touch devices.

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository or extract the project files.
2. Navigate to the project directory.
3. Install dependencies.

## Tech Stack

- **Core**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **UI/Icons**: [Lucide React](https://lucide.dev/), CSS Modern Variables
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utilities**: [date-fns](https://date-fns.org/) (Date management), [uuid](https://github.com/uuidjs/uuid)

## Configuration

The application uses `localStorage` to persist user preferences (selected course, filters, theme) and `sessionStorage` for temporary state.

### Adding New Courses

Default courses are defined in `src/data/courses.js`. You can add more directly in the file or use the "Add Custom Course" feature within the app interface.