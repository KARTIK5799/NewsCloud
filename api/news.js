
export default async function handler(req, res) {
    const { query } = req.query;
    const API_KEY = process.env.NEWS_API_KEY; 
    const newsUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(newsUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
