# 👗 AuraFit AI

> **AI-Powered Personal Wardrobe & Fashion Stylist**

AuraFit AI is an intelligent wardrobe management and outfit recommendation platform that helps users organize their clothing and generate personalized outfit suggestions using AI.

Instead of relying on simple filters, AuraFit AI uses a custom **Fashion Brain** that evaluates clothing compatibility, weather, occasions, style, colors, and wardrobe history to recommend the best outfit.

---

## ✨ Features

### 👤 User Authentication

- Secure Signup & Login
- JWT Authentication
- User-specific wardrobes
- Protected routes

---

### 👕 AI Wardrobe Management

- Upload clothing images
- AI-powered clothing metadata extraction
- Automatic category detection
- Color detection
- Pattern detection
- Fabric detection
- Brand extraction
- Manual editing support

---

### 🧠 Fashion Brain V2

AuraFit uses a custom scoring-based recommendation engine instead of simple rule-based filtering.

The Fashion Brain evaluates:

- Occasion compatibility
- Weather suitability
- Color harmony
- Pattern compatibility
- Fabric suitability
- Style compatibility
- Clothing balance
- Accessory compatibility

and selects the highest-scoring outfit.

---

### 🔄 Intelligent Outfit Regeneration

Users can regenerate:

- Top
- Bottom
- Shoes
- Accessories
- Outerwear

without changing the remaining outfit.

The Fashion Brain recalculates compatibility before replacing any clothing item.

---

### 🌦 Weather Intelligence

- Automatic weather detection
- Manual weather override
- Destination weather support
- Weather-aware outfit recommendations

---

### 📅 Weekly Planner

- Save generated outfits
- Add outfits directly to Weekly Planner
- Outfit History
- Smart Planner workflow

---

### 🧍 AI Avatar Preview

- AI Mannequin Preview
- Modular architecture for future virtual try-on
- Ready for clothing overlay integration

---

### 🧠 Personal Stylist Memory

AuraFit remembers recently generated outfits to reduce repetitive recommendations and improve wardrobe variety.

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### AI

- Google Gemini
- Custom Fashion Brain
- AI Metadata Extraction

### Authentication

- JWT
- bcrypt

### Media Storage

- Cloudinary

---

## 🏗 Architecture

```text
React Frontend
        │
        ▼
Express REST API
        │
        ▼
Authentication Layer
        │
        ▼
AI Metadata Extraction
        │
        ▼
Fashion Brain V2
        │
        ▼
Compatibility Engine
        │
        ▼
Weather Intelligence
        │
        ▼
Outfit Generator
        │
        ▼
Weekly Planner
        │
        ▼
MongoDB
```

---

## 📸 Screenshots

> *(Add screenshots here)*

- Login
- Dashboard
- Wardrobe
- Generate Outfit
- Outfit Preview
- AI Avatar
- Weekly Planner
- Outfit History

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/vrinda-oberoi/AuraFit-AI.git
```

### Frontend

```bash
cd AuraFit
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## 📌 Future Enhancements

- AI Stylist Explanations
- Closet Analytics
- Packing Assistant
- Shopping Recommendations
- React Native Mobile App
- Virtual Try-On
- AI Learning System

---

## 👩‍💻 Author

**Vrinda Oberoi**

If you found this project interesting, feel free to ⭐ the repository.
