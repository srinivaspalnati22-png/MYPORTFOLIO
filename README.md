# Portfolio Website - Full Stack Application

A complete full-stack portfolio website for Palnati Pushpa Naga Venkata Srinivas, a BTech CSE student, AI Enthusiast, Startup Builder, and Hackathon Developer.

### 🌐 Live Production Deployment
🚀 **Live URL**: [https://myportfolio-pi-brown.vercel.app](https://myportfolio-pi-brown.vercel.app)


## Features

### Frontend
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Modern UI** - Clean and professional design with smooth animations
- **Interactive Elements** - Hover effects, smooth scrolling, and transitions
- **Sections Included**:
  - Hero/Home Section with profile introduction
  - About Me with student statistics (CGPA: 8.0)
  - Skills & Expertise (6 categories including backend development)
  - Featured Projects (6 full-stack projects)
  - Academic & Learning Journey timeline
  - Contact Form with backend integration
  - Footer with social links

### Backend
- **Express.js API** - RESTful API for portfolio data
- **CORS Support** - Cross-Origin Resource Sharing enabled
- **Contact Form Handler** - Email integration via Nodemailer
- **Project Management** - Get and manage projects via API
- **Skills Management** - Retrieve all skills by category
- **Student Info** - Get student details and statistics

## Project Structure

```
myportfolio/
├── index.html          # Main Entry HTML file (Frontend - serves at root /)
├── v.html              # Mirror HTML file (Frontend)
├── v.css               # Stylesheet
├── v.js                # Frontend JavaScript with API integration
├── vercel.json         # Vercel Serverless Routing configurations
├── server.js           # Express.js Backend Server
├── package.json        # Node.js dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Technology Stack

### Frontend
- HTML5
- CSS3 (with CSS Grid, Flexbox)
- JavaScript (ES6+)
- Responsive Web Design

### Backend
- Node.js
- Express.js
- Nodemailer (Email sending)
- CORS
- Body-Parser
- Dotenv (Environment variables)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Step 1: Install Dependencies

```bash
cd myportfolio
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` file and add your email credentials:

```
PORT=5000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Step 3: Run the Backend Server

```bash
# For development (with auto-reload)
npm run dev

# For production
npm start
```

The server will run on `http://localhost:5000`

### Step 4: Open Frontend

Open `v.html` in your web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (optional)
npx http-server
```

Access at `http://localhost:8000` or `http://localhost:3000`

## API Endpoints

### Public Endpoints

#### Get All Projects
```
GET /api/projects
```
Response:
```json
{
  "success": true,
  "data": [...],
  "count": 6
}
```

#### Get Single Project
```
GET /api/projects/:id
```

#### Get All Skills
```
GET /api/skills
```

#### Get Student Info
```
GET /api/student
```
Response:
```json
{
  "name": "Palnati Pushpa Naga Venkata Srinivas",
  "cgpa": 8.0,
  "institution": "NRI Institute of Technology",
  "course": "BTech CSE",
  "year": "2nd Year"
}
```

#### Get Portfolio Statistics
```
GET /api/stats
```

### POST Endpoints

#### Submit Contact Form
```
POST /api/contact
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your.email@example.com",
  "subject": "Message Subject",
  "message": "Your message here"
}
```

#### Add New Project (Admin)
```
POST /api/projects
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project description",
  "technologies": ["Tech1", "Tech2"],
  "imageUrl": "path/to/image.jpg"
}
```

## Skills & Expertise

1. **Programming Languages** - Java, Python, C, C++, JavaScript, HTML5, CSS3
2. **Frontend Development** - React, JavaScript, Bootstrap, Responsive Design, AJAX
3. **Backend Development** - Node.js, Express.js, Python, REST APIs, Authentication
4. **Database Management** - MySQL, MongoDB, SQL Queries, Database Design
5. **Tools & Version Control** - Git, GitHub, VS Code, Postman, Linux
6. **Core CS Concepts** - Data Structures, Algorithms, OOP, Web Technologies, System Design

## Featured Projects

1. **Task Management System** - HTML5, CSS3, JavaScript, DOM
2. **Express.js REST API** - Node.js, Express.js, REST API, JWT
3. **Full Stack Todo Application** - React, Node.js, Express, MongoDB
4. **Calculator Application** - JavaScript, HTML, CSS
5. **Student Portfolio Website** - HTML5, CSS3, JavaScript
6. **Data Structure Implementations** - Java, C++, Data Structures, Algorithms
7. **SmartCivic AI** - Python, Flask, Gemini AI, JavaScript
8. **TrustShield AI** - Flutter, Firebase, Node.js, Gemini 2.0 Flash

## Student Profile

- **Name**: Palnati Pushpa Naga Venkata Srinivas
- **Course**: BTech Computer Science Engineering
- **Year**: 2nd Year (Ongoing)
- **Institution**: NRI Institute of Technology
- **CGPA**: 8.0 (Excellent Academic Performance)
- **Projects Built**: 15+
- **Focus Areas**: Web Development, Backend Development, Full Stack Development

## Contact Information

- **Email**: srinivas@nritech.edu
- **Phone**: +91 98765 43210
- **Location**: Hyderabad, India
- **Portfolio**: [GitHub](#) | [LinkedIn](#) | [Twitter](#)

## How to Run Complete Application

### Terminal 1 - Backend Server
```bash
npm run dev
# or
npm start
```

### Terminal 2 - Frontend (Optional, if using local server)
```bash
python -m http.server 8000
# or
npx http-server
```

Then open `v.html` in your browser.

## Customization

### Update Student Information
Edit the `student` object in `server.js`:
```javascript
const student = {
    name: "Your Name",
    email: "your.email@example.com",
    cgpa: 8.0,
    // ... other fields
};
```

### Add New Projects
Send a POST request to `/api/projects` or edit the `projects` array in `server.js`.

### Update Skills
Modify the `skills` array in `server.js`.

### Change Styling
Edit `v.css` for frontend design changes.

## Performance Optimization

- Lazy loading for images
- CSS animations and transitions for smooth UX
- Responsive images and media queries
- Minified assets (recommended for production)
- API caching (recommended for production)

## Security Considerations

- Add authentication middleware for admin routes
- Validate all form inputs
- Use HTTPS in production
- Store sensitive credentials in `.env` file
- Implement rate limiting for API endpoints
- Add input sanitization

## Future Enhancements

- Database integration (MongoDB/MySQL)
- User authentication system
- Blog functionality
- Admin dashboard
- Project filtering and search
- Dark mode theme
- Multi-language support
- Analytics tracking

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 5000
- Check firewall settings
- Verify CORS is enabled

### Email not sending
- Check `.env` file has correct credentials
- Enable "Less secure app access" for Gmail
- Use App Password instead of regular password

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## Developer Notes

- Frontend is responsive and mobile-first
- Backend is RESTful and follows best practices
- Code is well-commented for learning
- Perfect for portfolio showcasing
- Great for learning full-stack development

## License

MIT License - Feel free to use this project for learning and personal portfolio purposes.

## Author

Palnati Pushpa Naga Venkata Srinivas
BTech CSE Student at NRI Institute of Technology
CGPA: 8.0

---

**Last Updated**: December 18, 2025

**Version**: 1.0.0

For questions or suggestions, please contact via the contact form or email.
