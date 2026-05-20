# Lead Intake Automation System

> Clone this repo to get the pre-built workflow and script.
> Follow the setup instructions to connect it to your own
> Google account and run it locally for free.

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

### 1. Create your Google Sheet and Form

1. Go to https://sheets.google.com and create a new spreadsheet
2. Name it `Lead Intake System`
3. In the **Form Responses 1** sheet, add these headers in row 1:

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Timestamp | Full Name | Email | Company | Message | Status | AI Summary | Processed At |

4. Apply data validation to **F2:F1000** — dropdown with values:
   `READY`, `PROCESSING`, `DONE` — set to reject invalid input
5. Go to **Tools → Create a new form**
6. Name the form `Lead Intake Form`
7. Add 4 required fields:
   - Full Name (short answer)
   - Email Address (short answer)
   - Company Name (short answer)
   - How can we help you? (paragraph)
8. Open the live form link and submit a test entry to confirm
   data flows into the sheet automatically

### 2. Install and configure Ollama

```bash
# Pull the AI model (approx. 9GB download)
ollama pull qwen2.5:14b
```

### 3. Install and configure OpenClaw

```bash
npm install -g openclaw@latest
openclaw onboard
# Select: Ollama → Local only → Skip messaging channel
```

### 4. Install and run n8n

```bash
mkdir C:\n8n
cd C:\n8n
npx n8n
# Open http://localhost:5678 in your browser
```

### 5. Set up Google Sheets credential in n8n

1. Go to Credentials → Add credential → Google Sheets OAuth2 API
2. Create an OAuth client ID in Google Cloud Console
3. Enable Google Sheets API and Google Drive API
4. Add yourself as a test user in the OAuth consent screen
5. Paste Client ID and Client Secret into n8n and authorize

### 6. Import the n8n workflow

1. In n8n, go to Workflows → Import
2. Upload `n8n/workflow.json`
3. Publish the workflow

### 7. Set up Google Apps Script

1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Paste the contents of `apps-script/Code.gs`
4. Select the `createTrigger` function and click Run
5. Authorize the script when prompted

## How to Use

1. Share the Google Form link with potential leads
2. Submissions are automatically processed within 2 minutes
3. View cleaned data and AI summaries in the Google Sheet

## Project Structure
```
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
```
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
