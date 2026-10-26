# AI-Based Crime Investigation & Suspect Identification System Using Deep Learning

A modern full-stack forensic intelligence platform designed for automated suspect identification across live video surveillance streams and uploaded CCTV media. Built using a decoupled architecture combining a **Django 5 REST API** with a **React 19 Single Page Application (HUD theme)**.

---

## Key Features

- **Surveillance Video Face Recognition:** Real-time facial identification across live camera feeds and pre-recorded CCTV footage (MP4, AVI, MOV).
- **Deep Learning Biometric Pipeline:** Inception-ResNet-v1 (FaceNet) extracting 512-dimensional L2-normalized feature vectors matched via cosine distance aggregation.
- **Dual Localization & Quality Gate:** MTCNN with affine eye-alignment rotation (`|theta| <= 30 deg`) and Laplacian variance sharpness filtering.
- **Anti-Spoofing & Temporal Filtering:** Frame-difference motion liveness evaluation (`cv2.absdiff() >= 1.8`) and 7-frame rolling consensus voting (requiring 4 hits) to eliminate false positives.
- **Investigation Telemetry HUD:** Real-time hardware health metrics, activity radar scores, and automated incident alert logging with captured scene snapshots.
- **Evidence Dossier Generation:** Instant export of timestamped forensic match reports to CSV and printable PDF formats.
- **Administrative Command Center:** Multi-role session access control with dynamic embedding retraining.

---

## Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.11, Django 5.2, Django REST Framework, WhiteNoise, Gunicorn |
| **Frontend** | React 19, Vite 7, React Router 7, React Icons, Vanilla CSS |
| **AI / Computer Vision** | TensorFlow 2.20, Keras-FaceNet, MTCNN, OpenCV (cv2), NumPy, SciPy |
| **Database** | SQLite 3 (Development) / PostgreSQL compatible (`psycopg`) |

---

## System Architecture

```
[ Camera / CCTV Video / Image ]
               │
               ▼
   [ MTCNN Face Localization ]
               │
               ▼
 [ Affine Eye Alignment & Quality Gate ]
               │
               ▼
 [ Inception-ResNet-v1 (512-D Embedding) ]
               │
               ▼
[ Cosine Distance vs. Enrolled Templates ]
               │
               ▼
 [ Temporal Voting Window (4/7 Frames) ]
               │
               ▼
[ Django REST API -> React 19 Cyberpunk HUD ]
```

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js v18+ & npm

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>/crime_project

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r crime_project/requirements.txt

# Run migrations and start server
set DJANGO_DEBUG=True  # On Windows PowerShell: $env:DJANGO_DEBUG="True"
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Setup
```bash
# In a separate terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` to access the application.

---

## Security & Privacy Notice
This repository contains application logic, model encoders, and configuration templates. In compliance with data protection principles, private surveillance footage, personal facial datasets, and local database records are excluded from public version control.
