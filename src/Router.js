import React from 'react';
import {Route, Switch} from 'react-router-dom';

import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPasswordRequest from './pages/ResetPasswordReq';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound'

// User is LoggedIn
//import PrivateRoute from './PrivateRoute';
import Order from './pages/Order';
import MyOrders from './pages/MyOrders';
import MyOrder from './pages/MyOrder';
import AllOrders from './pages/AllOrders';
import EditOrder from './pages/EditOrder';
import CheckoutSuccess from './pages/Checkout';
import Track from './pages/Track';
import Reports from './pages/Reports';


const Main = props => (
    
    <Switch>
      {/*User might LogIn*/}
      <Route exact path='/' component={Home}/>
      <Route exact path='/landing' component={Landing}/>
      {/*User will LogIn*/}
      <Route exact path='/getstarted' component={GetStarted}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/resetpasswordrequest' component={ResetPasswordRequest}/>
      <Route exact path='/resetpassword/:token' component={ResetPassword}/>
      <Route exact path='/order/track/:id' component={Track}/>
      <Route exact path='/order' component={Order}/>
      <Route exact path='/checkout/success/:id' component={CheckoutSuccess}/>
      <Route exact path='/orders/my' component={MyOrders}/>
      <Route exact path='/orders/my/:id' component={MyOrder}/>
      <Route exact path='/orders/all' component={AllOrders}/>
      <Route exact path='/orders/edit/:id' component={EditOrder}/>
      <Route exact path='/reports' component={Reports}/>
      

      
      <Route component={NotFound}/>
    </Switch>
    
);

export default Main;