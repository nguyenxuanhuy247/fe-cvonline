import actionNames from './actionNames';
import * as userService from '~/services';
import { Toast } from '~/components/Toast/Toast.js';

// USER SIGN UP - CREATE USER INFORMATION
export const userSignUpStart = (userData) => {
    return async (dispatch) => {
        dispatch({ type: actionNames.USER_SIGNUP_START });
        try {
            let res = await userService.postSignUp(userData);
            const { errorCode, errorMessage } = res ?? {};
            if (errorCode === 0) {
                Toast.TOP_CENTER_SUCCESS(errorMessage, 3000);
                dispatch(userSignUpSuccess());
            } else {
                Toast.TOP_CENTER_ERROR(errorMessage, 3000);
                dispatch(userSignUpFail());
            }
        } catch (error) {
            const { errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage || error.message, 3000);
            dispatch(userSignUpFail());
            console.log('An error in userSignUpStart() - userActions.js: ', error);
        }
    };
};

export const userSignUpSuccess = () => ({
    type: actionNames.USER_SIGNUP_SUCCESS,
});

export const userSignUpFail = () => ({
    type: actionNames.USER_SIGNUP_FAIL,
});

// USER SIGN IN
export const userSignInStart = (userData) => {
    return async (dispatch) => {
        dispatch({ type: actionNames.USER_SIGNIN_START });
        try {
            let res = await userService.postSignIn(userData.email, userData.password);
            const { errorCode, errorMessage, data } = res;
            if (errorCode === 0) {
                Toast.TOP_CENTER_SUCCESS(errorMessage, 3000);
                dispatch(userSignInSuccess(data));
            } else {
                Toast.TOP_CENTER_ERROR(errorMessage, 3000);
                dispatch(userSignInFail());
            }
        } catch (error) {
            const { errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 3000);
            dispatch(userSignInFail());
            console.log('An error in userSignInStart() - userActions.js: ', error);
        }
    };
};

export const userSignInSuccess = (user) => ({
    type: actionNames.USER_SIGNIN_SUCCESS,
    payload: user,
});

export const userSignInFail = () => ({
    type: actionNames.USER_SIGNIN_FAIL,
});

// USER SIGN OUT
export const userSignOut = () => {
    return {
        type: actionNames.USER_SIGNOUT,
    };
};

// =================================================================
// CRUD USER INFORMATION

// READ USER INFORMATION
export const readUserInformation = (userId) => {
    return async (dispatch) => {
        dispatch(ReadUserInformation_Start());
        try {
            const res = await userService.readUserInformation(userId);
            const { errorCode, data } = res ?? {};

            dispatch(ReadUserInformation_Success(data));

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in readUserInformation() - userActions.js: ', error);

            return errorCode;
        }
    };
};

export const ReadUserInformation_Start = () => ({
    type: `READ_USER_INFORMATION_START`,
});

export const ReadUserInformation_Success = (data) => ({
    type: `READ_USER_INFORMATION_SUCCESS`,
    payload: data,
});

export const ReadUserInformation_Failure = () => ({
    type: `READ_USER_INFORMATION_FAILURE`,
});

// UPDATE USER INFORMATION
export const updateUserInformation = (data) => {
    return async () => {
        try {
            let res = await userService.updateUserInformation(data);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 4000);
            console.log('An error in updateTechnology() - userActions.js: ', error);

            return errorCode;
        }
    };
};

// =================================================================
// CRUD PRODUCT LIST

// CREATE PRODUCT
export const createProduct = (userId) => {
    return async () => {
        try {
            const res = await userService.createProduct(userId);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in createProduct() - userActions.js: ', error);

            return errorCode;
        }
    };
};

// READ PRODUCT LIST
export const readProductList = (userId) => {
    return async (dispatch) => {
        dispatch(readProductList_Start());
        try {
            const res = await userService.readProductList(userId);
            const { errorCode, errorMessage, data } = res ?? {};
            if (errorCode === 0) {
                dispatch(readProductList_Success(data));

                return errorCode;
            } else {
                Toast.TOP_CENTER_ERROR(errorMessage, 5000);
                dispatch(readProductList_Failure());

                return errorCode;
            }
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            dispatch(readProductList_Failure());
            console.log('An error in readProductList() - userActions.js: ', error);

            return errorCode;
        }
    };
};

export const readProductList_Start = () => ({
    type: `READ_PRODUCT_LIST_START`,
});

export const readProductList_Success = (data) => ({
    type: `READ_PRODUCT_LIST_SUCCESS`,
    payload: data,
});

export const readProductList_Failure = () => ({
    type: `READ_PRODUCT_LIST_FAILURE`,
});

// UPDATE PRODUCT
export const updateProduct = (data) => {
    return async () => {
        try {
            const res = await userService.updateProduct(data);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in updateProduct() - userActions.js: ', error);

            return errorCode;
        }
    };
};

// DELETE PRODUCT
export const deleteProduct = (userId, productId) => {
    return async () => {
        try {
            const res = await userService.deleteProduct(userId, productId);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in deleteProduct() - userActions.js: ', error);

            return errorCode;
        }
    };
};

// =================================================================================================
// CRUD TECHNOLOGY

// CREATE TECHNOLOGY
export const createTechnology = (data) => {
    return async () => {
        try {
            let res = await userService.createTechnology(data);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in createTechnology() - userActions.js: ', error);

            return errorCode;
        }
    };
};

// UPDATE TECHNOLOGY
export const updateTechnology = (data) => {
    return async () => {
        try {
            let res = await userService.updateTechnology(data);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in updateTechnology() - userActions.js: ', error);
            return errorCode;
        }
    };
};

// DELETE TECHNOLOGY
export const deleteTechnology = (technologyId, label) => {
    return async () => {
        try {
            let res = await userService.deleteTechnology(technologyId, label);
            const { errorCode } = res ?? {};

            return errorCode;
        } catch (error) {
            const { errorCode, errorMessage } = error.response?.data ?? {};
            Toast.TOP_CENTER_ERROR(errorMessage, 5000);
            console.log('An error in deleteTechnology() - userActions.js: ', error);
            return errorCode;
        }
    };
};
