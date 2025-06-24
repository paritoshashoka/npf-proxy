import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const PROXY_SECRET = process.env.PROXY_SECRET || 'my-secret-token';

app.use(cors());
app.use(express.json());

app.post('/send-to-npf', async (req, res) => {
  const { token, payload } = req.body;

  if (token !== PROXY_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }

  try {
    const npfResponse = await axios.post(
      'https://api.nopaperforms.io/lead/v1/create',
      payload,
      {
        headers: {
          'access-key': '03091f8beeb14ae6baa370d408544d54',
          'secret-key': 'f5813adaeee3bf96aa714c7189d86920',
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(npfResponse.status).json(npfResponse.data);
  } catch (error) {
    console.error('NPF Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.get('/ip', async (req, res) => {
  try {
    const ip = await axios.get('https://ifconfig.me/ip');
    res.send(`Public IP: ${ip.data}`);
  } catch (e) {
    res.send('Could not fetch IP');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});