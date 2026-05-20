# Lead Intake Automation System

A free, local AI automation pipeline that automatically processes 
lead form submissions — from raw input to AI-generated sales summaries.

## What It Does

1. A person submits a Google Form with their contact and project info
2. Google Apps Script cleans the data and marks the row as READY
3. n8n polls Google Sheets every 2 minutes for READY rows
4. Ollama (local AI) generates a 2-3 sentence sales summary of the lead
5. The summary is written back to Google Sheets
6. Status is updated to DONE

## Stack

| Tool | Purpose | Cost |
|---|---|---|
| Google Forms | Lead input | Free |
| Google Sheets | Database | Free |
| Google Apps Script | Data cleaning + validation | Free |
| n8n Community Edition | Workflow orchestration | Free |
| OpenClaw | Local AI agent runtime (Ollama manager) | Free |
| Ollama + Qwen2.5:14b | Local AI model for lead summarization | Free |

**Total cost: $0**

## Architecture
Google Form → Google Sheets → Apps Script (clean + READY)
→ n8n (poll + orchestrate) → Ollama API (AI summary)
→ Google Sheets (write summary + DONE)

## Requirements

- Windows 10/11 with 16GB+ RAM (32GB recommended)
- Node.js v22 or higher
- Google Account
- Ollama installed from https://ollama.com

## Installation

### 1. Install and configure Ollama

```bash
# Pull the AI model (approx. 9GB download)
ollama pull qwen2.5:14b
```

### 2. Install and configure OpenClaw

```bash
npm install -g openclaw@latest
openclaw onboard
# Select: Ollama → Local only → Skip messaging channel
```

### 3. Install and run n8n

```bash
mkdir C:\n8n
cd C:\n8n
npx n8n
# Open http://localhost:5678 in your browser
```

### 4. Set up Google Sheets credential in n8n

- Go to Credentials → Add credential → Google Sheets OAuth2 API
- Create OAuth client ID in Google Cloud Console
- Enable Google Sheets API and Google Drive API
- Add yourself as a test user in OAuth consent screen
- Paste Client ID and Client Secret into n8n and authorize

### 5. Import the n8n workflow

- In n8n, go to Workflows → Import
- Upload `n8n/workflow.json`
- Publish the workflow

### 6. Set up Google Apps Script

- Open your Google Sheet
- Go to Extensions → Apps Script
- Paste the contents of `apps-script/Code.gs`
- Select the `createTrigger` function and click Run
- Authorize the script when prompted

## How to Use

1. Share the Google Form link with potential leads
2. Submissions are automatically processed within 2 minutes
3. View cleaned data and AI summaries in the Google Sheet

## Project Structure
lead-intake-automation/
├── README.md
├── apps-script/
│   └── Code.gs
├── n8n/
│   └── workflow.json
└── screenshots/
├── sheet-structure.png
├── n8n-workflow.png
└── sample-output.png

## Known Limitations

- n8n must be running locally for the workflow to execute
- Ollama must be running for AI summaries to generate
- Processing takes 20-60 seconds per lead (local AI inference)
- No email notifications on new leads (future improvement)
- No error handling if Ollama goes offline during processing
- n8n calls Ollama's REST API directly (port 11434) rather than
  routing through OpenClaw's agent interface, due to n8n's sandbox
  restrictions on shell commands

## What I Learned

- How to design a layered automation architecture
- How to use Google Apps Script for data cleaning and triggers
- How to build n8n workflows with multiple connected nodes
- How to run local AI models with Ollama at zero API cost
- How to install and configure OpenClaw as a local AI agent runtime
- Status-based processing (READY → PROCESSING → DONE) to prevent
  duplicate row processing
- How to debug API endpoints and find correct integration paths
- The difference between free self-hosted tools and paid alternatives

## Built By

Kyle Dela Pena — May 2026