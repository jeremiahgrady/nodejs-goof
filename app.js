/**
 * Express.js application designed to demonstrate XSS vulnerabilities
 * for SAST tool testing in a non-production environment.
 *
 * IMPORTANT: This code is intentionally vulnerable and should ONLY be used
 * for security testing in a sandboxed, isolated environment.
 * Do NOT deploy this to production.
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// In-memory store for messages (reset on server restart)
const messages = [];

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to serve static files (if any, though not strictly needed for this example)
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route to display the main page with a message submission form
 * and a list of submitted messages.
 * This route demonstrates both vulnerable and safe rendering.
 */
app.get('/', (req, res) => {
    // Render the 'index' EJS template, passing the current messages
    res.render('index', { messages: messages });
});

/**
 * Route to handle new message submissions.
 * It adds the submitted message to the in-memory array.
 */
app.post('/submit-message', (req, res) => {
    const newMessage = req.body.message; // Get the 'message' from the form body

    if (newMessage) {
        messages.push(newMessage); // Add the new message to the array
        console.log(`New message added: "${newMessage}"`);
    }
    // Redirect back to the home page to display the updated messages
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`XSS Test App listening at http://localhost:${port}`);
    console.log(`
To test XSS:
1. Go to http://localhost:${port}
2. In the "Vulnerable Message Input", enter an XSS payload, e.g.:
   <script>alert('XSS Test!');</script>
   Or:
   <img src="x" onerror="alert('XSS Attack!');">
3. Submit the message. The script should execute.
4. The "Safe Message Output" below it should render the input as plain text, not executing the script.
    `);
});

