import React, { useEffect } from 'react'
import Star from './icons/Star'
import { legendNames } from './utils/constants';

const Tiles = (props) => {
    if (props.day === null) return <div className="tile"></div>;
    if (props.hasPost === false) return (
        <div className="tile flex">
            <div className={`tile-day ${props.isToday ? "today" : ""}`} style={{ fontSize: "16px" }}>
                {props.day}
            </div>
        </div>
    );

    const getStars = (rating) => {
        return [1, 2, 3, 4, 5].map(el => {
            return <Star className={`mystar ${rating >= el ? "filled" : "unfilled"}`} />
        })
    }

    return (
        <div className="tile flex-col">
            <div className="tile-day flex flex-ai-center" style={{ flexDirection:"column" }}>
               
                <div style={{ fontSize: "16px" }} className={`${props.isToday ? "today" : ""}`}>
                    {props.day}
                </div>

                <div className="flex star-rating">
                    {getStars(props.postDetails.rating)}
                </div>
                
            </div>
            <div className="tile-img">
                <img draggable={false} src={props.postDetails.media[0].mediaurl}
                    style={{ width: "100%", height: "90%",objectFit: "cover" }}
                    alt="" />
            </div>
            <div className="tile-legends flex flex-ai-center" style={{ justifyContent: "center", width: "100%" }}>
                {
                    props.postDetails.typeofday !== null ? props.postDetails.typeofday.map(type => {
                        return <div className={`bubble flex flex-ai-center flex-jc-center bubble-${legendNames[type]}`}>
                            {legendNames[type]}
                        </div>
                    }) : null
                }
            </div>
        </div>
    )
}

export default Tiles
