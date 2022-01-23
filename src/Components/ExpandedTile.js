import React from 'react'
import Star from './icons/Star'
import { legendNames } from './utils/constants';

const ExpandedTile = (props) => {
    // console.log(pro)
    // if(props.postDetails === undefined)
        // console.log(props)
    const parseTime = (stringDate) => {
        const date = new Date(stringDate);
        return date.toDateString();
    };

    const getStars = (rating) => {
        return [1, 2, 3, 4, 5].map(el => {
            return <Star className={`mystar ${rating >= el ? "filled" : "unfilled"}`} />
        })
    };

    return (
        <div className="tile-bg xtile">
            <div className="xtile-img">
                <img src={props.postDetails.media[0].mediaurl} style={{height:"100%",backgroundSize:"cover",width:"100%",objectFit:"cover"}} alt="" />
            </div>
            <div className="xtile-container">
                <div className="flex" style={{ justifyContent: "space-between" }}>
                    <div className="flex" style={{ width: "60%", justifyContent: "space-evenly" }}>
                        {
                            props.postDetails.typeofday != null ? 
                            props.postDetails.typeofday.map(type => {
                                return <div className={`bubble bubble-bg bubble-${legendNames[type]} flex flex-ai-center flex-jc-center`}>
                                    {legendNames[type]}
                                </div>
                            }) : null
                        }
                    </div>
                    <div className="flex">
                        {getStars(props.postDetails.rating)}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: "larger" }}>
                        <b>
                            {parseTime(props.postDetails.calendardatetime)}
                        </b>
                    </div>
                    <div className="xtile-desc">
                        {props.postDetails.text}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpandedTile
