function generateFallbackRoadmap({ jobTitle, missingKeywords = [], matchScore = 70, atsScore = 75 }) {
  const role = jobTitle || 'Target Position';
  const topGaps = missingKeywords.slice(0, 5);
  const gapsList = topGaps.length > 0 ? topGaps.join(', ') : 'key domain skills';

  return {
    targetRole: role,
    summary: `Personalized skill progression plan for ${role}. Your match score is currently ${matchScore}%. Focus on mastering missing requirements (${gapsList}) to achieve top-tier candidate alignment.`,
    estimatedTimeframe: '4-6 Weeks',
    phases: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Core Skill & Keyword Mastery',
        duration: '1-2 Weeks',
        focusArea: 'Fundamental Requirements',
        actionItems: [
          `Study and practice core missing skills: ${gapsList}`,
          `Complete hands-on tutorials or documentation for ${topGaps[0] || 'target technologies'}`,
          'Build small standalone exercises to demonstrate proficiency in missing keywords'
        ],
        recommendedResources: topGaps.length > 0 ? topGaps.slice(0, 3) : ['Official Documentation', 'LeetCode', 'Udemy']
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Portfolio & Practical Application',
        duration: '2 Weeks',
        focusArea: 'Hands-on Projects',
        actionItems: [
          `Build an end-to-end project incorporating ${topGaps[0] || 'target stack'} and ${topGaps[1] || 'modern tools'}`,
          'Publish clean code on GitHub with comprehensive README documentation',
          'Deploy application live (Vercel/Render) for inclusion in resume portfolio'
        ],
        recommendedResources: ['GitHub', 'Vercel / Render', 'System Architecture Docs']
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Resume & ATS Optimization',
        duration: '1 Week',
        focusArea: 'ATS Scoring & Formatting',
        actionItems: [
          `Integrate missing keywords (${gapsList}) naturally into experience bullet points`,
          'Quantify achievements with metrics (e.g., "Reduced load times by 40%")',
          `Current ATS score is ${atsScore}%. Reformat section headers to optimize ATS parsing`
        ],
        recommendedResources: ['ATS Best Practices', 'STAR Method Guide']
      },
      {
        phaseNumber: 4,
        title: 'Phase 4: Targeted Technical Interview Prep',
        duration: '1 Week',
        focusArea: 'Interview Readiness',
        actionItems: [
          `Practice technical interview questions focused on ${role} requirements`,
          'Prepare STAR stories highlighting past problem-solving and project impact',
          'Review system design concepts and core algorithms'
        ],
        recommendedResources: ['System Design Primer', 'Tech Interview Handbook']
      }
    ]
  };
}

async function getAIRoadmap({ resumeText, jobDescription, matchScore, missingKeywords, atsScore, jobTitle }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ ANTHROPIC_API_KEY is not set in process.env - using tailored roadmap generator');
    return { roadmap: generateFallbackRoadmap({ jobTitle, missingKeywords, matchScore, atsScore }), error: null };
  }

  const prompt = `You are an elite Tech Career Strategist & Talent Development Coach. Analyze this candidate's uploaded resume text against the target job description, identify critical skill & experience gaps, and generate a concrete, step-by-step career improvement roadmap.

TARGET JOB TITLE: ${jobTitle || 'Target Position'}

RESUME TEXT (EXTRACTED FROM UPLOADED DOCUMENT):
${resumeText.slice(0, 2500)}

JOB DESCRIPTION:
${jobDescription.slice(0, 1500)}

ANALYSIS METRICS:
- Match Score: ${matchScore}%
- ATS Score: ${atsScore}%
- Missing Keywords/Skills: ${missingKeywords.slice(0, 12).join(', ')}

Generate a phased 4-stage roadmap formatted EXACTLY as a JSON object with this schema:
{
  "targetRole": "${jobTitle || 'Target Role'}",
  "summary": "Concise summary (2-3 sentences) evaluating the gap between candidate background and job requirements, and outlining the strategy.",
  "estimatedTimeframe": "e.g. 4-6 Weeks",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase 1: Bridge Immediate Skill & Keyword Gaps",
      "duration": "1-2 Weeks",
      "focusArea": "Core Skills & Knowledge",
      "actionItems": [
        "Specific actionable task 1 tailored to resume vs JD",
        "Specific actionable task 2 tailored to missing keywords",
        "Specific actionable task 3"
      ],
      "recommendedResources": ["Skill/Topic 1", "Skill/Topic 2", "Certification/Tool"]
    },
    {
      "phaseNumber": 2,
      "title": "Phase 2: Project & Practical Portfolio Enhancements",
      "duration": "2 Weeks",
      "focusArea": "Hands-on Experience & Projects",
      "actionItems": [
        "Specific project idea or feature to build that directly demonstrates JD requirements",
        "Specific github repository or live demo recommendation"
      ],
      "recommendedResources": ["Framework/Library", "Deployment Platform"]
    },
    {
      "phaseNumber": 3,
      "title": "Phase 3: Resume & Professional Brand Refinement",
      "duration": "1 Week",
      "focusArea": "ATS & Impact Metrics",
      "actionItems": [
        "Specific bullet point rewrite recommendation with metrics",
        "ATS formatting and keyword placement advice"
      ],
      "recommendedResources": ["ATS Best Practices", "Impact Verbs"]
    },
    {
      "phaseNumber": 4,
      "title": "Phase 4: Targeted Interview & Technical Readiness",
      "duration": "1 Week",
      "focusArea": "Interview Prep & System Design",
      "actionItems": [
        "Key technical topics or questions likely asked in this specific role",
        "Behavioral STAR stories to prepare based on past experience"
      ],
      "recommendedResources": ["Interview Topics", "System Design"]
    }
  ]
}

Return ONLY the raw JSON object. Do not include markdown code fences or conversational text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Anthropic API error (${response.status}):`, errText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text || '{}';

    // Clean and parse JSON
    const clean = text.replace(/```json|```/g, '').trim();
    const roadmap = JSON.parse(clean);

    return { roadmap, error: null };
  } catch (err) {
    console.error('AI Roadmap error:', err.message, '- using tailored fallback roadmap');
    return { roadmap: generateFallbackRoadmap({ jobTitle, missingKeywords, matchScore, atsScore }), error: null };
  }
}

module.exports = { getAIRoadmap };

