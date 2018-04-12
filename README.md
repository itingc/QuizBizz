# QuizzBizz

A real time game that will makes classrooms more fun. You can sign up and create a Quiz and share a unique room code that users can join and play. It is a jeopardy like game where the first person to push the buzzer get’s to answer and the points are tracked.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Running with Vagrant

How to start VM
```
vagrant up
```

Available on URL
```
http://localhost:5622                (locally)
http://csil-cpu470.csil.sfu.ca:5622/ (SFU Server)
https://quizbizz470.herokuapp.com/ (Heroku just in case)
```

Server runs on port 5622, 
Database runs on port 3711

### Prerequisites

Node JS needs to be installed

```
https://nodejs.org/en/download/
```

MongoDB needs to be installed

```
https://www.mongodb.com/download-center?jmp=nav
```

### Installing

How to run the project locally

Build the client (current directory client)

```
npm run build
```

Start up MongoDB client
```
~/mongo/bin/mongod
```

Start the server
```
node server
```

## Comments
How to Play

Teacher (Host)                       

1. Register / Login                   
2. Create/Edit/Delete Quizzes						  
3. Start Quiz / Share Room Code		  
4. Enable Buzzer Every Question		  

 Student (Player)

1. Enter Room Code
2. Press Buzzer First
3. Gain Points for Correct Answer
4. Other Players Can steal if Wrong

## Members

* **Raymond Eng** - *Front End (React) / API & Database* 
* **Parmvir Johal** - *API & Database / Socket.io* 
* **Jerry Chen** - *Deployment / Front End* 


See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

