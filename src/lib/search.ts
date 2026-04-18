const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY as string;
const JINA_API_KEY = import.meta.env.VITE_JINA_API_KEY as string;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;

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

async function llmExtract(rawText: string, query: string): Promise<DataCenterResult[]> {
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
Return ONLY a JSON array with up to 10 unique objects. No duplicates — each object must have a different name and location.
Each object must have these exact fields:
{
  "name": string (specific name like "Google Council Bluffs" not just "Google Data Center"),
  "company": string (must match or relate to "${query}"),
  "country": string,
  "location": string (city and state/region),
  "water_consumption": string (include units, e.g. "1.3 billion gallons/year"),
  "electricity_consumption": string (include units, e.g. "9 TWh/year"),
  "pollution": string (carbon output with units),
  "sustainability_steps": string (specific steps taken)
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
}

export async function searchDataCenters(query: string): Promise<DataCenterResult[]> {
  try {
    const urls = await tavilySearch(query);
    const texts = await Promise.all(urls.slice(0, 5).map(jinaRead));
    const combined = texts.join("\n\n");
    const results = await llmExtract(combined, query);

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
