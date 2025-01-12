# Prevent App

Prevent App is a mobile application designed to help reduce the spread of diseases during epidemics. The app serves two key user groups: general users and healthcare professionals. It provides a streamlined experience for users to track their infection status, book appointments with doctors, and stay updated with local news, while doctors can efficiently manage appointments, monitor local statistics, and manage patient profiles.

## Features

### User Dashboard
- **Health Status Tracking**: View your current infection status (e.g., "Healthy," "Suspected of Illness," "Confirmed Case") with clear explanations and guidance.
- **Appointment Booking**: Locate nearby medical facilities, choose a doctor, and book an appointment. All scheduled appointments appear on your dashboard.
- **Local News Updates**: Stay informed with the latest disease-related news and updates in your area.

### Doctor Dashboard
- **Appointments Management**: View and manage upcoming appointments with filtering options.
- **Statistics Heatmap**: Analyze a heatmap showing confirmed cases in your area.
- **User Management**: Search through user profiles by various criteria and manage patient information.

## Technologies Used

- **[Expo](https://expo.dev/)**: For building the cross-platform mobile application.
- **[Firebase](https://firebase.google.com/)**: For backend services, including user authentication, database storage, and push notifications.
- **[React Native](https://reactnative.dev/)**: For creating the interactive and responsive user interface.

## Installation

To run the Prevent App locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/OllieDarwin/prevent-app.git
   cd prevent-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Rename `.env.example` to `.env` and fill in the corresponding information.

4. Start the development server:
   ```bash
   expo start
   ```

4. Use the Expo Go app on your mobile device to scan the QR code generated by the development server.

## Usage

### For Users:
1. Create an account or log in.
2. Check your current health status.
3. Book an appointment with a local doctor if needed.
4. Stay updated on disease-related news in your area.

### For Doctors:
1. Log in with your doctor credentials.
2. Manage your appointments from the dashboard.
3. View the local statistics heatmap for confirmed cases.
4. Search and manage patient profiles in the system.