import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});


export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isSignIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/signin',
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => !state.user.isSignIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/personal',
    allowRedirectBack: false
});
