🐾 Pawdentify
AI-Powered Dog Breed Detection & Smart Pet Care Platform

<img width="1920" height="1032" alt="Screenshot 2025-12-26 173517" src="https://github.com/user-attachments/assets/ff2f6322-d8f9-401b-a6a3-6ecb94740c8f" />

📌 Internship Context

Pawdentify is developed as the Final Project for the Infosys Springboard Internship (Artificial Intelligence).
The objective of this project is to design an intelligent, user-centric platform that combines AI-based dog breed detection with multiple value-added features for dog owners, adopters, and pet enthusiasts — all in a single ecosystem.

❓ Problem Statement

Identifying a dog’s breed from an image is challenging, especially when multiple breeds have similar physical characteristics.
Additionally, there is no single integrated platform that provides:

Breed identification

Personalized pet guidance

Community interaction

Lifestyle-based dog recommendations

Veterinary appointment support

💡 Solution Overview

Pawdentify addresses these challenges using a CNN-based Machine Learning model that analyzes dog images and predicts the breed.
Beyond detection, the platform offers AI assistance, history tracking, community engagement, quizzes, shopping, and vet appointment booking, making it a comprehensive digital companion for dog lovers.

The application is built using React for the frontend, Python for backend and ML, and Firebase for authentication and user management.

🚀 Core & Supporting Features
🐕 1. Dog Breed Scan (Core Feature)

Upload or scan an image of a dog to instantly identify its breed using an AI-powered CNN model.

<img width="1920" height="1032" alt="Screenshot 2025-12-01 223414" src="https://github.com/user-attachments/assets/4ceadf7d-50b3-4162-9d47-6b35b88d25e6" />

🕘 2. Scan History

Keeps track of all previously scanned dogs, allowing users to review past predictions and images.

<img width="1920" height="1032" alt="Screenshot 2025-12-01 223510" src="https://github.com/user-attachments/assets/8258c67b-b076-4dc0-a7d9-1190b6a661c3" />

👤 3. User Profile

Users can manage their personal profile, preferences, and activity within the platform.


<img width="1920" height="1032" alt="Screenshot 2025-12-01 223459" src="https://github.com/user-attachments/assets/aad775de-9186-4103-aa34-7604a39c3c47" />

🤖 4. PawBot – AI Dog Assistant

An AI chatbot that helps users with:

Dog care guidance

Vaccination information

Breed-specific behavior

General dog-related queries

<img width="1920" height="1032" alt="Screenshot 2025-12-01 223432" src="https://github.com/user-attachments/assets/f7a1c0ef-6f74-4138-9330-24bc8041b5e5" />


🌍 5. Community Section

A collaborative space where users can:

Share dog stories

Post adoption requests

Report or help street dogs

Connect with other dog lovers

<img width="1920" height="1032" alt="Screenshot 2025-12-01 223316" src="https://github.com/user-attachments/assets/9384cb39-fbee-4311-99b6-373e7d97351b" />

🛒 6. Pet Shop

Browse and purchase dog-related products such as food, accessories, and care essentials.

<img width="1920" height="1032" alt="Screenshot 2025-12-01 223524" src="https://github.com/user-attachments/assets/0e65e970-8f95-4395-9b87-ac1710a11e9f" />

🧠 7. Dog Suitability Quiz

Designed for users who don’t own a dog yet.
The quiz consists of 14 lifestyle-based questions, such as:

Preferred dog temperament

Activity level

Living space

Time availability

Based on responses, the system suggests the best dog breed match.

<img width="1920" height="1032" alt="Screenshot 2025-12-01 223605" src="https://github.com/user-attachments/assets/b5904e51-5764-4f63-ab65-395a3f4d0bc8" />

🏥 8. Vet Appointment Booking

Allows users to book vet appointments for their dogs by selecting:

Date

Time

Location

(Currently a basic implementation with scope for future expansion.)

<img width="1920" height="1032" alt="Screenshot 2025-11-28 183420" src="https://github.com/user-attachments/assets/d4a0ed5c-b29f-4119-9585-06ec2a357d46" />

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, Framer Motion

Backend: Python (Flask/FastAPI)

Machine Learning: CNN-based image classification

Authentication: Firebase Authentication

Database: Firebase / Firestore

Deployment: Vercel

Dataset Source: Kaggle

📊 Dataset Information

The dog breed detection model was trained using a publicly available Kaggle dataset.

🔗 Dataset Link:
https://www.kaggle.com/code/midouazerty/dog-breed-identification-using-keras-92-accuracy/input

📁 Project Folder Structure
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # Global state management
│   ├── services/          # API & Firebase services
│   ├── pages/             # Application pages
│
├── firebaseConfig/        # Firebase configuration
│
├── backend/
│   ├── api.py             # Backend API
│   ├── prepare.py         # Dataset preprocessing
│   ├── model_train.py     # Model training script
│   ├── model_test.py      # Model testing
│
├── public/
├── README.md

▶️ How to Run the Project
Backend Setup
pip install -r requirements.txt
python api.py

Frontend Setup
npm install
npm run dev


⚠️ For security reasons, the .env file is not committed to GitHub.

🔮 Future Scope

Advanced Vet Appointment System with doctor profiles

Real-time scheduling and availability

Personalized dog care recommendations

Mobile application support

Performance optimization and scalability

Enhanced AI conversational intelligence

👨‍💻 Author

Rudraprasad Panigrahi
Computer Engineering Student
Infosys Springboard AI Intern
