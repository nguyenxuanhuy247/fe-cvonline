import { PureComponent } from 'react';
import className from 'classnames/bind';
import { Switch, Route } from 'react-router-dom';

import styles from './AuthLayout.module.scss';
import SignIn from './Components/Signin.js';
import SignUp from './Components/Signup.js';
import { path } from '~/utils';

const cx = className.bind(styles);

class Auth extends PureComponent {
    render() {
        return (
            <div className={cx('auth-container')}>
                <div  className={cx('inner')}>
                    <Switch>
                        <Route path={path.SIGNIN} component={SignIn} />
                        <Route path={path.SIGNUP} component={SignUp} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Auth;
