import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import { BsKeyboard } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { GrClose } from 'react-icons/gr';
import DefaultTippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';

import styles from './SearchBar.module.scss';
import Button from '~/components/Button/Button.js';
import Image from '~/components/Image/Image.js';

const cx = classnames.bind(styles);

class SearchBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { searchValue: '', loading: false, visible: false };
    }

    handleInputValue = async (e) => {
        const clearInputValueButton = document.getElementById('js-clear-input-value-button');

        await this.setState({ searchValue: e.target.value, visible: true });

        const value = e.target.value?.trim();

        if (value) {
            const notFoundElement = document.querySelector(`.${cx('not-found-result')}`);

            if (clearInputValueButton) {
                clearInputValueButton.classList.remove(cx('hide'));
            }

            notFoundElement?.classList.add(cx('hide'));

            this.props.productList?.forEach((product) => {
                const productElement = document.getElementById(`js-product-${product.id}`);
                const productSearchResult = document.getElementById(`js-short-search-result-${product.id}`);
                const productName = document.getElementById(`js-search-result-name-${product.id}`);
                const productDesc = document.getElementById(`js-search-result-desc-${product.id}`);

                if (productElement && productSearchResult && productName && productDesc) {
                    productSearchResult.style.display = 'flex';

                    const isIncludesName = productName.innerHTML.toLowerCase().includes(value?.trim().toLowerCase());
                    const isIncludesDesc = productDesc.innerHTML.toLowerCase().includes(value?.trim().toLowerCase());
                    if (isIncludesName || isIncludesDesc) {
                        productSearchResult.onclick = () => {
                            productElement.scrollIntoView();
                            this.setState({ visible: false });
                        };
                    } else {
                        productSearchResult.style.display = 'none';
                    }
                }
            });

            const searchResultArrary = document.querySelectorAll('[id*=js-short-search-result');
            if (searchResultArrary) {
                const isAllNone = Array.from(searchResultArrary).every((node) => {
                    return node.getAttribute('style') === 'display: none;';
                });

                if (isAllNone) {
                    notFoundElement.classList.remove(cx('hide'));
                }
            }
        } else {
            if (clearInputValueButton) {
                clearInputValueButton.classList.add(cx('hide'));
            }
            this.setState({ searchValue: e.target.value, visible: false });
        }
    };

    handleClearInputValue = () => {
        const clearInputValueButton = document.getElementById('js-clear-input-value-button');
        clearInputValueButton?.classList.add(cx('hide'));

        this.setState({ searchValue: '', visible: false });
    };

    render() {
        const { className } = this.props;

        return (
            <div className={cx('container', className)}>
                <div style={{ width: '100%' }}>
                    <HeadlessTippy
                        visible={this.state.visible}
                        onClickOutside={() => this.setState({ visible: false })}
                        zIndex="10"
                        placement="bottom"
                        interactive
                        delay={[0, 300]}
                        offset={[0, 10]}
                        render={(attrs) => (
                            <div tabIndex="-1" {...attrs}>
                                <div className={cx('search-result-tooltip')}>
                                    <div className={cx('search-result-container')} id="js-container-search-result">
                                        {this.props.productList?.map((product, index) => {
                                            const productDescResult = document.getElementById(
                                                `js-search-result-desc-${product.id}`,
                                            );

                                            if (productDescResult) {
                                                productDescResult.innerText = product.desc;
                                            }

                                            return (
                                                <div
                                                    key={index}
                                                    className={cx('short-search-result')}
                                                    id={`js-short-search-result-${product.id}`}
                                                >
                                                    <div className={cx('product-name-desc')}>
                                                        <p
                                                            className={cx('product-name')}
                                                            id={`js-search-result-name-${product.id}`}
                                                        >
                                                            {product.name}
                                                        </p>
                                                        <p
                                                            className={cx('product-desc')}
                                                            id={`js-search-result-desc-${product.id}`}
                                                        ></p>
                                                    </div>
                                                    <Image src={product.image} className={cx('product-image')} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className={cx('not-found-result', 'hide')}>Không tìm thấy sản phẩm nào</p>
                                </div>
                            </div>
                        )}
                    >
                        <div className={cx('search-bar')}>
                            <input
                                className={cx('search-input')}
                                value={this.state.searchValue}
                                placeholder="Tìm kiếm sản phẩm"
                                spellCheck={false}
                                onChange={(e) => this.handleInputValue(e)}
                                onFocus={(e) => this.handleInputValue(e)}
                            />

                            <DefaultTippy content="Bàn phím ảo" arrow="">
                                <Button className={cx('keyboard')}>
                                    <BsKeyboard />
                                </Button>
                            </DefaultTippy>

                            <DefaultTippy content="Xóa" arrow="">
                                <Button
                                    className={cx('clear', 'hide')}
                                    onClick={() => this.handleClearInputValue()}
                                    id="js-clear-input-value-button"
                                >
                                    <GrClose />
                                </Button>
                            </DefaultTippy>

                            <DefaultTippy content="Tìm kiếm" arrow="">
                                <Button className={cx('magnify')}>
                                    <FiSearch />
                                </Button>
                            </DefaultTippy>
                        </div>
                    </HeadlessTippy>
                </div>
            </div>
        );
    }
}

export default SearchBar;
