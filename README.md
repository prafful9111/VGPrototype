Introduction – 
The goal is to implement an autonomous personalized video generation software, which sends personalized videos to the customers, including their personalized text on the video. There is a Video template with placeholders of Name, Email, and Mobile Number which varies according to customer details, and these videos are sent to customers via email or whats-app.
Technology Stack –
•	Frontend : React.js
•	Backend : Node.js
•	Video Processing : FFMPEG
•	Excel Parsing : XLSX (for reading Excel sheets)
Prerequisites –
•	Node.js: Ensure Node.js is installed on your system. Download here
•	FFmpeg: Install FFmpeg by following the official documentation. Installation Guide
Key Functionalities –
•	Insert personalized data and display on the video using GUI.
•	Generating videos by fetching data from an excel sheet uploaded using GUI.
•	Display data like name, email etc. on different time stamps.
•	Integration of NodeJs, to achieve automation.
Work-Flow – 
Uploading Excel Sheet (Frontend)
The React frontend provides a form that allows users to upload an Excel sheet containing personalized data (name, email, and mobile number). The uploaded file is then sent to the backend API for processing.
Processing Excel Data (Backend)
Once the Excel sheet is uploaded, the backend uses the XLSX library to read and parse the data. The parsed data is used to generate personalized videos for each user in the Excel sheet.
FFmpeg Video Generation
For each entry in the Excel sheet, the Node.js server invokes FFmpeg to overlay the user's information (name, email, and mobile number) onto the video template.
Video Processing time – 
The Processing time depends on the number of output videos, the prototype is currently taking 18-20 seconds to process a single video. Factors like quantity of text to be displayed, size of the template video, Different transitions on texts, may also affect the processing time. 
