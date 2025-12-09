# Deploying Pixsom Website

## Prerequisites
- **VPS** with **Dokploy** installed.
- Access to this repository (GitHub/GitLab).

## Deployment Steps

1. **Push Code**: logical first step. Push this code to your git repository.

2. **Dokploy Configuration**:
   - Go to your Dokploy Dashboard.
   - Create a new **Application**.
   - **Name**: `pixsom-website` (or similar).
   - **Repository**: Select this repository.
   - **Branch**: `main` (or your branch).
   - **Build Path**: `/` (it's in the root of the repo/subfolder). Assuming this `pixsom-web` folder is the root of your *repo*? 
     - *Note*: If this project is inside a subfolder (e.g., `Pixsom_Website_V2/pixsom-web`), you must set the **Work Directory** or **Root Path** in Dokploy to `Pixsom_Website_V2/pixsom-web`.
   - **Docker Context**: Same as Root Path.
   - **Dockerfile Path**: `./Dockerfile`.

3. **Environment Variables**:
   - Keep it simple for now. The Dockerfile sets `NODE_ENV=production`.
   - If you need custom vars, add them in the Dokploy "Environment" tab.

4. **Port**:
   - The app listens on port **3000**.
   - In Dokploy, set the container port to **3000**.

5. **Deploy**:
   - Click **Deploy**.
   - Watch logs to ensure build succeeds.

## Verification
- Visit the Domain you configured in Dokploy.
- Check the background animation on Desktop (mouse) and Mobile (tilt).
