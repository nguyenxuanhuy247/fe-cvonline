import { BsArrowRight } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import { MdOutlineLanguage } from 'react-icons/md';

export const MENU_AVATAR_DATA = [
    {
        id: 11,
        leftIcon: <FaUserTie />,
        title: 'Tài khoản',
        rightIcon: <BsArrowRight />,
        to: '/feedback',
    },
    {
        id: 12,
        leftIcon: <MdOutlineLanguage />,
        title: 'Tiếng Việt',
        rightIcon: <BsArrowRight />,
        separate: true,
        children: {
            title: 'Ngôn ngữ',
            data: [
                {
                    id: 21,
                    type: 'Ngôn ngữ',
                    code: 'en',
                    title: 'English',
                },
                {
                    id: 22,
                    type: 'Ngôn ngữ',
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },
    {
        id: 13,
        leftIcon: <MdOutlineLogout />,
        title: 'Đăng xuất',
        rightIcon: <BsArrowRight />,
    },
];
