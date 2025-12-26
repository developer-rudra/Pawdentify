# Pawdentify App - Setup Guide

This comprehensive setup guide will walk you through installing and configuring the Pawdentify application on your local development environment.

## 📋 System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: Version 2.25.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space

### Recommended Development Environment
- **VS Code** with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Firebase
  - React Extension Pack

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd pawdentify-app/paw-front

# Verify you're in the correct directory
pwd
# Should show: .../pawdentify-app/paw-front
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Output**: Should show all dependencies installed without errors.

### Step 3: Firebase Project Setup

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `pawdentify-app`
4. Enable Google Analytics (optional but recommended)
5. Choose Google Analytics account
6. Click "Create project"

#### 3.2 Enable Required Services

**Authentication:**
1. Go to Authentication → Get started
2. Go to Sign-in method tab
3. Enable "Email/Password" and "Google" providers

**Firestore Database:**
1. Go to Firestore Database → Create database
2. Choose "Start in test mode" (for development)
3. Select a location (choose the closest to your users)

**Storage:**
1. Go to Storage → Get started
2. Choose "Start in test mode"
3. Select the same location as Firestore

#### 3.3 Get Firebase Configuration

1. Go to Project settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app (</>)
4. Register app with name: `pawdentify-web`
5. Copy the config object (we'll use it in next step)

### Step 4: Configure Environment Variables

Create a `.env` file in the `paw-front` directory:

```bash
# Create environment file
touch .env
```

Add the following content to `.env`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Development settings
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8000
```

**Replace the placeholder values with your actual Firebase config.**

### Step 5: Firebase Security Rules

#### Firestore Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Pet profiles - users can manage their own pets
    match /pets/{petId} {
      allow read, write: if request.auth != null &&
        resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Scan history - users can manage their own scans
    match /scanHistory/{scanId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Community posts - authenticated users can read/write
    match /communityPosts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.authorId;
      allow create: if request.auth != null;
    }

    // Appointments - users can manage their own appointments
    match /appointments/{appointmentId} {
      allow read, write: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         resource.data.vetId == request.auth.uid);
      allow create: if request.auth != null;
    }

    // Vet profiles - vets can manage their own profiles
    match /vetProfiles/{vetId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == vetId;
      allow create: if request.auth != null;
    }
  }
}
```

#### Storage Rules (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /profile-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Pet images
    match /pet-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Scan images
    match /scan-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Community post images
    match /community-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Step 6: Start Development Server

```bash
# Start the development server
npm run dev

# Expected output:
# VITE v5.4.21 ready in XXX ms
# ➜ Local:   http://localhost:5173/
# ➜ Network: http://192.168.x.x:5173/
# ➜ press h + enter to show help
```

### Step 7: Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the Pawdentify welcome screen
3. Try creating a test account
4. Verify Firebase authentication works

## 🔧 Troubleshooting Common Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Firebase connection errors

**Solutions:**
1. Verify `.env` file exists and has correct values
2. Check Firebase project is not in "locked" state
3. Ensure Firestore and Storage are enabled
4. Verify security rules are deployed

### Issue: Vite cache issues (Windows/OneDrive)

**Solution:**
```powershell
# In PowerShell (Windows)
cd paw-front
Remove-Item -Recurse -Force node_modules\.vite
npm install
npm run dev
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process using port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Build errors

**Solution:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint errors
npm run lint

# Clear all caches
rm -rf node_modules/.vite .env.local
npm install
```

## 🧪 Testing the Setup

### Manual Testing Checklist

- [ ] App loads without console errors
- [ ] Welcome screen displays correctly
- [ ] User registration works
- [ ] Login/logout functionality works
- [ ] Navigation between screens works
- [ ] Firebase data is being saved/retrieved
- [ ] No CORS errors in browser console

### Automated Testing

```bash
# Run tests (if implemented)
npm test

# Run build to check for production issues
npm run build
```

## 🚀 Deployment Preparation

### Environment Variables for Production

Create `.env.production`:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_APP_ENV=production
```

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 📞 Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the [Documentation](./README.md)
3. Contact the development team

## 🔄 Updating the Project

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart development server
npm run dev
```

---

**Setup complete! Your Pawdentify development environment is ready.** 🎉
