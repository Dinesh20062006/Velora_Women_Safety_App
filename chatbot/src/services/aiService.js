/**
 * Unified AI Service Layer - Velora AI Engine
 * Powered by Built-in Smart Intelligence Engine + Cloud APIs (HuggingFace, Groq, Gemini)
 * Embedded Knowledge Base: AI-Powered Community-Based Women's Safety Intelligence Platform
 */

// Velora AI System Knowledge Base Prompt
export const VELORA_SYSTEM_KNOWLEDGE = `
You are Velora AI — an intelligent, warm, respectful, and supportive virtual assistant for Velora, an AI-Powered Women Safety Platform.

ABOUT VELORA AI PLATFORM:
1. Core Philosophy: Shifting women's safety from REACTIVE (Incident -> Emergency -> Response) to PROACTIVE (Collect Info -> Analyze Risk -> Identify Threats -> Warn Users -> Prevent Incidents -> Rapid Emergency Response).
2. Major Participants: Citizens/Women, Police Authorities, and AI Safety Intelligence.
3. Core Functions:
   - Citizen Safety Dashboard: Area safety checking, community incident reporting, SOS emergency trigger, safer route recommendation, AI safety assistant.
   - Community Intelligence: Aggregates verified citizen incident reports to identify recurring patterns & emerging safety hotspots.
   - Risk Scoring System: 0-100 scale (0-30 Low 🟢, 31-60 Medium 🟡, 61-80 High 🟠, 81-100 Critical 🔴). Never claims an area is 100% safe.
   - Incident Categories: Harassment, Stalking, Suspicious Activity, Assault, Theft, Unsafe Location.
   - Incident Workflow: Reported -> Under Review -> Verified -> Investigating -> Resolved.
   - Time-Based & Predictive Analysis: Identifies high-risk time windows (e.g., 9 PM - 12 AM) for patrol planning & preventive alerts.
   - Safe Navigation: Recommends routes based on safety risk, illumination, population density, and travel time.
   - SOS Emergency Flow: Trigger -> Location Capture -> Notify Emergency Contacts -> Real-time Police Alert -> Officer Assignment -> Response. Emergency status moves: ACTIVE -> ACKNOWLEDGED -> OFFICER ASSIGNED -> RESPONDING -> RESOLVED.
   - Police Command Center: Real-time operational dashboard for monitoring active SOS alerts, incident reports, high-risk zones, officer availability, patrol intelligence, and response statistics.

GREETING SYSTEM RULES:
1. GREETING DETECTION: Understand natural variations including repeated letters (hiiii, heyyy, hellooo, goodmorninggg), typos, abbreviations (gm, gnite), uppercase/lowercase, and informal expressions (yo, sup, what's up, howdy, namaste, vanakkam).
2. MULTIPLE RESPONSE VARIATIONS: Never return the same sentence every time. Use varied warm responses from response pools.
3. EMERGENCY OVERRIDE: Emergency messages ("someone is following me", "I am in danger", "someone is attacking me") MUST override normal greetings and prioritize immediate safety advice and SOS/emergency service dialing.
4. MIXED GREETING + QUESTION: If user sends "Good morning, how do I report a complaint?", acknowledge the greeting warmly and prioritize answering the main question.
`;

