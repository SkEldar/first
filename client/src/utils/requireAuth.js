import React from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';
import {browserHistory} from 'react-router';

export default function(ComposedComponent) {
class Authenticate extends React.Component {
    componentWillMount() {
        if (!this.props.isAuthenticated) {
            this.props.addFlashMessage({
                type : 'error',
                text : 'You need to login to access this page'
            });
            browserHistory.push('/login');
        }
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.isAuthenticated) {
            browserHistory.push('/login');
        }
    }

    render() {
        return (
            <ComposedComponent {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated : state.auth.isAuthenticated
    }
}

return connect (mapStateToProps, {addFlashMessage}) (Authenticate);
}
