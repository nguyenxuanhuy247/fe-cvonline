import axios from '~/config/axios.js';

// =============================================================================
// HANDLE SIGNUP
export const postSignUp = (userData) => {
    return axios.post(`/signup`, {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
    });
};

// HANDLE SIGNIN
export const postSignIn = (userEmail, userPassword) => {
    return axios.post(`/signin`, {
        email: userEmail,
        password: userPassword,
    });
};

// =============================================================================
// CRUD USER INFORMATION

export const readUserInformation = (userId) => {
    return axios.get(`/get-user-information?userId=${userId}`);
};

export const updateUserInformation = (data) => {
    return axios.put('/put-user-information', data);
};

// =============================================================================
// CRUD PRODUCT

export const createProduct = (userId) => {
    return axios.post(`/post-product?userId=${userId}`);
};

export const readProductList = (userId) => {
    return axios.get(`/get-product-list?userId=${userId}`);
};

export const updateProduct = (data) => {
    return axios.put(`/put-product`, data);
};

export const deleteProduct = (userId, productId) => {
    return axios.delete(`/delete-product?userId=${userId}&&productId=${productId}`);
};

// =============================================================================
// CRUD TECHNOLOGY

export const createTechnology = (data) => {
    return axios.post('/post-technology', data);
};

export const updateTechnology = (data) => {
    return axios.put('/put-technology', data);
};

export const deleteTechnology = (technologyId, label) => {
    return axios.delete(`/delete-technology?technologyId=${technologyId}&&label=${label}`);
};
