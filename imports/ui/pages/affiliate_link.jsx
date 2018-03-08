
import React from 'react';
import { Meteor } from 'meteor/meteor';
import canHOC from '/imports/ui/can_hoc';
import Container from '/imports/ui/components/grid/container';
import loginData from '/imports/data/users/login_state';
//import { composeWithTracker } from 'react-komposer';
import { showLogin } from '/imports/ui/components/login/modal'; 

export default class AffiliateLink extends React.Component {
    onClickLogin() {
        //e.preventDefault();
        //mixpanel.track('Login - Start'); // FIXME - why does this fire twice?
        //utu.track('Login - Start'); // F
        
        if(!Meteor.userId())
        {
            showLogin({ successRedirect: '/affiliate' });
        }
        else {
           let parentDomain = this.props.currentDomain;
           Meteor.call('urlAffilliation',this.props.currentDomain,function(error,response){
                console.log('response'+ response);
                if(response)
                {
                    window.location = parentDomain +'?affiliatedUrl='+response;
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
                    Affiliation Page
                </Container>
        )
    }
}
//const ComponentWLoginData = composeWithTracker(loginData)(AffiliateLink);
//export default canHOC(ComponentWLoginData, { allowNonVerified: true });

