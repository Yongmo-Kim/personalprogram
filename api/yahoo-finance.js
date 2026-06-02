export default async function handler(req, res) {
  const { path } = req.query;
  
  // Extract original query string
  const urlObj = new URL(req.url, 'http://localhost');
  const params = urlObj.searchParams;
  params.delete('path');
  const queryString = params.toString();
  
  const targetUrl = `https://query1.finance.yahoo.com/${path || ''}${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    
    // Set headers
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
