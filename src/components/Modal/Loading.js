import { PureComponent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

class Loading extends PureComponent {
    render() {
        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress color="success" />
            </div>
        );
    }
}

export default Loading;
