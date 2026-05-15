// App.js
import {Switch, Route, Redirect} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Home from './components/Home'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import AboutJobItem from './components/AboutJobItem'
import AllJobs from './components/AllJobs'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <Route exact path="/signup" component={SignupForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={AllJobs} />
    <ProtectedRoute exact path="/jobs/:id" component={AboutJobItem} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
