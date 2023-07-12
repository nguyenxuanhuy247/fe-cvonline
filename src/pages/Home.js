import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {
    render() {
        const { isSignIn } = this.props;
        let linkToRedirect = isSignIn ? '/' : '/signin';
        return <Redirect to={linkToRedirect} />;
    }
}

const mapStateToProps = (state) => {
    return {
        isSignIn: state.user.isSignIn,
    };
};
export default connect(mapStateToProps, null)(Home);
