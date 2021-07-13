# ConnectX

### Hosted At - https://connect-x.vercel.app/

### Vide Demo - https://www.youtube.com/watch?v=nlL0cPCNIdM&t=12s

## Features - ## 

1. Video Conferencing with upto 9 people at a time.
2. Chat with them in the video meet.
3. Screen Share, toggle audio/video.
4. Whiteboard - realtime drawing together.
5. Invite participants - enter their email id and an email is sent to them via ConnectX
6. Schedule a meeting for later
    - this creates a special meet room in chats tab.
    - adds an event for specified date and time in calendar.
    - sends an invite mail to all the invitees.
7. Special Features of this meet room 
    - continue the conversation before and after the meet only with participants that you have invited.
    - Chat of this meet is visible to invited participants irrespective of whether they join the meet or not.
    - participants invited via other means can access chat only during the meet.
    - join meet icon appears 5 min prior to the scheduled meet time.
8. General purpose chat room in Chats Tab .
9. Voice to text messaging to enable hands free writing.
10. File Sharing.
11. View all files together in Files tab 
    - advantage preview files without downloading and download only if you want to.
12. As an added bonus use Calendar as personalized To Do List .
    - Add/Update/Delete any task
    - ConnectX will make sure you don't forget the task by sending a reminder mail 15 mins prior to the event

## Tech Stack Used ## 

1. Backend - Node.js (Express.js)
    - easy to configure and customize
    - allows to create REST APIs and middlewares
    - easy to connect with database
2. Frontend - React.js 
    - allows writing custom components
    - offers fast rendering
    - better code stability
3. Database - Mongoose (MongoDB)
    - Node.js based object data modelling library for Node.js
4. For Video conferencing and Chats - Socket.io and WebRTC    

## Installation Steps ## 

#### 1. Backend ####

  `cd backend`
  ##### install dependencies #####
  `npm i`
  ##### run server (running at 5000) #####
  `npm run index.js`

#### 2. Frontend ####

  `cd frontend`
 ##### install dependencies #####
  `npm i`
 ##### run server (running at 3000) #####
  `npm run start`
  
  ** Note- mailing facility won't be available in cloned project, replace mail id and password in nodemailer.js (if you are cloning this project) **

