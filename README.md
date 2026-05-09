# BreakingIron 🏋️‍♂️

> **Log it. Lift it. Break it.**

BreakingIron is an advanced, premium-tier lifting tracker and analytical platform built for serious athletes. Moving beyond simple rep-counting, BreakingIron provides deep insights into your workout performance with live "ghost-data" tracking, robust statistical dashboards, dynamic site-wide unit conversions, and a secure, role-based ecosystem.

---

## ✨ Key Features

### 🏋️ Live Session Tracking
- **Freestyle or Template:** Start an empty workout on the fly or load up a pre-configured routine.
- **Ghost Data:** When running a routine, see your exact sets, weights, and reps from your *previous* session faded in the background so you know exactly what numbers to beat.
- **Live PR Flags:** Hit a new estimated 1-Rep Max? The system instantly flags the set as a Personal Record during your workout.

### 📊 Advanced Analytics
- **Headquarters Dashboard:** View your 30-day consistency heatmap, total training volume, and muscle distribution pie charts based on actual lifted volume.
- **Performance Lab:** Analyze your strength progression over time with interactive Line and Bar charts showing Max Weight and Estimated 1RM trends.

### ⚙️ Premium User Experience
- **Dynamic Unit Toggling:** Prefer Pounds over Kilograms? Toggle your preference in your Profile Settings and watch the *entire site* (Dashboards, Logs, Charts) instantly convert, while the database remains securely anchored in Kilograms.
- **Client-Side Avatars:** Upload profile photos instantly. Images are automatically resized and compressed into Base64 strings natively in the browser, eliminating the need for complex external file storage.

### 🛡️ Security & Administration
- **Role-Based Access Control:** Secure JWT authentication with `admin` and `user` privilege separation.
- **Admin Dashboard:** Administrators can oversee global platform statistics, manage the global Exercise Library, and moderate user accounts.
- **Soft Deletes:** Account deletions strictly anonymize personal data while preserving orphan workout logs to maintain global platform analytics.

---

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- Framer Motion (Cinematic Animations)
- Recharts (Data Visualization)
- Tailwind CSS / Vanilla CSS
- Date-fns

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Nodemailer (Password recovery emails)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string (or local MongoDB)

### Installation

1. **Clone the repository** and navigate to the project directory.

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables
Create a `.env` file in the **root** of the project and populate it with the following keys:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/breakingiron
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

### Running the App

1. **Start the Backend:**
   ```bash
   cd server
   npm run dev
   ```
2. **Start the Frontend:**
   Open a new terminal window:
   ```bash
   cd client
   npm run dev
   ```
3. Navigate to `http://localhost:5173` (or whichever port Vite allocates) to view the app!

---

## 🚢 Deployment

**BreakingIron** is configured to run smoothly in a split-deployment production environment:
- The **Backend** should be deployed as an Express Web Service (e.g., Render.com) with the root directory set to `server`.
- The **Frontend** should be deployed as a static site (e.g., Vercel) pointing to the `client` directory.
- *Ensure `sameSite: 'none'` cross-domain cookie logic is active for JWTs if deployed across separate domains.*

---

## 📬 Contact
Built by **Shaharyar Rizwan**  
Email: [shaharyar.rizwan11@gmail.com](mailto:shaharyar.rizwan11@gmail.com)  
Phone: 03238449301  