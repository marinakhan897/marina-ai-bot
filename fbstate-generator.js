// fbstate-generator.js - C3C FBState Generator for Marina AI Bot
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

console.log('🎀 Marina AI FBState Generator Starting...');
console.log('✨ Created by: Marina Khan');

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Marina AI - FBState Generator</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f0f2f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #1877f2; text-align: center; }
            .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
            code { background: #e9ecef; padding: 2px 5px; border-radius: 3px; }
            .btn { background: #1877f2; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
            textarea { width: 100%; height: 100px; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎀 Marina AI FBState Generator</h1>
            <p><strong>Created by: Marina Khan</strong></p>
            
            <div class="step">
                <h3>📋 Step 1: Get Facebook Cookies</h3>
                <p>1. Open Facebook in Chrome/Firefox</p>
                <p>2. Press <code>F12</code> → Console tab</p>
                <p>3. Paste this code and press Enter:</p>
                <code style="display:block; white-space:pre-wrap; background:#2d2d2d; color:#fff; padding:10px; margin:10px 0;">
document.cookie
                </code>
                <p>4. Copy ALL the text that appears</p>
            </div>

            <div class="step">
                <h3>📤 Step 2: Paste Cookies Here</h3>
                <textarea id="cookies" placeholder="Paste your Facebook cookies here..."></textarea>
                <button class="btn" onclick="generateFBState()">Generate FBState</button>
            </div>

            <div class="step" id="result" style="display:none;">
                <h3>✅ FBState Generated!</h3>
                <p>Your <code>appstate.json</code> file has been created.</p>
                <p>Restart your bot: <code>npm start</code></p>
            </div>
        </div>

        <script>
            function generateFBState() {
                const cookies = document.getElementById('cookies').value;
                if (!cookies) {
                    alert('Please paste your Facebook cookies first!');
                    return;
                }

                fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cookies: cookies })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('result').style.display = 'block';
                        alert('✅ FBState generated successfully!');
                    } else {
                        alert('❌ Error: ' + data.error);
                    }
                })
                .catch(error => {
                    alert('❌ Network error: ' + error);
                });
            }
        </script>
    </body>
    </html>
    `);
});

app.post('/generate', (req, res) => {
    try {
        const { cookies } = req.body;
        
        if (!cookies) {
            return res.json({ success: false, error: 'No cookies provided' });
        }

        // Parse cookies and create appstate
        const appState = parseCookiesToAppState(cookies);
        
        // Save to appstate.json
        fs.writeFileSync('appstate.json', JSON.stringify(appState, null, 2));
        
        console.log('✅ FBState generated and saved successfully');
        res.json({ success: true, message: 'FBState generated' });
        
    } catch (error) {
        console.error('❌ FBState generation error:', error);
        res.json({ success: false, error: error.message });
    }
});

function parseCookiesToAppState(cookieString) {
    const cookies = cookieString.split(';').map(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        const value = valueParts.join('=');
        return { name: name.trim(), value: value.trim() };
    });

    // Filter relevant Facebook cookies
    const fbCookies = cookies.filter(cookie => 
        cookie.name.includes('c_user') || 
        cookie.name.includes('xs') || 
        cookie.name.includes('fr') ||
        cookie.name.includes('datr') ||
        cookie.name.includes('sb')
    );

    return fbCookies.map(cookie => ({
        key: cookie.name,
        value: cookie.value,
        domain: '.facebook.com',
        path: '/',
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        secure: true,
        hostOnly: false
    }));
}

app.listen(PORT, () => {
    console.log(`🌐 FBState Generator running on http://localhost:${PORT}`);
    console.log('💡 Open this URL in your browser to generate FBState');
});

module.exports = app;
