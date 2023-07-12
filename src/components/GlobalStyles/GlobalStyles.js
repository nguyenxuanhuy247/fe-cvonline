import { PureComponent } from 'react';
import './GlobalStyles.module.scss';
class GlobalStyles extends PureComponent {
    render() {
        return <>{this.props.children}</>;
    }
}

export default GlobalStyles;
