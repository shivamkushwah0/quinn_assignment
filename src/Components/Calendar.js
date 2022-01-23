import React, { useEffect, useRef, useState, useCallback } from 'react';
import "./style.scss";
import { getTilesData } from './utils/endpoint';
import Tiles from './Tiles';
import ExpandedTile from './ExpandedTile';
import CardsCarousel from './CardsCarousel';
import { useDispatch } from "react-redux";
import { _updatePosts } from '../redux/PostsReducer';

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
};
const getStartDay = (year, month) => {
    return new Date(year, month, 1).getDay();
};
const getEndDay = (year, month, nod) => {
    return new Date(year, month, nod).getDay();
};

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const yearArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Calendar = () => {
    const dispatch = useDispatch();
    const [weeks, setWeeks] = useState([
        "s", "m", "t", "w", "th", "f", "sa"
    ]);
    const [CalPages, setCalPages] = useState([]);
    const [currentYear, setcurrentYear] = useState(2022);
    const [yearRange, setYearRange] = useState({
        start : new Date().getFullYear(),
        end : new Date().getFullYear()
    })
    const [currentMonth, setcurrentMonth] = useState(yearArr[new Date().getMonth()]);
    const [prevToken, setprevToken] = useState(null);
    const [hasMore, sethasMore] = useState(true)
    const prevMonth = usePrevious(currentMonth);
    const [Loading, setLoading] = useState(false);
    const [lastPoint, setLastPoint] = useState(null)

    const insertPostsIntoPage = (posts) => {
        // console.log(posts)
        var calpages = CalPages;
        posts.forEach((post, postIndex) => {
            var dateOfPost = new Date(post.calendardatetime);
            var postYear = dateOfPost.getFullYear();
            var postMonth = dateOfPost.getMonth();
            var postDate = dateOfPost.getDate();
            calpages.forEach(page => {
                if (page.year === postYear && page.month === postMonth) {
                    page.tiles.forEach(tile => {
                        if (tile.day === postDate) {
                            tile.postDetails = post;
                            tile.hasPost = true;
                        }
                    })
                }
            });
        });
        console.log(calpages)
        return calpages;
    }

    const getNextData = () => {
        if (hasMore && CalPages.length > 0) {
            setLoading(true);
            // console.log("going to get data")
            getTilesData(prevToken, 100).then(res => {
                const data = res.responseobjects[0];
                if (data.continuationtoken === null) sethasMore(false);
                setprevToken(data.continuationtoken);
                // console.log("going to insert data")
                setCalPages(insertPostsIntoPage(data.posts));
                dispatch(_updatePosts(data.posts));
            })
        }
    }


    const generateYearlyCalendar = (year) => {
        if (!year) return;
        var pages = [];
        var curYear = new Date().getFullYear();
        var curMnth = new Date().getMonth();
        var curDate = new Date().getDate();
        for (let i = 0; i <= 11; i++) {//for each month
            var numberOfDays = getDaysInMonth(year, i);
            var startDay = getStartDay(year, i);
            var tiles = [];
            //push number of blank tiles
            for (var start = 0; start < startDay; start++) {
                tiles.push({
                    day: null,
                    hasPost: false,
                    isToday: false
                })
            }
            for (let dayi = 0; dayi < numberOfDays; dayi++) {
                tiles.push({
                    day: dayi + 1,
                    hasPost: false,
                    isToday: curDate === dayi + 1 && curMnth === i && year === curYear
                })
            };
            pages.push({
                month: i,
                monthName: yearArr[i],
                year,
                tiles
            })
        }
        if(year === currentYear)
        {
            // console.log("setting the yearly calender")
            setCalPages(pages);
        }

        else if(year > currentYear)
        {
            var temp_pages = CalPages;
            pages = temp_pages.concat(pages)
            // console.log(pages)
            setCalPages(pages)
        }   
        else {
            // console.log("really decreasing the year count")
            pages = pages.concat(CalPages)
            // console.log(pages)
            setCalPages(pages)
        }
    };

    useEffect(() => {
        const year = new Date().getFullYear();
        generateYearlyCalendar(year);
    }, []);

    const [hadFirstHit, sethadFirstHit] = useState(false);

    var [scrollDir, setScrollDir] = useState("down")
    
    const  detectMouseWheelDirection = ( e ) =>
    {
        var delta = null,
            direction = false
        ;
        if ( !e ) { // if the event is not provided, we get it from the window object
            e = window.event;
        }
        if ( e.wheelDelta ) { // will work in most cases
            delta = e.wheelDelta / 60;
        } else if ( e.detail ) { // fallback for Firefox
            delta = -e.detail / 2;
        }
        if ( delta !== null ) {
            direction = delta > 0 ? 'up' : 'down';
        }
        return direction;
    }

    const onWheel = (e) => {
        // console.log("this is the onwheel event")
        // console.log("before",scrollDir)
        setScrollDir(detectMouseWheelDirection(e));
        // console.log("after",scrollDir)
    }

    useEffect(()=>{
        window.addEventListener('wheel', onWheel)
    },[])

    const CreateCalenderEntries = (year) => {
            setLoading(true);
            // console.log("calpages is ", CalPages);
            getTilesData(null, 100).then(res => {
                const data = res.responseobjects[0];
                data.posts.reverse()
                if (data.continuationtoken === null) sethasMore(false);
                setprevToken(data.continuationtoken);
                dispatch(_updatePosts(data.posts));
                // console.log("going to insert data");
                setCalPages(insertPostsIntoPage(data.posts));                
                setLoading(false);
                yearArr.forEach((month, monthIndex) => {
                    // console.log(`month-${month}-${year}`);
                    const options = {
                        root : window.document.getElementById(`month-${month}-${year}`) ,
                        threhold : 1.0 
                    }
                    var doc = window.document.getElementById(`month-${month}-${year}`);
                    // console.log(doc)
                    var observer = new IntersectionObserver(function (entries) {
                        if (entries[0].isIntersecting === true) {
                            // doc.scrollIntoView();
                            console.log(entries)
                            console.log(month, year)
                            setcurrentMonth(month);
                            setcurrentYear(year);
                        }
                    });
                    if(doc !== null)
                        observer.observe(doc);
                });
            })
    }

    //to populate initial data
    useEffect(() => {
        // console.log(CalPages);
        if (CalPages.length > 0 && !hadFirstHit) {
            const month = yearArr[new Date().getMonth()];
            const viewDoc = document.getElementById(`month-${month}-${new Date().getFullYear()}`);
            if (viewDoc) {
                viewDoc.scrollIntoView();
            }
            sethadFirstHit(true);
            // const year = new Date().getFullYear
            CreateCalenderEntries(new Date().getFullYear()  )
        }   
    }, [CalPages, hadFirstHit]);

    useEffect(() => {
        // console.log("the current month is ", currentMonth)
        // console.log(currentMonth, currentYear, yearRange.start, scrollDir)
        if(yearArr.indexOf(prevMonth) > yearArr.indexOf(currentMonth)) {            
            getNextData();
        }

        if(yearArr.indexOf(currentMonth) == 11 && currentYear == yearRange.end && scrollDir === 'down')
        {
            // console.log("increasing the year count");
            generateYearlyCalendar(currentYear+1)
            setYearRange({...yearRange, end : yearRange.end+1})
            setLastPoint(null)
            // CreateCalenderEntries(currentYear+1);
        }
        if(yearArr.indexOf(currentMonth) == 0 && currentYear == yearRange.start && scrollDir === 'up')
        {
            // console.log("decreasing the year count");
            generateYearlyCalendar(currentYear-1);
            setYearRange({...yearRange, start : yearRange.start-1})
            setLastPoint(`month-${currentMonth}-${currentYear}`)
            // CreateCalenderEntries(currentYear-1);
        }
    }, [currentMonth]);

    // useEffect(() => {
    //     if(lastPoint !== null)
    //     {
    //         window.document.getElementById(lastPoint).scrollIntoView();
    //         setLastPoint(null)
    //     }
    // })

    useEffect(()=>{
        const start = yearRange.start;
        const end = yearRange.end;
        // console.log(start, end)
        if(scrollDir === 'up')
            CreateCalenderEntries(start)
        else 
            CreateCalenderEntries(end)
    }, [yearRange])


    const [showModal, setshowModal] = useState(false);
    const toggleShowModal = () => setshowModal(!showModal);
    const [ActiveTile, setActiveTile] = useState()
    const handleTileClick = (post, haspost) => {
        if (!haspost) return;
        setActiveTile(post.calendardatetime);
        toggleShowModal();
    }
    return (
        <div className="flex flex-jc-center flex-ai-center" style={{ height: "100vh" }}>
            {showModal && <CardsCarousel toggle={toggleShowModal} active={ActiveTile} />}
            <div className="cal-wrapper">
                <div className="header-wrapper">
                    <div className="cal-header">
                        <div className="cal-month">
                            
                            <h3>my hair diary</h3>
                        </div>
                        <div className="cal-month float-right">
                            <h2>{currentMonth} <span>{currentYear}</span> </h2>
                        </div>
                    </div>

                    <div className="cal-weeks flex">
                        {
                            weeks.map((week, wind) => {
                                return <div key={week} className="cal-weeks-box flex flex-jc-center">
                                    {week}
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="header-wrapper-fake"></div>
                <div className="cal-days" id="caldays" >

                    {CalPages.length > 0 && CalPages.map((page, pageIndex) => {
                        return (
                            <div style={{ paddingBottom: "1rem" }} key={`page${pageIndex}`}>
                                <div className="flex month-name">
                                    {page.monthName}
                                </div>
                                <div className="grid-container" id={`month-${page.monthName}-${page.year}`} >
                                    {
                                        page.tiles.map((tile, tileIndex) => {
                                            return <div className={`grid-item`} onClick={() => handleTileClick(tile.postDetails, tile.hasPost)}>
                                                <Tiles day={tile.day} hasPost={tile.hasPost}
                                                    isToday={tile.isToday}
                                                    postDetails={tile.postDetails} />
                                            </div>
                                        })
                                    }
                                </div>
                            </div>)
                    })
                    }
                </div>
            </div>
        </div >
    )
}

export default Calendar
