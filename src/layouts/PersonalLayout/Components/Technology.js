import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import Button from '~/components/Button/Button.js';
import styles from './Technology.module.scss';
import Image from '~/components/Image/Image.js';
import EditButton from '~/components/Button/EditButton';
import { JpgImages } from '~/components/Image/Images.js';
import CreateEditTechnology from '~/layouts/PersonalLayout/Components/CreateEditTechnology.js';

const cx = classnames.bind(styles);
class Technology extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,

            id: undefined,
            image: undefined,
            name: undefined,
            version: undefined,
            link: undefined,
        };

        this.idTimeout = React.createRef();
    }

    // =================================================================
    handleShowEditTechnology = async (id, editButtonID) => {
        const editButton = document.getElementById(editButtonID);

        // Hide Edit Button
        if (editButton) {
            editButton.style.display = 'none';
        }

        this.props.onCloseCreateTechnology();

        let selectedLibrary;
        const libraryList = this.props.librarylist;
        if (libraryList) {
            selectedLibrary = libraryList.find((library) => {
                return library.id === id;
            });
        }

        await this.setState({
            isEdit: true,
            id: selectedLibrary.id,
            image: selectedLibrary.image,
            name: selectedLibrary.name,
            version: selectedLibrary.version,
            link: selectedLibrary.link,
        });
    };

    handleCloseEditTechnology = () => {
        this.setState({ isEdit: false });
    };

    handleDeleteTechnology = (technologyId) => {
        this.props.onDeleteTechnology(technologyId, this.props.label);
    };

    // =================================================================
    // Hover and Unhover Button and Edit Button
    handleHoverButtonAndShowEditButton = (editButtonID, buttonID) => {
        const editButton = document.getElementById(editButtonID);
        const button = document.getElementById(buttonID);

        if (button) {
            // After sorting, mouse keep hovering button
            button.onmouseover = () => {
                button.classList.add(cx('hover-button'));

                if (editButton) {
                    editButton.style.display = 'flex';
                }
            };
        }
    };

    handleUnhoverButtonAndHideEditButton = (editButtonID, buttonID) => {
        const editButton = document.getElementById(editButtonID);
        const button = document.getElementById(buttonID);

        if (button) {
            button.classList.remove(cx('hover-button'));

            if (editButton) {
                this.idTimeout.current = setTimeout(() => (editButton.style.display = 'none'), 0);
            }
        }
    };

    handleDragButton = (editButtonID) => {
        const dragEditButton = document.getElementById(editButtonID);

        if (dragEditButton) {
            dragEditButton.style.display = 'none';
        }
    };

    handleClickToButton = (editButtonID) => {
        const dragEditButton = document.getElementById(editButtonID);

        if (dragEditButton) {
            dragEditButton.style.display = 'flex';
        }
    };

    handleHoverEditButton = (buttonID) => {
        // Skip hide Edit button
        clearTimeout(this.idTimeout.current);

        // Still Hover Button
        const button = document.getElementById(buttonID);

        if (button) {
            button.classList.add(cx('hover-button'));
        }
    };

    handleUnhoverEditButton = (editButtonID, buttonID) => {
        const editButton = document.getElementById(editButtonID);
        const button = document.getElementById(buttonID);

        // Unhover Button
        if (button) {
            button.classList.remove(cx('hover-button'));

            if (editButton) {
                editButton.style.display = 'none';
            }
        }
    };

    // =================================================================

    componentDidUpdate() {
        if (this.props.isCloseEditTechnology === true) {
            this.setState({ isEdit: false });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.idTimeout.current);
    }

    render() {
        const {
            draggable,
            label,
            type,
            productId,
            keyprop,
            href,
            id,
            side,
            src,
            name,
            version,
            onDragStart,
            onDragEnd,
            onDragEnter,
            onDragOver,
            onDrop,
        } = this.props;

        const dragDropAPIProps = {
            onDragStart,
            onDragEnd,
            onDragEnter,
            onDragOver,
            onDrop,
        };

        const ID = side ? `${side}-${type}-${id}` : `${type}-${id}`;
        const editButtonID = side ? `js-edit-button-${ID}` : `js-edit-button-${ID}`;
        const buttonID = side ? `js-button-${ID}` : `js-button-${ID}`;

        return !this.state.isEdit ? (
            <HeadlessTippy
                placement="bottom"
                offset={[0, 4]}
                render={(attrs) => (
                    <div tabIndex="-1" {...attrs}>
                        {href && <div className={cx('library-href')}>{href}</div>}
                    </div>
                )}
            >
                <div id={`js-container-button-${type}-${id}`} className={cx('button-container')}>
                    <EditButton
                        editButtonID={editButtonID}
                        side={side}
                        type={type}
                        // =================================================================
                        onShowCreateTechnology={this.props?.onShowCreateTechnology}
                        onShowEditTechnology={() => this.handleShowEditTechnology(id, editButtonID)}
                        onDeleteTechnology={() => this.handleDeleteTechnology(id)}
                        // =================================================================
                        onMouseEnter={() => this.handleHoverEditButton(buttonID)}
                        onMouseLeave={(className) => this.handleUnhoverEditButton(editButtonID, buttonID, className)}
                        classHover={cx('hover-button')}
                        // =================================================================
                        dragDropAPIProps={dragDropAPIProps}
                    />
                    <Button
                        id={buttonID}
                        className={cx('button', {
                            'sourcecode-list': type === 'SOURCECODE',
                            'technology-list': type === 'TECHNOLOGY',
                            'library-list': type === 'LIBRARY',
                        })}
                        // =================================================================
                        onMouseEnter={() => this.handleHoverButtonAndShowEditButton(editButtonID, buttonID)}
                        onMouseLeave={() => this.handleUnhoverButtonAndHideEditButton(editButtonID, buttonID)}
                        onMouseDown={() => this.handleDragButton(editButtonID)}
                        onMouseUp={() => this.handleClickToButton(editButtonID)}
                        // =================================================================
                        draggable={draggable}
                        href={href}
                        dragDropAPIProps={dragDropAPIProps}
                    >
                        {type === 'TECHNOLOGY' ? (
                            src && <Image src={src || JpgImages.imagePlaceholder} className={cx('image')} />
                        ) : (
                            <Image src={src || JpgImages.imagePlaceholder} className={cx('image')} />
                        )}

                        {name && (
                            <span className={cx('name')} id={`js-name-button-${type}-${id}`}>
                                {name}
                            </span>
                        )}
                        {version && <span className={cx('version')}>{version}</span>}
                    </Button>
                </div>
            </HeadlessTippy>
        ) : (
            <CreateEditTechnology
                id={`js-edit-technology-${id}`}
                isedit
                data={this.state}
                type={type}
                label={label}
                keyprop={keyprop}
                productId={productId}
                onCloseCreateTechnology={this.handleCloseEditTechnology}
                onUpdateTechnology={this.props.onUpdateTechnology}
            />
        );
    }
}

export default Technology;