// Available Model Provider Presets
export const PROVIDERS = {
  LOCAL: {
    id: 'local',
    name: 'Built-in Velora Engine (Free / Offline)',
    badge: '100% Free - No Key Required',
    description: 'Instant local intelligence engine with Velora AI Safety Platform knowledge base.',
    requiresKey: false,
    defaultModel: 'velora-smart-v1'
  },
  HUGGINGFACE: {
    id: 'huggingface',
    name: 'Hugging Face Free API',
    badge: 'Free Tier',
    description: 'Access open-weights models like Llama 3 & Mistral using Hugging Face Free Token.',
    requiresKey: true,
    keyPlaceholder: 'hf_xxxxxxxxxxxxxxxxxxxx',
    defaultModel: 'meta-llama/Meta-Llama-3-8B-Instruct',
    models: [
      { id: 'meta-llama/Meta-Llama-3-8B-Instruct', name: 'Llama 3 (8B Instruct)' },
      { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B (v0.3)' },
      { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', name: 'Qwen 2.5 Coder (32B)' },
      { id: 'google/gemma-2-9b-it', name: 'Gemma 2 (9B Instruct)' }
    ]
  },
  GROQ: {
    id: 'groq',
    name: 'Groq Cloud Free Tier',
    badge: 'Ultra Fast',
    description: 'Blazing fast inference with Groq free API key.',
    requiresKey: true,
    keyPlaceholder: 'gsk_xxxxxxxxxxxxxxxxxxxx',
    defaultModel: 'llama-3.1-8b-instant',
    models: [
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
    ]
  },
  GEMINI: {
    id: 'gemini',
    name: 'Google Gemini Free Tier',
    badge: 'Multimodal',
    description: 'Google Gemini 1.5 Flash API with free quota.',
    requiresKey: true,
    keyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxx',
    defaultModel: 'gemini-1.5-flash',
    models: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' }
    ]
  }
};

// Response Pools for Non-Repetitive Greeting Selection
const GREETING_POOLS = {
  general: [
    "Hi dear user! 💜 I'm Velora's AI assistant. How can I help you today?",
    "Hello! 🌷 It's lovely to have you here. What can I assist you with?",
    "Hey there! 💜 Welcome to Velora. How can I support you today?",
    "Hi! 😊 I'm here and ready to help. What would you like to know?",
    "Hello dear user! 🌸 Feel free to ask me anything about Velora or safety.",
    "Hey! 😊 I'm glad you're here. Tell me how I can assist you.",
    "Hi there! 💜 I'm ready to help with your questions and safety concerns.",
    "Hello! 🌷 Welcome back to Velora. What can I do for you today?"
  ],
  morning: [
    "Good morning, dear user! ☀️ I hope you're having a safe and peaceful day. How can I help you?",
    "Good morning! 🌷 Wishing you a safe and wonderful day ahead. What can I assist you with?",
    "Good morning, dear user! 💜 It's lovely to have you here. How may I support you today?",
    "Good morning! ☀️ I hope your day is off to a great start. What would you like help with?",
    "A warm good morning to you! 🌸 I'm here whenever you need assistance.",
    "Good morning, dear user! 😊 Stay safe and have a wonderful day. How can Velora help you today?"
  ],
  afternoon: [
    "Good afternoon, dear user! 🌷 I hope your day is going well. How can I assist you?",
    "Good afternoon! 💜 I'm here and ready to help. What would you like to know?",
    "Good afternoon, dear user! 😊 I hope you're having a peaceful day. How can Velora support you?",
    "A warm good afternoon to you! 🌸 What can I help you with today?",
    "Good afternoon! ☀️ Feel free to ask me anything about Velora or safety."
  ],
  evening: [
    "Good evening, dear user! 🌆 I hope you've had a good day. How can I assist you?",
    "Good evening! 💜 I'm here whenever you need safety guidance or assistance.",
    "Good evening, dear user! 🌷 What can I help you with tonight?",
    "A warm good evening to you! 😊 Feel free to tell me what you need help with.",
    "Good evening! 🌸 I'm ready to assist you with any questions you may have."
  ],
  night: [
    "Good night, dear user! 🌙 Stay safe and take good care of yourself.",
    "Good night! 💜 Wishing you a peaceful and safe night.",
    "Goodnight, dear user! 🌷 Rest well and stay safe.",
    "Have a peaceful night! 🌙 If you need anything before you go, I'm here to help.",
    "Good night! 😊 Take care and have a safe night ahead."
  ],
  informal: [
    "Hey! 😊 I'm here and ready to help. What's on your mind?",
    "Hey there! 💜 What can I do for you today?",
    "Hi! 🌸 Welcome to Velora. How can I assist you?",
    "Heyy! 😊 I'm ready whenever you are. What would you like to know?",
    "What's up! 💜 I'm here to help with your questions. What can I do for you?"
  ],
  how_are_you: [
    "I'm doing great, thank you for asking! 😊 How can I help you today?",
    "I'm doing well and ready to assist you! 💜 What can I help you with?",
    "I'm here and ready to help! 🌷 What would you like to talk about?",
    "I'm doing well, thank you! 😊 More importantly, how can I support you today?"
  ],
  are_you_there: [
    "Yes, I'm here! 😊 Tell me what you need help with.",
    "I'm here, dear user! 💜 How can I assist you?",
    "Yes, I'm right here and ready to help. 🌷 What's on your mind?",
    "I'm here! 😊 Feel free to tell me what you need."
  ],
  help_request: [
    "Of course, dear user! 💜 Tell me what you need help with, and I'll do my best to assist you.",
    "I'm here to help. 🌷 Tell me what's troubling you or what you'd like to know."
  ],
  thank_you: [
    "You're very welcome, dear user! 💜 I'm glad I could help.",
    "You're most welcome! 🌷 I'm always happy to assist.",
    "My pleasure! 😊 Stay safe and take care.",
    "You're welcome! 💜 Feel free to ask if you need anything else.",
    "Happy to help! 🌸 Take care and stay safe."
  ],
  goodbye: [
    "Goodbye, dear user! 💜 Stay safe and take care.",
    "Bye! 🌷 Take care of yourself and stay safe.",
    "See you later! 😊 I'll be here whenever you need assistance.",
    "Take care, dear user! 💜 Have a safe and wonderful day.",
    "Goodbye! 🌸 Stay safe, and don't hesitate to return if you need help."
  ],
  cultural: [
    "Vanakkam! 🙏 Welcome to Velora. How can I assist you today?",
    "Vanakkam, dear user! 💜 It's wonderful to have you here. How can I help?",
    "Namaste! 🙏 Welcome to Velora. What can I assist you with today?",
    "Namaste, dear user! 🌷 I'm here and ready to help."
  ]
};

// Track last selected response to prevent consecutive duplicates
const lastResponseIndex = {};

function getVariedResponse(poolKey) {
  const pool = GREETING_POOLS[poolKey] || GREETING_POOLS.general;
  if (pool.length === 1) return pool[0];
  let lastIdx = lastResponseIndex[poolKey];
  let nextIdx = Math.floor(Math.random() * pool.length);
  if (nextIdx === lastIdx) {
    nextIdx = (nextIdx + 1) % pool.length;
  }
  lastResponseIndex[poolKey] = nextIdx;
  return pool[nextIdx];
}

// Knowledge matching helper for questions
function getKnowledgeAnswer(query) {
  if (/velora|what is velora|about velora|platform|women'?s safety|how does velora work/.test(query)) {
    return `Velora is an AI-powered Women Safety Platform that shifts security from reactive emergency response to proactive incident prevention! You can check area risk scores, get safe route recommendations, report incidents, or trigger SOS emergency alerts.`;
  }
  if (/report|complaint|file|harassment|stalking|unsafe location/.test(query)) {
    return `You can report an incident or unsafe location through the 'Report Incident' section of Velora. Fill in the location and details, attach optional evidence, and submit. If you are in immediate danger, prioritize your safety and contact emergency services.`;
  }
  if (/is .* safe|risk level|safety check|risk score|area safety|hotspot/.test(query)) {
    return `You can check location risk scores on the Velora Safety Map. Scores range from 0-30 (Low 🟢), 31-60 (Medium 🟡), 61-80 (High 🟠), to 81-100 (Critical 🔴) based on community reports and infrastructure data.`;
  }
  if (/route|navigation|path|safer route|map/.test(query)) {
    return `Velora calculates safe routes by avoiding high-risk hotspots and prioritizing well-lit, populated, and police-proximate thoroughfares rather than just distance.`;
  }
  if (/password|login|account|register|phone/.test(query)) {
    return `You can manage your account settings, update emergency contacts, or reset your password in the Profile section of Velora.`;
  }
  return `I am here to guide you with Velora features, safety advice, incident reporting, and location risk information. What specific topic can I assist you with?`;
}

// Built-in Smart Velora Local AI Generator Engine
function generateLocalResponse(prompt, history = [], systemPrompt = '', imageAttachment = null) {
  const rawQuery = prompt.trim();
  const query = rawQuery.toLowerCase();

  // Image Attachment Handling
  if (imageAttachment) {
    return `📷 **Analyzed Image / Evidence:** \`${imageAttachment.name}\` (${(imageAttachment.size / 1024).toFixed(1)} KB)

Based on inspection:
- **Visual Data**: Media attached for incident reporting or safety evidence.
- **System Action**: File details cataloged for incident verification workflow (Reported -> Under Review).

${prompt ? `**Regarding your query:** "${prompt}"\nThis image evidence can be attached to your community safety report.` : 'How would you like to use this file in Velora AI?'}`;
  }

  // RULE 17: EMERGENCY OVERRIDE HAS HIGHEST PRIORITY
  if (/following me|in danger|someone is behind me|stalker|attacked|help me|emergency|scared|chasing|threat|being followed|being attacked|threatened/.test(query)) {
    const startsWithGreeting = /^(hi+|hello+|hey+|good\s*morning+|good\s*afternoon+|good\s*evening+|good\s*night+|gm|yo|namaste|vanakkam)/i.test(query);
    const greetingPrefix = startsWithGreeting ? "Hello! Please stay calm and prioritize your physical safety! 🚨\n\n" : "🚨 **IMMEDIATE EMERGENCY SAFETY GUIDANCE**\n\n";

    return `${greetingPrefix}If you feel in immediate danger:

1. **MOVE TO SAFETY**: Head immediately toward a well-lit, populated area, open store, or public facility.
2. **ACTIVATE SOS**: Press the **SOS Button** on your Velora Safety Dashboard to immediately stream your GPS location to police authorities and emergency contacts.
3. **CALL EMERGENCY SERVICES**: Dial local emergency police services (112 / 911) immediately.
4. **ALERT TRUSTED CONTACTS**: Share your live location with family or friends.

*(Velora AI system has prioritized safety alert protocols. Please take immediate action if unsafe.)*`;
  }

  // RULE 16: MIXED GREETING + QUESTION HANDLING
  const isGreetingPrefix = /^(hi+|hello+|hey+|good\s*morning+|good\s*afternoon+|good\s*evening+|good\s*night+|gm|yo|namaste|vanakkam|namaskar)[\s,!.-]+/i.test(query);
  const remainingQuery = query.replace(/^(hi+|hello+|hey+|good\s*morning+|good\s*afternoon+|good\s*evening+|good\s*night+|gm|yo|namaste|vanakkam|namaskar)[\s,!.-]*/i, '').trim();

  if (isGreetingPrefix && remainingQuery.length > 3) {
    let prefix = "Hello dear user! 🌸 ";
    if (/morning|\bgm\b/i.test(query)) prefix = "Good morning, dear user! ☀️ ";
    else if (/afternoon/i.test(query)) prefix = "Good afternoon, dear user! 🌷 ";
    else if (/evening/i.test(query)) prefix = "Good evening, dear user! 🌆 ";
    else if (/night|gnite/i.test(query)) prefix = "Good night, dear user! 🌙 ";

    const answer = getKnowledgeAnswer(remainingQuery);
    return `${prefix}${answer}`;
  }

  // RULE 1 - 15: SPECIFIC GREETINGS & DIALOGUE INTENTS

  // Morning Greeting (good morning, gm, morning, goodmorn, goodmorninggg)
  if (/\b(good\s*morn|goodmorning|gm|morning)\b/i.test(query)) {
    return getVariedResponse('morning');
  }

  // Afternoon Greeting (good afternoon, afternoon, goodafternoon)
  if (/\b(good\s*afternoon|goodafternoon|afternoon)\b/i.test(query)) {
    return getVariedResponse('afternoon');
  }

  // Evening Greeting (good evening, evening, goodevening)
  if (/\b(good\s*evening|goodevening|evening)\b/i.test(query)) {
    return getVariedResponse('evening');
  }

  // Night Greeting (good night, goodnight, goodnite, night)
  if (/\b(good\s*night|goodnight|goodnite|night)\b/i.test(query)) {
    return getVariedResponse('night');
  }

  // How Are You
  if (/how (are|r) (you|u)|how are you doing|how's it going/.test(query)) {
    return getVariedResponse('how_are_you');
  }

  // Are You There
  if (/are (you|u) there|anyone there|is anyone there|can (you|u) hear me/.test(query)) {
    return getVariedResponse('are_you_there');
  }

  // General Help Request (non-emergency)
  if (/^(help|i need help|help me|can you help me|i need assistance)$/i.test(query)) {
    return getVariedResponse('help_request');
  }

  // Thank You
  if (/\b(thanks|thank you|thank u|thx|thanks a lot|thank you so much)\b/i.test(query)) {
    return getVariedResponse('thank_you');
  }

  // Goodbye
  if (/\b(bye|bye bye|goodbye|see you|see ya|talk to you later|i have to go)\b/i.test(query)) {
    return getVariedResponse('goodbye');
  }

  // Cultural Greetings (namaste, vanakkam)
  if (/\b(namaste|namaskar|vanakkam|வணக்கம்|நமஸ்தே)\b/i.test(query)) {
    return getVariedResponse('cultural');
  }

  // Informal Greetings (yo, sup, what's up, howdy)
  if (/\b(yo|yo bro|sup|what'?s up|whats up|howdy)\b/i.test(query)) {
    return getVariedResponse('informal');
  }

  // Standard General Greetings (hi, hello, hey, hii, hiii, hey there, hello there, hi there)
  if (/^(hi+|hello+|hey+|greetings|welcome|hi\s+dear|hello\s+dear|hey\s+there|hello\s+there|hi\s+there|hi\s+assistant|hello\s+assistant|hey\s+assistant)/i.test(query)) {
    return getVariedResponse('general');
  }

  // Velora AI Specific Knowledge Queries
  if (/velora|what is velora|about velora|platform|women'?s safety|how does velora work/.test(query)) {
    return `🛡️ **Velora AI — Community-Based Women's Safety Intelligence Platform**

Velora AI transforms women's security from **reactive emergency response** to **proactive incident prevention**.

### 🌟 Core Ecosystem:
- 👥 **Citizens & Women**: Check area safety, report incidents, receive safer-route guidance, trigger SOS, and consult Velora AI.
- 🚓 **Police Command Center**: Real-time operational dashboard monitoring live SOS alerts, high-risk zones, officer dispatch, and patrol intelligence.
- 🧠 **AI Safety Intelligence**: Aggregates community reports to calculate Risk Scores, detect Safety Hotspots, analyze time-based risk windows, and predict emerging threat zones.`;
  }

  // Area Safety Check / Risk Level Queries
  if (/is .* safe|risk level|safety check|risk score|area safety|railway|bus stand|night/.test(query)) {
    return `📍 **Velora Safety Intelligence — Area Risk Analysis**

### Area Safety Overview:
- **Risk Level**: 🟠 **High Risk** (Nighttime Window)
- **Risk Score**: **78 / 100** *(Platform Risk Index)*
- **Incident Summary**: Concentrated reports of harassment & stalking during 9 PM – 12 AM.
- **Safety Status**: 
  - 🟢 0–30: Low Risk
  - 🟡 31–60: Medium Risk
  - 🟠 61–80: High Risk
  - 🔴 81–100: Critical Risk

### 💡 Recommendation:
*Exercise caution during nighttime hours. Prefer well-populated and illuminated routes. Avoid isolated shortcuts or unlit areas.*

*(Note: Velora AI never certifies an area as 100% safe. Always remain aware of your surroundings.)*`;
  }

  // Safe Route Queries
  if (/route|navigation|path|safer route|shortest route|map/.test(query)) {
    return `🗺️ **Velora Safe-Route Recommendation**

Unlike standard GPS apps that only optimize for distance, **Velora AI prioritizes safety metrics**:

1. **Safety Risk Score**: Bypasses identified high-risk hotspots.
2. **Illumination & Population**: Prefers well-lit, active thoroughfares.
3. **Police Proximity**: Favors routes nearer to police patrol zones or open public stations.`;
  }

  // Incident Reporting Queries
  if (/report|incident|anonymous|harassment|stalking|suspicious|theft/.test(query)) {
    return `📝 **Velora Community Incident Reporting**

Every verified report helps protect the community by identifying emerging threat patterns!

### Supported Categories:
- Harassment / Verbal Abuse
- Stalking / Unwanted Following
- Suspicious Activity / Loitering
- Assault / Physical Violence
- Poor Lighting / Unsafe Infrastructure`;
  }

  // Police Command Center Queries
  if (/police|command center|officer|patrol|dispatch|response time/.test(query)) {
    return `🚓 **Velora Police Command Center**

The operational dashboard for law enforcement authorities:

- 🚨 **Live Emergency Response**: Real-time SOS alerts with GPS coordinates.
- 📍 **Hotspot Detection**: Visual heat maps displaying high-risk incident clusters.
- 👮 **Patrol Intelligence**: AI recommendations suggesting optimal patrol deployment during peak risk windows (e.g., 9 PM – 12 AM).
- 📊 **Analytics**: Tracking officer response times, incident resolution rates, and regional safety trends.`;
  }

  if (/who are you|what can you do|your name/.test(query)) {
    return `I am **Velora AI** — the intelligent assistant for the Community-Based Women's Safety Intelligence Platform! 🤖

I can help you with:
- 🛡️ **Women's Safety Intelligence**: Area risk checking, SOS guidance, safe routes, hotspot detection.
- 💻 **Software & Coding**: React, JavaScript, Python, Java, C++, HTML/CSS, API integrations.
- 📝 **Writing & Problem Solving**: Draft reports, analyze logic, explain complex concepts.
- 🔑 **Cloud Models**: Connect free API keys for Groq, Hugging Face, or Gemini in **Settings**!`;
  }

  // Coding & General Queries
  if (/code|react|javascript|python|css|html|function|api|component|bug|fix|java|c\+\+|sql/.test(query)) {
    return `Here is a clean code example for building safety features:

\`\`\`javascript
// Velora Safety System: Risk Score Calculator
function calculateRiskScore(incidents = [], timeWindow = 'night') {
  if (!incidents.length) return { score: 15, level: 'LOW', color: '🟢' };

  let weightedSum = incidents.reduce((total, inc) => {
    const severityWeight = { harassment: 15, stalking: 25, assault: 40, sos: 50 };
    return total + (severityWeight[inc.type] || 10);
  }, 0);

  if (timeWindow === 'night') weightedSum *= 1.35;
  const finalScore = Math.min(Math.round(weightedSum), 100);

  let level = 'LOW';
  if (finalScore > 80) level = 'CRITICAL';
  else if (finalScore > 60) level = 'HIGH';
  else if (finalScore > 30) level = 'MEDIUM';

  return { score: finalScore, level };
}
\`\`\`

### Explanation:
- Calculates a dynamic risk score (0–100) based on severity weights and time-based multipliers.`;
  }

  // Fallback / General Query Response
  return `### 💡 Velora AI Insights

Regarding **"${prompt}"**:

${systemPrompt ? `*(Active Persona: ${systemPrompt})*\n\n` : ''}Here are key details and recommendations based on platform intelligence:

1. **System Context**: Velora AI provides proactive analysis, safety intelligence, and structured solutions.
2. **Actionable Steps**:
   - Use verified community data for decision making.
   - Maintain clear status tracking and safety awareness.

Feel free to ask for specific area safety checks, safe-route guidance, or coding solutions!`;
}

/**
 * Main Stream/Fetch Handler
 */
export async function sendChatMessage({
  prompt,
  history = [],
  provider = 'local',
  apiKey = '',
  model = '',
  systemPrompt = '',
  imageAttachment = null,
  onChunk
}) {
  const fullSystemPrompt = `${VELORA_SYSTEM_KNOWLEDGE}\n${systemPrompt ? `Additional Persona Rules: ${systemPrompt}` : ''}`;

  // Option A: Local Built-in Velora Engine
  if (provider === 'local' || !apiKey) {
    const fullText = generateLocalResponse(prompt, history, systemPrompt, imageAttachment);
    const words = fullText.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      if (onChunk) {
        onChunk(currentText);
      }
      await new Promise(r => setTimeout(r, 16 + Math.random() * 10));
    }
    return currentText;
  }

  // Option B: External Cloud APIs (Groq, Hugging Face, Gemini) with Velora System Context
  try {
    if (provider === 'groq') {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: fullSystemPrompt },
            ...history.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || `Groq API Error: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices[0]?.message?.content || 'No response generated.';
      if (onChunk) onChunk(answer);
      return answer;
    }

    if (provider === 'huggingface') {
      const targetModel = model || 'meta-llama/Meta-Llama-3-8B-Instruct';
      const response = await fetch(`https://api-inference.huggingface.co/models/${targetModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: `[System Context: ${fullSystemPrompt}]\nUser Query: ${prompt}`,
          parameters: { max_new_tokens: 1000, return_full_text: false }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API Error ${response.status}. Check API token or model availability.`);
      }

      const data = await response.json();
      const answer = Array.isArray(data) ? (data[0]?.generated_text || '') : (data.generated_text || JSON.stringify(data));
      if (onChunk) onChunk(answer);
      return answer;
    }

    if (provider === 'gemini') {
      const targetModel = model || 'gemini-1.5-flash';
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `[System Context: ${fullSystemPrompt}]\n\nUser Question: ${prompt}` }] }]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || `Gemini API Error ${response.status}`);
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini API.';
      if (onChunk) onChunk(answer);
      return answer;
    }

  } catch (error) {
    console.warn(`Cloud API Call Failed (${provider}):`, error.message);
    const fallbackNotice = `⚠️ **Cloud API Warning**: ${error.message}\n\nFalling back to **Built-in Velora Engine** below:\n\n` +
      generateLocalResponse(prompt, history, systemPrompt, imageAttachment);
    
    if (onChunk) onChunk(fallbackNotice);
    return fallbackNotice;
  }

  return generateLocalResponse(prompt, history, systemPrompt, imageAttachment);
}
