import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Styled= { 
    content: styled.div`
        display: flex;
        margin-bottom: 1rem;
        margin-top: 3rem;
        padding: 0.2rem;
        color: green;
    `,
    wrap1: styled.div`
        width: 40%;
        margin-bottom: 1rem;
        margin-right: 1rem;
    `,
    wrap2: styled.div`
        width: 50%;
    `,
    img: styled.img`
        width: 100%;
        height: 100%;
    `,
    videoCard: styled.div`
        font-size: 1rem;
        color: gray;
        //font-weight: bold;
    `

};

function SideVideo() {
    const [sideVideos, setsideVideos] = useState([])

    useEffect(() => {
        axios.get('/api/video/getVideos')
        .then(response =>{
            if(response.data.success){
                console.log(response.data.videos);
                setsideVideos(response.data.videos)
            }else{
                alert('사이드 비디오 가져오기 실패')
            }
        })
    }, [])

    const renderSideVideo = sideVideos.map((video, index)=> {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <div>
            <Styled.content key={index}>
                <Styled.wrap1>
                    <a href>
                        <Styled.img src={`http://localhost:5000/${video.thumbnail}`} alt></Styled.img>
                    </a>
                </Styled.wrap1>
                <Styled.wrap2>
                    <a href>
                        <Styled.videoCard style={{color:'black'}}>{video.title}</Styled.videoCard>
                        <Styled.videoCard>{video.writer.name}</Styled.videoCard>
                        <Styled.videoCard>{video.views}</Styled.videoCard>
                        <Styled.videoCard>{minutes} : {seconds}</Styled.videoCard>
                    </a>
                </Styled.wrap2>
            </Styled.content>
        </div>
    })

    return (
        <React.Fragment>
            {renderSideVideo}
        </React.Fragment>
    )
}

export default SideVideo
