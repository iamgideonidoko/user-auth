import logo from './logo.svg';
import './App.css';
import { ClerkProvider, SignedIn, SignedOut, UserButton, RedirectToSignIn, useAuth }  from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const { getToken } = useAuth();


  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        console.log('token: ', token)
        // Get posts from server
        const { data: { posts } } = await axios.get(`${serverUrl}/user/posts`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPosts(posts);
      } catch (err) {
        console.error(err);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h3>Dashboard</h3>
      <UserButton />
      <div>
        {posts.map((post, idx) => <div>
          <h5>{post?.title}</h5>
          <p>{post?.body}</p>
        </div>)}
      </div>
    </>
  )
}

function App() {
  return (
    // Don't forget to pass the publishableKey prop
    <ClerkProvider publishableKey={clerkPubKey}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <SignedIn>
            <Dashboard />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </header>
      </div>
    </ClerkProvider>
  );
}

export default App;
