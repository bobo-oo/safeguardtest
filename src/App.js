import React, { useState } from 'react';
import './App.css'; // Import CSS file for styling

function App() {
  // States to manage form inputs, login status, portal URL, WebView visibility, success message, and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status

  // Function to validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to handle login submission
  const handleLogin = async () => {
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      const response = await fetch('https://safeguard-me-coding-exercise.azurewebsites.net/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Invalid email or password.');
        return;
      }

      const data = await response.json();

      // Step 2: Get Portal URL
      const portalResponse = await fetch('https://safeguard-me-coding-exercise.azurewebsites.net/api/PortalUrl', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
      const portalData = await portalResponse.text();
      setPortalUrl(portalData);
      setShowWebView(true);
      setLoggedIn(true); // Set login status to true
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  // Function to handle WebView navigation changes
  const handleWebViewNavigation = (newNavState) => {
    if (
      newNavState.url === 'https://safeguard-me-coding-exercise.azurewebsites.net/api/PortalSuccess') {
      setSuccess(true);
      setShowWebView(false);
    }
  };

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: '#8fc4b7' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-8 col-xl-6">
            {!loggedIn && ( // Render login form only if not logged in
              <div className="card rounded-3">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp"
                  className="w-100" style={{ borderTopLeftRadius: '.3rem', borderTopRightRadius: '.3rem' }}
                  alt="Sample photo" />
                <div className="card-body p-4 p-md-5">
                  <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">CV Uploader</h3>
                  <form className="px-md-2">
                    <div className="form-outline mb-4">
                      <input type="text" id="form3Example1q" className="form-control" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                      <label className="form-label" htmlFor="form3Example1q">Email</label>
                    </div>
                    <div className="form-outline mb-4">
                      <input type="password" id="form3Example1r" className="form-control" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                      <label className="form-label" htmlFor="form3Example1r">Password</label>
                    </div>
                    <button type="button" onClick={handleLogin} className="btn btn-success btn-lg mb-1">Login</button>
                    {error && <p className="error">{error}</p>}
                  </form>
                </div>
              </div>
            )}
            {showWebView && (
              <div className="card rounded-3 mt-5" style={{ width: '400px' }}> {/* Set width to 400px */}
                <div className="card-body p-4 p-md-5">
                  <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Upload Your CV</h3>
                  <iframe
                    src={portalUrl}
                    title="Document Upload"
                    style={{ width: '100%', height: '400px', border: 'none' }}
                    onLoad={() => console.log('WebView loaded')}
                    onError={(e) => console.error('WebView error:', e)}
                    onNavigationStateChange={handleWebViewNavigation}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {success && <p className="success">Document uploaded successfully!</p>}
    </section>
  );
}

export default App;
