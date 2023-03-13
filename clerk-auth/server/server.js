import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const config = {
  postUrl: 'https://jsonplaceholder.typicode.com/posts',
  clerkSecretKey: process.env.CLERK_SECRET_KEY, // Clerk automatically picks this from the env
};

const app = express();

app.use(cors());

app.get('/user/posts', ClerkExpressRequireAuth(), async (req, res) => {
  console.log('REQUEST AUTH: ', req.auth);
  try {
    const { data } = await axios.get(config.postUrl);
    res.json({ posts: data?.slice(0, 5) });
  } catch (err) {
    console.error('Error: ', err);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));