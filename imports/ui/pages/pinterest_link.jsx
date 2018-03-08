
import React from 'react';
import { Meteor } from 'meteor/meteor';
import canHOC from '/imports/ui/can_hoc';
import Container from '/imports/ui/components/grid/container';
import loginData from '/imports/data/users/login_state';
//import { composeWithTracker } from 'react-komposer';
import { showLogin } from '/imports/ui/components/login/modal'; 

export default class PinterestLink extends React.Component {
   
    onClickLogin() {
        //e.preventDefault();
        //mixpanel.track('Login - Start'); // FIXME - why does this fire twice?
        //utu.track('Login - Start'); // FIXME - why does this fire twice?
        console.log('showLogin');
        if(!Meteor.userId())
        {
            showLogin({ successRedirect: '/affiliate' });
        }
        else {
          Meteor.call('pinterestLink', function(error, result) {
            if(error){
              
            }else{
               console.log(result);
            }
         });
        }

        
    }
    componentDidMount()
    {
        this.onClickLogin();
    }


    render() {

        return(
            
                <Container>
                    <p>
                    Affiliation Page
                    </p>
                   
                </Container>
        )
    }
}
//const ComponentWLoginData = composeWithTracker(loginData)(AffiliateLink);
//export default canHOC(ComponentWLoginData, { allowNonVerified: true });

