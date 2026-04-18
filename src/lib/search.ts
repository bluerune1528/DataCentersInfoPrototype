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
      max_results: 5,
    }),
  });
  const data = await res.json();
  return (data.results || []).map((r: { url: string }) => r.url);
}

async function jinaRead(url: string): Promise<string> {
  const res = await fetch(`https://r.jina.ai/${url}`, {
    headers: { Authorization: `Bearer ${JINA_API_KEY}` },
  });
  return res.text();
}

async function llmExtract(rawText: string, query: string): Promise<DataCenterResult[]> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are a data extraction assistant. Extract data center information from the provided text and return ONLY a JSON array with up to 10 objects. Each object must have these exact fields:
{
  "name": string,
  "company": string,
  "country": string,
  "location": string,
  "water_consumption": string,
  "electricity_consumption": string,
  "pollution": string,
  "sustainability_steps": string
}
If a field is unknown, use "N/A". Return ONLY the JSON array, no explanation.`,
        },
        {
          role: "user",
          content: `Query: "${query}"\n\nText:\n${rawText.slice(0, 6000)}`,
        },
      ],
      temperature: 0.2,
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
    const texts = await Promise.all(urls.slice(0, 3).map(jinaRead));
    const combined = texts.join("\n\n");
    const results = await llmExtract(combined, query);
    return results;
  } catch (err) {
    console.error("Search pipeline error:", err);
    return [];
  }
}
