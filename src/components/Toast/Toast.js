import { toast } from 'react-toastify';

// TOP - CENTER

const TOP_CENTER_SUCCESS = (text, ms) => {
    return toast.success(text, {
        position: 'top-center',
        autoClose: ms,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};

const TOP_CENTER_ERROR = (text, ms) => {
    return toast.error(text, {
        position: 'top-center',
        autoClose: ms,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};

const TOP_CENTER_WARN = (text, ms) => {
    return toast.warn(text, {
        position: 'top-center',
        autoClose: ms,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};

const TOP_CENTER_INFO = (text, ms) => {
    return toast.info(text, {
        position: 'top-center',
        autoClose: ms,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
};

export const Toast = {
    TOP_CENTER_SUCCESS,
    TOP_CENTER_ERROR,
    TOP_CENTER_WARN,
    TOP_CENTER_INFO,
};
