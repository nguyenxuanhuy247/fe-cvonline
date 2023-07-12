import React, { Component } from 'react';
import { connect } from 'react-redux';
import className from 'classnames/bind';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { Redirect, Route } from 'react-router-dom';

import styles from './Signup.module.scss';
import logoWithText from '~/assets/logo/logo-with-text.png';
import Validator from '~/components/formValidation/formValidation.js';
import * as userActions from '~/store/actions/userActions.js';
import { path } from '~/utils';
import FacebookGoogle from './FacebookGoogle.js';
import Button from '~/components/Button/Button.js';
import Loading from '~/components/Modal/Loading.js';

const cx = className.bind(styles);

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            email: '',
            password: '',
            passwordConfirmation: '',

            isShowPassword: false,
            delayRedirect: false,
        };
    }

    id = React.createRef();

    handleChangeInputField = (event, inputName) => {
        this.setState({ [inputName]: event.target.value });
    };

    handleShowHidePassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleValidateForm = () => {
        Validator(
            {
                formSelector: `.${cx('form-signup')}`,
                formGroupSelector: `.${cx('form-group')}`,
                messageSelector: `.${cx('form-message')}`,
                rules: [
                    Validator.isRequired(`#${cx('fullName')}`),
                    Validator.isRequired(`#${cx('email')}`),
                    Validator.isEmail(`#${cx('email')}`),
                    Validator.isRequired(`#${cx('password')}`),
                    Validator.minLength(`#${cx('password')}`, 6),
                    Validator.isRequired(`#${cx('password_confirmation')}`),
                    Validator.isConfirmed(`#${cx('password_confirmation')}`, () => {
                        return document.querySelector(`#${cx('password')}`).value;
                    }),
                ],
            },
            cx('invalid'),
            this.props.userSignUp,
        );
    };

    componentDidMount = () => {
        this.handleValidateForm();
    };

    componentDidUpdate(prevProps) {
        if (this.props.isSignUp !== prevProps.isSignUp) {
            this.id.current = setTimeout(() => this.setState({ delayRedirect: true }), 2000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.id.current);
    }

    render() {
        let Eye = this.state.isShowPassword ? FaEye : FaEyeSlash;
        let { isLoading } = this.props;
        const { delayRedirect } = this.state;

        return (
            <Route exact path={path.SIGNUP}>
                {delayRedirect ? (
                    <Redirect to={path.SIGNIN} />
                ) : (
                    <>
                        <div className={cx('signup-container')}>
                            <form className={cx('form-signup')} autoComplete="on">
                                <img src={logoWithText} alt="mycompany" className={cx('form-logo')} />
                                <p className={cx('title')}>Chào mừng bạn đến với CV.com</p>

                                <div className={cx('form-group')}>
                                    <div className={cx('form-input')}>
                                        <label htmlFor="fullName" className={cx('form-label')}>
                                            Họ và tên
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            spellCheck="false"
                                            placeholder="VD: Nguyễn Xuân Huy"
                                            className={cx('form-control')}
                                            value={this.state.fullName}
                                            onChange={(event) => this.handleChangeInputField(event, 'fullName')}
                                        />
                                    </div>
                                    <span className={cx('form-message')}></span>
                                </div>

                                <div className={cx('form-group')}>
                                    <div className={cx('form-input')}>
                                        <label htmlFor="email" className={cx('form-label')}>
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            spellCheck="false"
                                            placeholder="VD: nguyenxuanhuy@gmail.com"
                                            className={cx('form-control')}
                                            value={this.state.email}
                                            onChange={(event) => this.handleChangeInputField(event, 'email')}
                                        />
                                    </div>
                                    <span className={cx('form-message')}></span>
                                </div>

                                <div className={cx('form-group')}>
                                    <div className={cx('form-input')}>
                                        <label htmlFor="password" className={cx('form-label')}>
                                            Mật khẩu
                                        </label>
                                        <input
                                            id="password"
                                            name="password"
                                            spellCheck="false"
                                            type={this.state.isShowPassword ? 'type' : 'password'}
                                            placeholder="VD: Abc123456@#"
                                            className={cx('form-control')}
                                            value={this.state.password}
                                            onChange={(event) => this.handleChangeInputField(event, 'password')}
                                        />
                                        <div className={cx('toggle-show-password')}>
                                            <Eye className={cx('eye')} onClick={() => this.handleShowHidePassword()} />
                                        </div>
                                    </div>
                                    <span className={cx('form-message')}></span>
                                </div>

                                <div className={cx('form-group')}>
                                    <div className={cx('form-input')}>
                                        <label htmlFor="password_confirmation" className={cx('form-label')}>
                                            Nhập lại mật khẩu
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            spellCheck="false"
                                            placeholder="VD: Abc123456@#"
                                            type={this.state.isShowPassword ? 'type' : 'password'}
                                            className={cx('form-control')}
                                            value={this.state.confirmPassword}
                                            onChange={(event) =>
                                                this.handleChangeInputField(event, 'passwordConfirmation')
                                            }
                                        />
                                        <div className={cx('toggle-show-password')}>
                                            <Eye className={cx('eye')} onClick={() => this.handleShowHidePassword()} />
                                        </div>
                                    </div>
                                    <span className={cx('form-message')}></span>
                                </div>
                                <Button className={cx('submit-btn')}>Đăng ký</Button>
                            </form>

                            <p className={cx('signin-with')}>Hoặc đăng ký bằng :</p>
                            <FacebookGoogle />
                            <div className={cx('switch-signin')}>
                                <span className={cx('text')}>Bạn chưa có tài khoản?</span>
                                <Button className={cx('signin-btn')} route="/signin">
                                    Đăng nhập
                                </Button>
                            </div>
                        </div>

                        {isLoading && <Loading style={{ position: 'fixed' }} />}
                    </>
                )}
            </Route>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isSignUp: state.user.isSignUp,
        isLoading: state.user.isLoading.signup,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        userSignUp: (dataUser) => dispatch(userActions.userSignUpStart(dataUser)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
