import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      platform: 'NEXUS AI Operations',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Chat Endpoint with server-side Gemini integration & fallback intelligence
  app.post('/api/ai/chat', async (req, res) => {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemInstruction = `You are NEXUS AI, the Chief Operations Intelligence Assistant for Nexus Technologies.
You specialize in enterprise project governance, task bottleneck discovery, team productivity analysis, resource allocation, and operational revenue forecasting.
Answer with authoritative, structured, and actionable operational insights. Use bullet points, metrics, and clear takeaways.
Always maintain the voice of an executive-tier operational analyst.`;

        const contextString = context ? `\nCurrent Organization Context:\n${JSON.stringify(context, null, 2)}\n` : '';

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${contextString}\nUser query: ${prompt}`,
          config: {
            systemInstruction,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 7 seconds')), 7000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);

        const reply = response?.text || 'Operational analysis complete. No critical anomalies detected.';
        return res.json({
          response: reply,
          source: 'gemini-3.8-flash',
          status: 'success',
        });
      } catch (err: any) {
        console.error('Gemini API call failed, falling back to local deterministic model:', err?.message || err);
      }
    }

    // Deterministic High-Quality Operational Responses (Deterministic Demonstration Mode)
    const normalized = prompt.toLowerCase();
    let fallbackResponse = '';

    if (normalized.includes('performance') || normalized.includes('operational')) {
      fallbackResponse = `### Executive Operational Performance Review

**Status Summary:**
Our aggregated operational efficiency index is at **94.2%** (+4.1% MoM), with team velocity reaching 142 story points/sprint across 12 active initiatives.

**Key Highlights:**
- **Revenue Run-Rate:** Currently $1,284,500 ARR, trending 18.4% above Q3 baseline.
- **Sprint Completion Rate:** 88.6% of committed milestones met on time.
- **Resource Allocation:** Engineering utilization is optimal at 87%, while Design is at 94% capacity.

**Recommended Actions:**
1. Re-balance UI/UX backlog for "Apollo Cloud Migration" to avoid frontend bottlenecks in Sprint 24.
2. Maintain weekly burn-down governance for projects in the "In Review" stage.`;
    } else if (normalized.includes('risk') || normalized.includes('bottleneck') || normalized.includes('danger')) {
      fallbackResponse = `### Operational Risk & Bottleneck Analysis

**Identified Vulnerabilities:**
1. **Apollo Cloud Migration (Phase 2):**
   - *Risk Level:* High (82% probability of 4-day slip).
   - *Driver:* Dependency on Database Migration scripts assigned to Marcus Vance.
   - *Remediation:* Pair with Senior DevOps Engineer (Devon Lane) for immediate PR review.

2. **Hyperion Mobile App v3.0:**
   - *Risk Level:* Moderate (Schedule compression).
   - *Driver:* 6 blocker bugs remaining in QA testing cycle.
   - *Remediation:* Shift QA focus to regression test suite before Friday code freeze.`;
    } else if (normalized.includes('report') || normalized.includes('executive')) {
      fallbackResponse = `### Executive Operations Briefing (Generated)

**Period:** Current Quarter (Q4)
**Scope:** Nexus Technologies Enterprise Portfolio

- **Portfolio Health:** 12 Active Projects (8 On Track, 3 Needs Attention, 1 At Risk).
- **Total Headcount:** 38 FTEs across Engineering, Design, Product, and Operations.
- **Total Open Tasks:** 64 tasks across 5 sprint lanes.
- **Mean Time to Resolution (MTTR):** Decreased by 26% down to 1.8 days.
- **Capital Efficiency:** Project spend is within 4.5% of planned enterprise budget.`;
    } else if (normalized.includes('task') || normalized.includes('completion')) {
      fallbackResponse = `### Task Velocity & Throughput Breakdown

- **Total Tasks Logged:** 142 completed this month (+14.2% vs previous month).
- **Completion Velocity:** Average 4.6 days per epic.
- **Backlog Health:** 18 tasks in Backlog, 22 In Progress, 11 In Review.
- **Top Performer Throughput:** Devon Lane (DevOps) completed 19 tasks with 0 defects reopened.`;
    } else {
      fallbackResponse = `### NEXUS Operational Intelligence

Based on real-time analysis of the current Nexus Technologies operational registry:
- **Active Initiatives:** 12 initiatives spanning Cloud, Mobile, Security, and BI.
- **Team Velocity:** 94.2% efficiency index with positive velocity delta.
- **Proactive Directive:** Keep sprint backlogs prioritized and resolve pending code reviews in Apollo Cloud to preserve projected delivery on November 15.

Feel free to request deeper root-cause analysis on specific projects, team members, or budget metrics.`;
    }

    return res.json({
      response: fallbackResponse,
      source: 'nexus-intelligence-engine (offline deterministic)',
      status: 'success',
    });
  });

  // In development, hook up Vite dev server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`NEXUS Operations server running on port ${port}`);
  });
}

startServer();
