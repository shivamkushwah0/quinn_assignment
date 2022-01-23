import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import ExpandedTile from './ExpandedTile'
import { useSelector } from "react-redux";

const CardsCarousel = (props) => {
    const Posts = useSelector(state => state.Posts);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        Posts.forEach((post, postIndex) => {
            if (post.calendardatetime === props.active) {
                setIndex(postIndex)
            }
        });
    }, [])
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return (
        <div className="flex flex-ai-center flex-jc-center modalback">
            <div className="close-btn" onClick={props.toggle}><img src='/images/close.svg' /></div>
            <Carousel style={{ width: "90%", height : "90%", marginTop : "30px"}} indicators={false} activeIndex={index} onSelect={handleSelect}>
                {
                    Posts.map(el => {
                        return <Carousel.Item interval={1000000} style={{borderRadius : "8px"}}>
                            <ExpandedTile postDetails={el} />
                        </Carousel.Item>
                    })
                }
            </Carousel>
        </div>
    )
}

export default CardsCarousel
