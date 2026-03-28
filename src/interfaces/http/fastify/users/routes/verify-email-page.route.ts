export const verifyEmailPageHtml = (email: string): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verificar Email</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
    .logo { font-size: 48px; margin-bottom: 24px; }
    h1 { color: #1a1a2e; font-size: 24px; margin-bottom: 12px; }
    p { color: #666; margin-bottom: 24px; line-height: 1.6; }
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
    }
    .code-input input:focus { border-color: #667eea; }
    .code-input input.error { border-color: #e74c3c; }
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
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .success { color: #27ae60; }
    .error { color: #e74c3c; margin-bottom: 16px; display: block; }
    .hidden { display: none; }
    a { color: #667eea; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container" id="container">
    <div class="logo">📧</div>
    <h1>Verifica tu email</h1>
    <p>Ingresa el código de 6 dígitos que recibiste en tu email.</p>
    
    <div id="error" class="error hidden"></div>
    
    <div class="code-input" id="codeInputs">
      <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
      <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
      <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
      <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
      <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
      <input type="text" maxlength="1" pattern="[0-9]" inputmode="numeric" required />
    </div>
    
    <button type="button" id="verifyBtn">Verificar</button>
  </div>

  <script>
    const email = '${email}';
    const inputsArray = document.getElementById('codeInputs').querySelectorAll('input');
    const inputs = Array.from(inputsArray);
    const verifyBtn = document.getElementById('verifyBtn');
    const errorEl = document.getElementById('error');
    const container = document.getElementById('container');
    
    console.log('Email:', email);
    console.log('Inputs:', inputs.length);
    
    // Auto-focus first input
    inputs[0].focus();
    
    // Handle input
    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        console.log('Input:', e.target.value, 'Index:', index);
        if (e.target.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
        errorEl.classList.add('hidden');
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
    
    // Verify on button click
    verifyBtn.addEventListener('click', async () => {
      console.log('Button clicked');
      const code = Array.from(inputs).map(i => i.value).join('');
      console.log('Code:', code);
      
      if (code.length !== 6) {
        errorEl.textContent = 'Por favor ingresa los 6 dígitos';
        errorEl.classList.remove('hidden');
        return;
      }
      
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Verificando...';
      
      try {
        console.log('Sending request to /api/users/verify');
        const response = await fetch('/api/users/verify', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: email, 
            code: code 
          })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.data && data.data.success) {
          container.innerHTML = \`
            <div class="logo">✅</div>
            <h1 class="success">¡Email verificado!</h1>
            <p>Tu cuenta ha sido verificada correctamente.</p>
            <p><a href="/api-docs">Ir a la API</a></p>
          \`;
        } else {
          const errorMsg = data.data ? data.data.message : 'Error al verificar';
          errorEl.textContent = errorMsg;
          errorEl.classList.remove('hidden');
          verifyBtn.disabled = false;
          verifyBtn.textContent = 'Verificar';
          inputs.forEach(i => {
            i.value = '';
            i.classList.add('error');
          });
          inputs[0].focus();
          setTimeout(() => {
            inputs.forEach(i => i.classList.remove('error'));
          }, 1000);
        }
      } catch (err) {
        console.error('Error:', err);
        errorEl.textContent = 'Error al conectar con el servidor';
        errorEl.classList.remove('hidden');
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verificar';
      }
    });
    
    // Also allow pressing Enter
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        verifyBtn.click();
      }
    });
  </script>
</body>
</html>
`
