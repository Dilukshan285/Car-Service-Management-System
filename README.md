Car Service Management System
Overview
The Car Service Management System is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) to streamline vehicle repair and maintenance processes for car service centers. The system allows users to manage service requests, track vehicle statuses, and integrate advanced features like vehicle damage detection using a Roboflow machine learning model. This project was developed to provide an efficient, user-friendly platform for both customers and service center staff.
Features

Service Request Management: Customers can submit service requests, view service history, and track repair statuses.
Vehicle Damage Detection: Integrates a Roboflow-trained machine learning model to detect vehicle damage from uploaded images, enhancing repair diagnostics.
User Roles: Supports multiple user roles (e.g., customer, staff) with role-based access to features.
Real-Time API Integration: Provides RESTful APIs (e.g., /api/counts/predict) for seamless frontend-backend communication.
Responsive UI: Built with React and styled with Tailwind CSS for a modern, mobile-friendly interface.
Database Management: Uses MongoDB for efficient storage and retrieval of service records, user data, and damage detection results.

Tech Stack

Frontend: React, Tailwind CSS, Vite
Backend: Node.js, Express.js
Database: MongoDB
Machine Learning: Roboflow (for vehicle damage detection)
Other Tools: JavaScript, TypeScript, Axios (for API calls)

Installation
Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
Roboflow account and API key for damage detection
Git

Steps

Clone the Repository:
git clone https://github.com/Dilukshan285/Car-Service-Management-System.git
cd Car-Service-Management-System


Install Dependencies:

For the backend:cd server
npm install


For the frontend:cd client
npm install




Set Up Environment Variables:

Create a .env file in the server directory with the following:MONGO_URI=your_mongodb_connection_string
PORT=5000
ROBOFLOW_API_KEY=your_roboflow_api_key




Run the Application:

Start the backend server:cd server
npm start


Start the frontend:cd client
npm run dev


The application will be available at http://localhost:5173 (frontend) and http://localhost:5000 (backend).


Configure Roboflow:

Ensure your Roboflow model is trained for vehicle damage detection.
Update the API endpoint in server.js to integrate with Roboflow’s inference API for image processing.



Usage

Customers: Register/login, submit service requests, upload vehicle images for damage detection, and view service status.
Staff: Manage service requests, view damage detection results, and update repair statuses.
Damage Detection: Upload vehicle images via the frontend, which are processed by the Roboflow model through the /api/counts/predict endpoint to identify damage.

Project Structure
Car-Service-Management-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components (e.g., Dashboard, ServiceRequest)
│   │   └── App.jsx         # Main React app
├── server/                 # Node.js/Express backend
│   ├── routes/             # API routes (e.g., /api/counts/predict)
│   ├── models/             # MongoDB schemas
│   └── server.js           # Main backend file
├── README.md               # Project documentation

API Endpoints

GET /api/counts/predict: Fetches damage detection results from the Roboflow model.
POST /api/service/request: Submits a new service request.
GET /api/service/history: Retrieves service history for a user or vehicle.

Challenges and Solutions

Backend Error Handling: Resolved ReferenceError: Cannot access 'app' before initialization by restructuring server.js to ensure proper Express app initialization.
API Connectivity: Fixed net::ERR_CONNECTION_REFUSED by verifying server port configurations and ensuring MongoDB connectivity.
Roboflow Integration: Configured the Roboflow API to process vehicle images, handling asynchronous requests and parsing model outputs for frontend display.

Future Improvements

Add admin dashboard for managing users and service analytics.
Enhance Roboflow model accuracy with additional training data.
Implement real-time notifications for service updates using WebSockets.
Deploy the application on a cloud platform like Vercel or AWS.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License.
Contact
For questions or feedback, reach out to Dilukshan285.
