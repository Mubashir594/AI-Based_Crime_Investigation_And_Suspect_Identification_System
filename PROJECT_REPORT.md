# Technical Project Report: AI-Based Crime Investigation & Suspect Identification System

**Target Domain:** Law Enforcement, Surveillance & Forensic Video Analysis  
**Architecture:** Decoupled (Django 5 REST API + React 19 Single Page Application)  
**Developer Profile:** BCA Graduate / Junior DevOps & Full-Stack Engineer  

---

## 1. Project Overview

- **Project Name:** AI-Based Crime Investigation & Suspect Identification System Using Deep Learning
- **Problem Statement:** Manual monitoring of surveillance feeds and retrospective review of CCTV video evidence is labor-intensive, error-prone, and slow during active investigations.
- **Main Objective:** Automate face localization, feature extraction, and identity matching across live camera feeds and uploaded surveillance media, generating instant alerts and audit-ready forensic dossiers.
- **Intended Users:**
  - *Field Investigators / Police Officers:* Authenticate via badge credentials, monitor live streams, upload recorded media, and inspect suspect match alerts.
  - *System Administrators:* Manage investigator credentials, register suspect profiles and dataset mugshots, and trigger model embedding re-indexing.

---

## 2. Confirmed Technology Stack

| Category | Technology | Verified Usage | Relevant Source Path |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | Python 3.11.9, Django 5.2.9 | REST API endpoints, session authentication, ORM database transactions | `crime_project/crime_project/settings.py` |
| **Frontend Framework** | React 19.2.0, Vite 7.3.7 | Responsive Single Page Application (SPA), HUD cybersecurity theme | `frontend/package.json` |
| **Routing & Icons** | React Router DOM 7.11, React Icons 5.5 | Protected route guards (`ProtectedRoute`, `AdminProtectedRoute`), HUD icons | `frontend/src/App.jsx` |
| **Deep Learning** | TensorFlow 2.20.0, Keras-FaceNet 0.3.2 | Inception-ResNet-v1 neural network generating 512-dimensional face embeddings | `crime_project/face_recognition/facenet_encoder.py` |
| **Face Detection & Alignment**| MTCNN 1.0.0, OpenCV (cv2) | Multi-task CNN face detection, 5-point eye alignment via affine rotation | `crime_project/face_recognition/facenet_encoder.py` |
| **Classical Vision & Math** | OpenCV Haar Cascades, LBPH, NumPy, SciPy | Secondary face detector, motion liveness estimation, cosine distance calculation | `crime_project/api/views.py`, `crime_project/api/facenet.py` |
| **Database** | SQLite 3 (`db.sqlite3`) | Persistent relational database storing criminals, logs, users, and evidence | `crime_project/crime_project/settings.py` |
| **Production Tools** | WhiteNoise 6.9, Gunicorn 23.0, psycopg 3.2 | Static file hosting, WSGI application server, PostgreSQL production driver | `crime_project/crime_project/requirements.txt` |

---

## 3. Main Modules and Actual Purpose

1. **Authentication & Access Control (`crime_project/api/auth_views.py`):**  
   Session-based authentication separating Investigator badge logins from Admin staff accounts. Employs PBKDF2 password hashing and automatic role-switch session isolation.
2. **Investigator Operations HUD (`frontend/src/pages/Dashboard.jsx`):**  
   Central operations screen displaying real-time system health, detection telemetry, activity radar intensity scores, and daily crime trend analytics.
3. **Live Camera Surveillance (`frontend/src/pages/WebcamScan.jsx`):**  
   On-demand MJPEG camera streaming (`/api/video-feed/`) with real-time bounding boxes, match confidence overlays, and audio-visual alert triggers.
4. **CCTV & Media Evidence Processor (`frontend/src/pages/VideoUpload.jsx`):**  
   Upload pipeline accepting recorded video formats (MP4, AVI, MOV) and images (JPG, PNG). Samples every 6th frame (up to 600 frames) and applies multi-frame consensus matching.
5. **Criminal Database Explorer (`frontend/src/pages/CriminalDatabase.jsx`):**  
   Searchable and filterable registry of registered criminals, mugshots, aliases, physical descriptions, and mapped `face_label` identity keys.
6. **Forensic Evidence Dossier (`frontend/src/pages/EvidenceReport.jsx`):**  
   Historical event log of all positive detections with timestamped snapshots, exportable to formatted CSV or printable PDF dossier views.
