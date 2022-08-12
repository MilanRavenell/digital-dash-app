import React from 'react';
import { batchArray } from '../helpers';
import '../styles/IndividualPostPopUp.css'

const IndividualPostPopUp = ({ post, headers }) => {
    return (
        <div className="IndividualPostPopUp">
            <div className="IndividualPostPopUp-details">
                <div className="IndividualPostPopUp-header">
                    Post
                </div>
                <div className="IndividualPostPopUp-title">
                    {post['Title']}
                </div>
                <div className="IndividualPostPopUp-extra-details">
                    <div className="IndividualPostPopUp-title-date">{post['Date']}</div>
                    <div className="IndividualPostPopUp-title-link">
                        <a href={post['Link']} target="_blank" rel="noreferrer">Link</a>
                    </div>
                </div>
            </div>
            <div className="IndividualPostPopUp-stats">
                {
                    batchArray(headers.filter(header => (header != 'Title' && header != 'Date')), 2).map((batch, batchIndex) => (
                        <div className="IndividualPostPopUp-stats-row" key={batchIndex}>
                        {
                            batch.map((key, keyIndex) => (
                                <div className="IndividualPostPopUp-stats-stat" key={`${keyIndex}-stat`}>
                                    <div>{key}{(key != null) ? ':' : ''}</div>
                                    <div>{post[key]}</div>
                                </div>
                            ))
                        }
                        </div>
                    ))
                }
            </div>
            <div className="IndividualPostPopUp-engagements">

            </div>
        </div>
    );
}

export default IndividualPostPopUp;