const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY as string;
const JINA_API_KEY = import.meta.env.VITE_JINA_API_KEY as string;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

const SUSTAINABILITY_URLS: Record<string, string> = {
  google: "https://sustainability.google/reports/",
  microsoft: "https://microsoft.com/en-us/sustainability",
  meta: "https://sustainability.fb.com",
  amazon: "https://sustainability.aboutamazon.com",
  aws: "https://sustainability.aboutamazon.com",
  apple: "https://www.apple.com/environment/",
  ibm: "https://www.ibm.com/impact/environment",
  oracle: "https://www.oracle.com/corporate/citizenship/environment/",
};

function getSustainabilityUrl(query: string): string | null {
  const q = query.toLowerCase();
  for (const [key, url] of Object.entries(SUSTAINABILITY_URLS)) {
    if (q.includes(key)) return url;
  }
  return null;
}

async function tavilySearch(query: string): Promise<string[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query: `${query} data center water consumption electricity pollution sustainability`,
      max_results: 10,
    }),
  });
  const data = await res.json();
  return (data.results || []).map((r: { url: string }) => r.url);
}

async function jinaRead(url: string): Promise<string> {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Authorization: `Bearer ${JINA_API_KEY}` },
    });
    return res.text();
  } catch {
    return "";
  }
}

async function llmExtract(rawText: string, query: string, sustainabilityUrl: string | null): Promise<DataCenterResult[]> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a data extraction assistant. Extract data center information ONLY for "${query}" from the provided text.
Return ONLY a JSON array with up to 10 unique objects. No duplicates — each must have a different name and location.
Each object must have these exact fields:
{
  "name": string (specific name like "Google Council Bluffs" not just "Google Data Center"),
  "company": string (must match or relate to "${query}"),
  "country": string,
  "location": string (city and state/region),
  "water_consumption": string (include units, e.g. "1.3 billion gallons/year"),
  "electricity_consumption": string (include units, e.g. "9 TWh/year"),
  "pollution": string (carbon output with units),
  "sustainability_steps": string (specific steps taken by this data center),
  "sustainability_url": string (use "${sustainabilityUrl ?? ""}" if available, otherwise find the most relevant official sustainability page URL for this company)
}
Only include data centers whose company matches "${query}". If a field is truly unknown use "N/A".
Return ONLY the JSON array, no explanation, no markdown.`,
        },
        {
          role: "user",
          content: `Query: "${query}"\n\nText:\n${rawText.slice(0, 8000)}`,
        },
      ],
      temperature: 0.1,
    }),
  });
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  try {
    const clean = content.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

export interface DataCenterResult {
  name: string;
  company: string;
  country: string;
  location: string;
  water_consumption: string;
  electricity_consumption: string;
  pollution: string;
  sustainability_steps: string;
  sustainability_url: string;
}

export async function searchDataCenters(query: string): Promise<DataCenterResult[]> {
  try {
    const sustainabilityUrl = getSustainabilityUrl(query);
    const urls = await tavilySearch(query);

    // Add official sustainability page to the fetch list if available
    const fetchUrls = sustainabilityUrl ? [sustainabilityUrl, ...urls.slice(0, 4)] : urls.slice(0, 5);
    const texts = await Promise.all(fetchUrls.map(jinaRead));
    const combined = texts.join("\n\n");
    const results = await llmExtract(combined, query, sustainabilityUrl);

    // Deduplicate by name
    const seen = new Set<string>();
    return results.filter((dc) => {
      const key = dc.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (err) {
    console.error("Search pipeline error:", err);
    return [];
  }
}