7. **Administrative Command Center (`frontend/src/pages/AdminDashboard.jsx`):**  
   Full administrative CRUD for investigators, criminals, and crime records, with a one-click endpoint (`/api/admin/retrain/`) to regenerate neural embeddings.

---

## 4. AI/ML Implementation Details

- **Face Detection:** Primary detection uses **MTCNN** (`mtcnn.mtcnn.MTCNN`), extracting bounding boxes and eye coordinates. If deep detection yields no candidate, the system falls back to **OpenCV Haar Cascades** (`haarcascade_frontalface_default.xml`).
- **Face Recognition & Alignment:**
  1. *Alignment:* Calculates roll angle between left and right eye coordinates. If $|\theta| \le 30^\circ$, applies an affine rotation (`cv2.warpAffine`) to level the eyes horizontally.
  2. *Quality Gate:* Filters out crops failing brightness thresholds ($40 \le \mu \le 220$) or sharpness limits (Laplacian variance $< 35.0$).
  3. *Embedding Extraction:* Passes aligned $160 \times 160$ RGB crops into **FaceNet** (Inception-ResNet-v1), producing an L2-normalized 512-dimensional vector:
     $$\hat{v} = \frac{v}{\|v\|_2}$$
- **Matching Metric:** Computes cosine distance ($D_{\text{cosine}} = 1.0 - a \cdot b$) against the top-3 templates per registered subject in `facenet_embeddings.pkl`. If distance $< 0.62$ and confidence $\ge 70\%$, a positive candidate is confirmed.
- **Dataset Structure:** `crime_project/dataset/` contains 9 identity classes (`person_001` to `person_009`) with **221 total images** (15–31 photos per class).
- **Anti-Spoofing & Temporal Filtering:**
  - *Motion Liveness:* Frame-difference motion tracking (`cv2.absdiff().mean() >= 1.8`) suppresses static photo spoofing.
  - *Temporal Consensus:* In live video, matches must persist across at least 4 out of 7 consecutive frames (`TEMPORAL_VOTING_WINDOW = 7`, `MIN_HITS = 4`) before creating a database alert.
- **Current AI Limitations:** Heavy video decoding is executed synchronously on the web process; high-resolution multi-stream processing requires GPU acceleration for optimal real-time throughput.

---

## 5. End-to-End Application Workflow

1. **Authentication:** Investigator logs in at `/login` with username and access key. Django verifies PBKDF2 credentials and establishes a session cookie (`sessionid`).
2. **Dashboard Initialization:** React frontend polls `/api/dashboard/status/` and `/api/system-health/` to populate active metrics and hardware health.
3. **Surveillance Execution:**
   - *Option A (Live Camera):* Officer initiates `/webcam`. Backend activates camera feed, runs MTCNN detection, validates motion liveness, and extracts FaceNet embeddings.
   - *Option B (Recorded Media):* Officer uploads evidence file at `/upload`. Backend samples frames every 6 intervals and aggregates temporal hits.
4. **Identification & Alert Logging:** Upon verified candidate detection (confidence $\ge 70\%$), backend records a `RecognitionLog`, creates an `AlertLog`, saves a base64 frame snapshot to `media/alert_snapshots/`, and broadcasts state via `/api/live-scan/`.
5. **Dossier Generation:** Investigator navigates to `/evidence-report` to review timestamped detection logs and exports forensic dossiers via CSV or PDF.

---

## 6. Feature Implementation Status

| Feature | Verified Status | Evidence |
| :--- | :--- | :--- |
| **Investigator & Admin Login** | Implemented & Verified | `crime_project/api/auth_views.py:26` |
| **Role-Based Protected Routes** | Implemented & Verified | `frontend/src/ProtectedRoute.jsx`, `AdminProtectedRoute.jsx` |
| **Biometric HUD Visual Asset** | Implemented & Verified | `frontend/src/components/BiometricFaceScanner.jsx` |
| **Real-Time Webcam MJPEG Feed** | Implemented & Verified | `crime_project/api/webcam_service.py:144` |
| **Temporal Voting Verification** | Implemented & Verified | `crime_project/api/webcam_service.py:253` |
| **Motion Liveness Detection** | Implemented & Verified | `crime_project/api/webcam_service.py:168` |
| **CCTV & Image Upload Analysis** | Implemented & Verified | `crime_project/api/views.py:400` |
| **Suspect Database Browser** | Implemented & Verified | `frontend/src/pages/CriminalDatabase.jsx` |
| **Forensic Dossier Export (PDF/CSV)**| Implemented & Verified | `frontend/src/pages/EvidenceReport.jsx:80-265` |
| **Admin CRUD & Model Retraining** | Implemented & Verified | `crime_project/api/auth_views.py:396` |
| **Pure WebRTC Media Streaming** | Experimental / Incomplete | `crime_project/api/webrtc.py` (SDP handshake only, no video track) |
| **Monolithic Django Templates** | Deprecated / Legacy | Retained in `investigator_module/templates/` (superseded by React) |

