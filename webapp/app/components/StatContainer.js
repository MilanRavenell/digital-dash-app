import React from 'react';
import '../styles/StatContainer.css';

class StatContainer extends React.Component {
    render() {
        return(
            <div className="StatContainer">
                {
                    (this.props.name != null) && (
                        <div className="StatContainer-inner">
                            <div className="StatContainer-content">
                                <div className="StatContainer-title"> { this.props.name } </div>
                                <div className="StatContainer-value"> { this.props.value } </div>
                                <div className="StatContainer-footer"/>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default StatContainer;