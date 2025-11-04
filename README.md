# Project Demo

[Sewna Demo.webm](https://github.com/user-attachments/assets/194cccf4-ca12-4cb6-ae5e-0c05e8df1b28)

# Project Setup Guide

## Prerequisites

Before beginning the setup process, ensure the following software is installed on your system:

| Software   | Minimum Version | Purpose                                      |
|-------------|-----------------|----------------------------------------------|
| **Node.js** | 24.5.0+         | JavaScript runtime for both client and server |
| **Git**     | 2.0+            | Version control for cloning the repository   |

## Tech Stack

Frontend: React + Vite, Tailwind CSS

Backend: NodeJS, ExpressJS, Mongoose, MongoDB

Language: Typescript

Database: MongoDB

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/SinghaAnirban005/Sewna.git
cd Sewna
```

## Step 2: Install Dependencies
Install dependencies for all packages. Each package must be installed separately:

Install server dependencies

```bash
cd server
npm install
```

Install client dependencies

```bash
cd ../client/sewna
npm install
```

## Step 3: Configure Environment Variables
Create a .env file inside the server/ directory with the following variables:

```bash
PORT=3000
MONGODB_URI="connection_url_from_mongoDB_cloud"
JINA_API_KEY="your_api_key"
JINA_API_URL="https://api.jina.ai/v1/embeddings"
```
