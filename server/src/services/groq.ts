import Groq from 'groq-sdk';
import {
  GenerateResumeRequest,
  EnhanceBulletRequest,
  WriteSummaryRequest,
  ATSKeywordsRequest,
  ATSAnalysisResponse,
  ResumeData,
} from '../types';

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function createClient(apiKey: string): Groq {
  return new Groq({ apiKey });
}

// ─── System Prompts ───────────────────────────────────────────────────────────
const RESUME_SYSTEM_PROMPT = `You are an expert resume writer and career coach with 15+ years of experience helping candidates land roles at top companies like Google, Microsoft, Amazon, and startups. You specialize in:
- Writing ATS-optimized resumes that pass automated screening
- Crafting compelling bullet points with strong action verbs and quantified results
- Tailoring content for specific roles and industries
- Following modern resume best practices

Always respond with valid JSON only. No markdown, no explanations outside the JSON.`;

const BULLET_SYSTEM_PROMPT = `You are an expert resume writer. Your task is to rewrite resume bullet points to be more impactful using:
1. Strong action verbs (Led, Built, Designed, Optimized, Reduced, Increased, etc.)
2. Quantified results wherever possible (%, $, time saved, scale)
3. STAR format (Situation/Task → Action → Result) compressed into one line
4. ATS-friendly keywords for the role

Respond with JSON only: { "enhanced": "your rewritten bullet point" }`;

// ─── Generate Full Resume ─────────────────────────────────────────────────────
export async function generateResume(
  req: GenerateResumeRequest,
  apiKey: string,
  model = DEFAULT_MODEL
): Promise<Partial<ResumeData>> {
  const client = createClient(apiKey);

  const prompt = `Generate a professional resume for a ${req.level}-level ${req.jobTitle}${req.industry ? ` in the ${req.industry} industry` : ''}.
${req.skills?.length ? `Key skills to include: ${req.skills.join(', ')}` : ''}

Return a JSON object with this exact structure:
{
  "personal": {
    "fullName": "Alex Johnson",
    "email": "alex.johnson@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/alexjohnson",
    "github": "github.com/alexjohnson"
  },
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "id": "exp1",
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "Jan 2022",
      "endDate": "Present",
      "current": true,
      "location": "City, State",
      "bullets": ["Action verb + achievement + result", "..."]
    }
  ],
  "education": [
    {
      "id": "edu1",
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "Aug 2018",
      "endDate": "May 2022",
      "gpa": "3.8",
      "achievements": ["Dean's List", "Relevant coursework: ..."]
    }
  ],
  "skills": [
    { "id": "sk1", "name": "Programming Languages", "skills": ["Python", "TypeScript", "..."] },
    { "id": "sk2", "name": "Frameworks & Tools", "skills": ["React", "Node.js", "..."] }
  ],
  "projects": [
    {
      "id": "proj1",
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["React", "Node.js"],
      "github": "github.com/user/project",
      "bullets": ["Built X which achieved Y", "..."]
    }
  ],
  "certifications": []
}

Make it realistic with ${req.level === 'entry' ? '0-2' : req.level === 'mid' ? '3-6' : '7+'} years of experience. Use real-sounding company names and impactful bullet points.`;

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: RESUME_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

// ─── Enhance Bullet Point ─────────────────────────────────────────────────────
export async function enhanceBullet(
  req: EnhanceBulletRequest,
  apiKey: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const client = createClient(apiKey);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: BULLET_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Role: ${req.role}${req.company ? ` at ${req.company}` : ''}\nOriginal bullet: "${req.bullet}"\n\nRewrite this bullet to be more impactful with quantified results and strong action verbs.`,
      },
    ],
    temperature: 0.6,
    max_tokens: 200,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{"enhanced": ""}';
  const parsed = JSON.parse(content);
  return parsed.enhanced || req.bullet;
}

// ─── Write Professional Summary ───────────────────────────────────────────────
export async function writeSummary(
  req: WriteSummaryRequest,
  apiKey: string,
  model = DEFAULT_MODEL
): Promise<string> {
  const client = createClient(apiKey);

  const expStr = req.experience
    .slice(0, 3)
    .map(e => `${e.position} at ${e.company}`)
    .join(', ');

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: RESUME_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Write a professional resume summary for someone targeting a "${req.targetRole}" role.
Experience: ${expStr}
${req.skills?.length ? `Top skills: ${req.skills.slice(0, 8).join(', ')}` : ''}

Requirements:
- 2-3 sentences maximum
- Lead with years of experience and top value proposition
- Include 2-3 key technical skills naturally
- End with what you bring to the role
- No personal pronouns (no "I", "my", "me")

Respond with JSON: { "summary": "your summary here" }`,
      },
    ],
    temperature: 0.6,
    max_tokens: 300,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{"summary": ""}';
  const parsed = JSON.parse(content);
  return parsed.summary || '';
}

// ─── ATS Keyword Analysis ─────────────────────────────────────────────────────
export async function analyzeATS(
  req: ATSKeywordsRequest,
  apiKey: string,
  model = DEFAULT_MODEL
): Promise<ATSAnalysisResponse> {
  const client = createClient(apiKey);

  const resumeText = JSON.stringify(req.currentResume, null, 2);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: RESUME_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze this resume against the job description and provide ATS optimization feedback.

JOB DESCRIPTION:
${req.jobDescription}

CURRENT RESUME:
${resumeText}

Respond with JSON:
{
  "score": <0-100 ATS match score>,
  "breakdown": [
    { "category": "Keywords Match", "score": <0-30>, "maxScore": 30, "feedback": "..." },
    { "category": "Section Completeness", "score": <0-20>, "maxScore": 20, "feedback": "..." },
    { "category": "Action Verbs", "score": <0-20>, "maxScore": 20, "feedback": "..." },
    { "category": "Quantified Achievements", "score": <0-15>, "maxScore": 15, "feedback": "..." },
    { "category": "Formatting & Length", "score": <0-15>, "maxScore": 15, "feedback": "..." }
  ],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": ["specific actionable suggestion 1", "suggestion 2", ...]
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as ATSAnalysisResponse;
}
