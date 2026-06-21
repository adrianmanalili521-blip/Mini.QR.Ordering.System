# Mini QR Ordering System

A lightweight, local QR-based restaurant ordering application. Customers scan a QR code to view the menu and place orders, while administrators can manage products and view incoming sales records.

## Tech Stack

*   **Frontend:** React Native (Expo)
*   **Backend:** Express.js (Node.js)
*   **Database:** SQLite

---

## Features

### Customer Interface
*   **Product Categories:** Browse menu items organized by specific categories.
*   **Cart Management:** Seamlessly add or remove products before checkout.
*   **Mock Payment Options:** 
    *   **Pay via QR:** Displays a static QR image for scanning (no live gateway integration).
    *   **Pay via Cash:** Direct checkout option that instantly triggers a success status.

### Admin Panel
*   **Password Protection:** Secure access wall restricting unauthorized users.
*   **Order Tracker:** View-only dashboard showing all successfully bought products.

---

## Screenshots

<p align="center">
  <img width="100%" alt="Screenshot 1" src="https://github.com/user-attachments/assets/04273e6d-ea78-48ae-85fc-5befd2ae25ec" />
  <img width="100%" alt="Screenshot 2" src="https://github.com/user-attachments/assets/016c6a4b-763b-48e8-b652-2cf361d55f8e" />
  <img width="100%" alt="Screenshot 3" src="https://github.com/user-attachments/assets/5a2e018e-c4ff-40fc-a9f5-ed613c6db354" />
  <img width="100%" alt="Screenshot 4" src="https://github.com/user-attachments/assets/88796656-2959-4836-a415-ea56903831a2" />
  <img width="100%" alt="Screenshot 5" src="https://github.com/user-attachments/assets/4618a716-927c-4d21-a75e-769c02efea8d" />
  <img width="100%" alt="Screenshot 6" src="https://github.com/user-attachments/assets/60c5e2b6-f8d9-4054-8cfa-01c2597d2b1a" />
  <img width="100%" alt="Screenshot 7" src="https://github.com/user-attachments/assets/e71609e0-a1ce-4ccf-8d59-8a6389e68cea" />
  <img width="100%" alt="Screenshot 8" src="https://github.com/user-attachments/assets/6f5e56d8-b914-4047-9b2a-a294a9cbd3d5" />
</p>

---

## Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** and **Expo CLI** installed on your machine.

### 2. Backend Setup (Express + SQLite)
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the Express server
node server.js
```
*Note: The SQLite database file will be automatically created on the first server initialization.*

### 3. Frontend Setup (React Native Expo)
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```
*Scan the Expo QR code with your physical device or run it on an emulator.*

---

## API Endpoints (Quick Reference)

### Products
*   `GET /api/products` - Fetch all menu items categorized.
*   `POST /api/products` - Add a new menu item.
*   `DELETE /api/products/:id` - Remove a menu item.

### Orders
*   `POST /api/orders` - Place a new order (Cash/QR status).
*   `GET /api/admin/orders` - Fetch all purchased items (Requires admin verification).
