Setup Instructions:

Extract the ZIP file to your preferred directory. clone the repository
Ensure you have Node.js, Yarn (or NPM), and Expo CLI installed.
Open a terminal in the project folder and install dependencies:
sh yarn install 
npm install  
Start the mock API server using JSON Server:
5.  json-server --watch db.json --port 3001  
If testing on a physical device, use:

json-server --host 0.0.0.0 --watch db.json --port 3001  
Run the Expo project:
sh
expo start  
You can scan the QR code with the Expo Go app or run it on an emulator.

Features Implemented:

Authentication (Login, Register, Logout)
Redux Toolkit with Persist for state management
Mock API with JSON Server
Right-side drawer navigation
Transaction history and dashboard
Toast notifications