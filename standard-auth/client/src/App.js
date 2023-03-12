import logo from './logo.svg';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useRef, memo } from 'react';

axios.defaults.withCredentials = true;

const serverUrl = process.env.REACT_APP_SERVER_URL;

const Home = () => {
  return <h1>Home page</h1>
}

const Login = () => {
  const handleLogin = async () => {
    try {
      // Gets authentication url from backend server
      const { data: { url } } = await axios.get(`${serverUrl}/auth/url`);
      // Opens a new tab for the url
      window.location.assign(url);
    } catch (err) {
      console.error(err);
    }
  }
  return <>
  <h3>Login to access home page</h3>
  <button className="login-btn" onClick={handleLogin} >Login</button>
  </>
}

const Callback = memo(() => {
  const called = useRef(false);
  useEffect(() => {
    (async () => {
      try {
        if (called.current) return; // prevent rerender caused by StrictMode
        called.current = true;
        const res = await axios.get(`${serverUrl}/auth/token${window.location.search}`);
        console.log('response: ', res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [])
  return <>
    <h1>Callback</h1>
  </>
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/callback', // google will redirect here
    element: <Callback />,
  }
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