---

## 7. Database and Backend Architecture

- **Engine:** SQLite 3 (`crime_project/db.sqlite3`) in development; PostgreSQL (`psycopg[binary]`) configured for production deployment.
- **Core Relational Models (`crime_project/crime_database/models.py`, `investigator_module/models.py`):**
  - `Investigator`: Stores officer full name, badge ID, department, active status, and PBKDF2 hashed password.
  - `Criminal`: Stores name, physical attributes, mugshot (`photo`), crime classification, and unique `face_label`.
  - `CrimeRecord` & `Evidence`: Stores linked incident details, incident dates, crime scenes, and attached digital evidence files.
  - `RecognitionLog`: Logs all face identification events with timestamp and confidence score.
  - `AlertLog`: Stores high-priority alert events with crime severity level, alert message, and captured scene snapshot.
- **Media Persistence:** Uploaded suspect portraits are persisted under `media/criminal_photos/`, match snapshots under `media/alert_snapshots/`, and uploaded videos under `uploaded_videos/`.

---

## 8. Portfolio Information Summary

- **Project Title:** SENTINEL-AI: Automated Biometric Suspect Identification & Forensic Video Investigation System
- **Short Description:** A forensic investigation platform that automates suspect identification across live webcam streams and uploaded CCTV evidence using MTCNN and 512-dimensional FaceNet embeddings. Built on a decoupled architecture featuring a Django REST backend and a React 19 cybersecurity HUD interface.
- **Key Highlights:**
  - *Dual Detection & Quality Gate:* Integrates MTCNN and OpenCV Haar Cascades with automated affine eye alignment and Laplacian sharpness checks.
  - *Anti-Spoofing & Stability:* Incorporates frame-difference motion liveness evaluation and rolling temporal consensus voting to eliminate false positives.
  - *Forensic Reporting:* Automatically persists captured match snapshots and provides instant one-click export of formal forensic dossiers in PDF and CSV formats.
- **Confirmed Tech Stack:** Python, JavaScript, Django, React 19, Vite, TensorFlow, Keras-FaceNet, MTCNN, OpenCV, NumPy, SciPy, SQLite, WhiteNoise, Gunicorn.

---

## 9. Pending Improvements & Next Steps

1. **Asynchronous Background Task Processing:** Transition video file processing from synchronous HTTP handlers (`upload_video_api`) to a background task queue (Celery + Redis) to prevent timeout on large CCTV files.
2. **Vector Database Integration:** Migrate `facenet_embeddings.pkl` to `pgvector` or an embedded vector store to support searching across tens of thousands of suspect records efficiently.
3. **Full WebRTC Track Binding:** Complete the experimental `aiortc` endpoint to deliver low-latency bi-directional video streaming instead of HTTP multipart MJPEG.
4. **Hardware Acceleration:** Implement ONNX Runtime or TensorRT export for FaceNet and MTCNN inference to achieve 60+ FPS on GPU servers.
5. **Automated Test Coverage:** Add automated PyTest unit tests for embedding distance calculations and Cypress end-to-end tests for login and upload workflows.

---

## 10. Confirmation Required from Developer

1. **Production Database Engine:** Is the target production deployment intended to connect to a managed PostgreSQL service via `dj-database-url`, or remain on SQLite?
2. **WebRTC Scope:** Should the experimental WebRTC signaling code (`api/webrtc.py`) be retained and completed, or archived in favor of the current MJPEG stream?
3. **Hardware Target:** Will demonstration benchmarks be conducted on a CPU environment or a dedicated CUDA-enabled GPU?
