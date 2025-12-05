# Campus Connect

Campus Connect is a React Native application designed to facilitate campus events and interactions.

## Environment Setup

This project uses `react-native-dotenv` to manage environment variables.

1.  **Create a `.env` file** in the root directory. You can copy the example file:

    ```bash
    cp .env.example .env
    ```

2.  **Configure the variables** in `.env`:

    ```env
    # ========= CLOUDINARY CONFIG =========
    CLOUD_NAME=YOUR_CLOUD_NAME_HERE
    UPLOAD_PRESET=YOUR_UPLOAD_PRESET_HERE

    # ========= API CONFIG =========
    API_URL_DEV=http://10.7.29.152:5001
    API_URL_PROD=https://campus-connect-backend-e7uf.onrender.com
    ```

    _Note: `API_URL_DEV` should point to your local backend server, and `API_URL_PROD` to the production server._

## Folder Structure

```
.
├── App.js                      # Entry point
├── Screens                     # Application screens
│   ├── EditProfileScreen.jsx
│   ├── EventDetail.jsx
│   ├── Events.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── ...
├── api                         # API configuration and calls
│   └── api.js
├── assets                      # Images and icons
├── components                  # Reusable UI components
│   ├── EventCard.jsx
│   ├── EventHeroSlider.jsx
│   └── ...
├── context                     # React Context (e.g., UserContext)
├── hooks                       # Custom React hooks
├── navigation                  # Navigation stacks (Auth, Main, etc.)
├── reducer                     # State reducers
└── theme                       # Theme configuration
```

## Running the App

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npx expo start
    ```
