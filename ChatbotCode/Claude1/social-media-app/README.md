# ConnectHub - Social Media Platform

A modern, feature-rich social media application built with React, Firebase, and Tailwind CSS.

## Features

- 🔐 User Authentication (Email/Password with "Remember Me")
- 👤 Customizable User Profiles
- 📝 Post Creation (280 characters + images)
- 💬 Comments and Likes
- 👥 Friend System
- 💌 Direct Messaging
- 🔍 User Search
- 🎨 Theme Customization
- 📸 Photo Galleries
- 🔗 Referral System
- 👮 Admin Panel
- 👑 Owner Dashboard
- 📊 User Statistics
- 📥 Data Export

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Storage)
- **UI Components:** Lucide React, Framer Motion
- **Routing:** React Router v6

## Quick Start

See `SETUP_INSTRUCTIONS.md` for complete setup guide.

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## Project Structure

```
social-media-app/
├── src/
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts (Auth, Theme)
│   ├── pages/           # Page components
│   ├── firebase.js      # Firebase configuration
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## Firebase Setup Required

1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Cloud Storage
5. Update `src/firebase.js` with your config

## Environment

- Node.js 18+ required
- Modern browser with ES6 support

## License

MIT License - feel free to use for your own projects!

## Support

For issues and questions, refer to SETUP_INSTRUCTIONS.md
