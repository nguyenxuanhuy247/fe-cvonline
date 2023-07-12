import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import className from 'classnames/bind';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

import logoWithText from '~/assets/logo/logo-with-text.png';
import Validator from '~/components/formValidation/formValidation.js';
import styles from './Signin.module.scss';
import * as userActions from '~/store/actions';
import FacebookGoogle from './FacebookGoogle.js';
import Button from '~/components/Button/Button.js';
import Loading from '~/components/Modal/Loading.js';
import { path } from '~/utils';

const cx = className.bind(styles);

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            isShowPassword: false,
            prevFormData: {},
            delayRedirect: false,
        };
    }

    id = React.createRef();

    handleOnChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    handleOnChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleShowHidePassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleValidateForm = () => {
        Validator(
            {
                formSelector: `.${cx('form-signin')}`,
                formGroupSelector: `.${cx('form-group')}`,
                messageSelector: `.${cx('form-message')}`,
                rules: [
                    Validator.isRequired(`#${cx('email')}`),
                    Validator.isEmail(`#${cx('email')}`),
                    Validator.isRequired(`#${cx('password')}`),
                    Validator.minLength(`#${cx('password')}`, 6),
                ],
            },
            cx('invalid'),
            this.props.userSignIn,
        );
    };

    componentDidUpdate(prevProps) {
        if (this.props.isSignIn !== prevProps.isSignIn) {
            this.id.current = setTimeout(() => this.setState({ delayRedirect: true }), 1000);
        }
    }

    componentDidMount = () => {
        this.handleValidateForm();
    };

    componentWillUnmount() {
        clearInterval(this.id.current);
    }

    render() {
        let Eye = this.state.isShowPassword ? FaEye : FaEyeSlash;
        let { isLoading } = this.props;
        const { delayRedirect } = this.state;

        return (
            <Route exact path={path.SIGNIN}>
                {delayRedirect ? (
                    <Redirect to={path.HOME} />
                ) : (
                    <>
                        <div className={cx('signin-container')}>
                            <form className={cx('form-signin')} autoomplete="on">
                                <img src={logoWithText} alt="mycompany" className={cx('form-logo')} />
                                <p className={cx('title')}>Chào mừng bạn đã quay trở lại</p>

                                <div className={cx('form-group')}>
                                    <div className={cx('form-input')}>
                                        <label htmlFor="email" className={cx('form-label')}>
                                            <MdEmail className={cx('form-icon')} />
                                        </label>
                                        <input
                                            type="email"
                                            className={cx('form-control')}
                                            id="email"
                                            placeholder="Nhập email của bạn"
                                            name="email"
                                            spellCheck={false}
                                            value={this.state.email}
                                            onChange={(event) => this.handleOnChangeEmail(event)}
                                        />
                                    </div>
                                    <p className={cx('form-message')}></p>
                                </div>

                                <div className={cx('form-group')}>
                                    <div className={cx('form-input')}>
                                        <label htmlFor="password" className={cx('form-label')}>
                                            <RiLockPasswordFill className={cx('form-icon')} />
                                        </label>
                                        <input
                                            type={this.state.isShowPassword ? 'text' : 'password'}
                                            className={cx('form-control')}
                                            id="password"
                                            placeholder="Nhập mật khẩu"
                                            name="password"
                                            spellCheck={false}
                                            value={this.state.password}
                                            onChange={(event) => this.handleOnChangePassword(event)}
                                        />
                                        <div className={cx('toggle-show-password')}>
                                            <Eye className={cx('eye')} onClick={() => this.handleShowHidePassword()} />
                                        </div>
                                    </div>
                                    <span className={cx('form-message')}></span>
                                </div>

                                <a href="#!" className={cx('forgot-password')}>
                                    Quên mật khẩu?
                                </a>
                                <Button className={cx('submit-btn')}>Đăng nhập</Button>
                            </form>

                            <p className={cx('signin-with')}>Hoặc đăng nhập bằng :</p>

                            <FacebookGoogle />

                            <div className={cx('switch-signup')}>
                                <span className={cx('text')}>Bạn chưa có tài khoản?</span>
                                <Button className={cx('signup-btn')} route="/signup">
                                    Đăng ký
                                </Button>
                            </div>
                        </div>
                        {isLoading && <Loading />}
                    </>
                )}
            </Route>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignIn: state.user.isSignIn,
        isLoading: state.user.isLoading.signin,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSignIn: (userData) => dispatch(userActions.userSignInStart(userData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
