export const verificationCodeEmailTemplate = (code: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Code</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 48px;
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      margin-bottom: 24px;
      color: #667eea;
    }
    h1 {
      color: #1a1a2e;
      font-size: 24px;
      margin-bottom: 12px;
    }
    p {
      color: #666;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .code {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 32px;
    }
    .expires {
      color: #999;
      font-size: 14px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #eee;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🔐</div>
    <h1>Verify Your Code</h1>
    <p>Enter the verification code below to complete your request.</p>
    <div class="code">${code}</div>
    <p class="expires">This code will expire in 10 minutes.</p>
    <div class="footer">
      If you didn't request this code, please ignore this email.
    </div>
  </div>
</body>
</html>
`

export const verificationPageHtml = (token: string, type: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 48px;
      max-width: 440px;
      width: 100%;
    }
    .logo {
      font-size: 32px;
      text-align: center;
      margin-bottom: 24px;
    }
    h1 {
      color: #1a1a2e;
      font-size: 24px;
      text-align: center;
      margin-bottom: 12px;
    }
    p {
      color: #666;
      text-align: center;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .code-input {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 24px;
    }
    .code-input input {
      width: 48px;
      height: 56px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      outline: none;
      transition: border-color 0.3s;
    }
    .code-input input:focus {
      border-color: #667eea;
    }
    .code-input input.invalid {
      border-color: #e74c3c;
    }
    button {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .error {
      color: #e74c3c;
      text-align: center;
      margin-bottom: 16px;
      display: none;
    }
    .error.show {
      display: block;
    }
    .resend {
      text-align: center;
      margin-top: 16px;
      color: #666;
    }
    .resend a {
      color: #667eea;
      text-decoration: none;
      cursor: pointer;
    }
    .resend a:hover {
      text-decoration: underline;
    }
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #ffffff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🔐</div>
    <h1>Two-Factor Authentication</h1>
    <p id="message">Enter the 6-digit code sent to your email to verify your identity.</p>
    
    <div class="error" id="error"></div>
    
    <form id="verifyForm">
      <div class="code-input">
        <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
        <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
        <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
        <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
        <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
        <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
      </div>
      <button type="submit" id="submitBtn">Verify Code</button>
    </form>
    
    <div class="resend">
      Didn't receive the code? <a id="resendLink">Resend</a>
    </div>
  </div>

  <script>
    const token = '${token}';
    const type = '${type}';
    const inputs = document.querySelectorAll('.code-input input');
    const form = document.getElementById('verifyForm');
    const error = document.getElementById('error');
    const submitBtn = document.getElementById('submitBtn');
    const resendLink = document.getElementById('resendLink');
    const message = document.getElementById('message');

    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
        error.classList.remove('show');
      });
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          inputs[index - 1].focus();
        }
      });
      
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\\D/g, '').split('').slice(0, 6);
        pasted.forEach((char, i) => {
          if (inputs[i]) inputs[i].value = char;
        });
        if (pasted.length > 0) inputs[Math.min(pasted.length, 5)].focus();
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = inputs.map(i => i.value).join('');
      
      if (code.length !== 6) {
        error.textContent = 'Please enter all 6 digits';
        error.classList.add('show');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span>Verifying...';

      try {
        const response = await fetch('/api/auth/verify-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, code, type })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        message.textContent = 'Verification successful! Redirecting...';
        message.style.color = '#27ae60';
        
        setTimeout(() => {
          window.location.href = data.redirect || '/';
        }, 1500);
      } catch (err) {
        error.textContent = err.message;
        error.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Code';
        inputs.forEach(i => {
          i.value = '';
          i.classList.add('invalid');
        });
        inputs[0].focus();
        setTimeout(() => inputs.forEach(i => i.classList.remove('invalid')), 1000);
      }
    });

    resendLink.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/auth/resend-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, type })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to resend code');
        }
        
        message.textContent = 'A new code has been sent to your email.';
      } catch (err) {
        error.textContent = err.message;
        error.classList.add('show');
      }
    });
  </script>
</body>
</html>
`
