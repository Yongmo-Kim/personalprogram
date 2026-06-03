export default async function handler(req, res) {
  const { path } = req.query;
  const urlObj = new URL(req.url, 'http://localhost');
  const params = urlObj.searchParams;
  params.delete('path');
  const queryString = params.toString();
  const targetUrl = `https://news.google.com/${path || ''}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'text/xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
