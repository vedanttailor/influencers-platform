# Influencer Platform

A full-stack web application that connects **brands, influencers, and managers** to run and manage influencer marketing campaigns efficiently.

This platform allows brands to create campaigns, influencers to promote products on social media, and managers to supervise campaign activities.

---

## 🚀 Features

* Multi-role authentication system
* Campaign creation and management
* Influencer collaboration
* Campaign status tracking
* Admin control panel
* Role-based dashboards

---

## 👥 User Roles

### 1️⃣ Admin

The Admin has full control of the platform.

**Responsibilities**

* Manage all users
* Create and manage Managers
* Monitor campaigns
* Approve or reject influencers
* Platform configuration

---

### 2️⃣ Client (Brand)

Clients are businesses or brands who want to promote their products.

**Features**

* Create marketing campaigns
* Set campaign budget and timeline
* Select influencers
* Track campaign performance
* Manage influencer collaborations

---

### 3️⃣ Manager

Managers are created by the Admin and help manage campaigns.

**Responsibilities**

* Assign influencers to campaigns
* Monitor campaign progress
* Approve or reject influencer applications
* Generate campaign reports

---

### 4️⃣ Influencer

Influencers promote brand campaigns on their social media platforms.

**Activities**

* Apply for campaigns
* Create promotional content
* Post **videos, reels, and posts**
* Promote products on platforms such as:

  * Instagram
  * YouTube
  * Other social media platforms
* Track earnings and collaborations

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* CSS / Global CSS

### Backend

* FastAPI (Python)

### Database

* POSTGRESSQL Database

### Authentication

* JWT Token Based Authentication

---

## 📊 Platform Workflow

1. **Admin creates Managers**
2. **Clients create Campaigns**
3. **Managers assign Influencers**
4. **Influencers create promotional content**
5. **Campaign performance is monitored**

---

## 📂 Project Structure

```
influencer-platform/
│
├── frontend/           # Next.js frontend
│
├── backend/            # FastAPI backend
│
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/influencer-platform.git
```

---

### Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Future Improvements

* Payment integration
* Influencer analytics dashboard
* AI-based influencer recommendations
* Campaign performance insights
* Mobile application
