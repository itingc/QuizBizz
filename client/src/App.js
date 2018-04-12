import React, { Component }             from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RegistrationPage                 from './components/RegistrationPage.js';
import LoginPage                        from './components/LoginPage.js';
import QuizzesPage                      from './components/QuizzesPage';
import QuizPage                         from './components/QuizPage';
import CreateQuizPage                   from './components/CreateQuizPage';
import SocketClient                     from './components/SocketClient';
import PresenterPage                    from './components/PresenterPage';
import PlayerRoom                       from './components/PlayerRoom';
import ParticipantsBox                  from './components/ParticipantsBox';
import EditQuiz                         from './components/EditQuiz';
import GameOver                         from './components/GameOver';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={RegistrationPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Route path="/quizzes" component={QuizzesPage}/>
          <Route path="/quiz" component={QuizPage}/>
          <Route path="/create" component={CreateQuizPage}/>
          <Route path="/join" component={SocketClient}/>
          <Route path="/room/:id" component={PresenterPage}/>
          <Route path="/play/:id" component={PlayerRoom}/>
          <Route path="/gameover/:id" component={GameOver}/>
          <Route path="/box" component={ParticipantsBox}/>
          <Route path="/edit" component={EditQuiz}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
