import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
    const [Video, setVideo] = useState([])
    
    const subcriptionVariables = {
        userFrom: localStorage.getItem('userId')
    }
    
    useEffect(()=>{
        axios.post('/api/video/getSubscriptionVideos', subcriptionVariables)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            }else{
                alert('비디오 가져오기 실패')
            }
        })
    },[]);

    //map(): //각 배열의 요소를 돌면서 인자로 전달된 함수를 사용하여 처리 된 새로운 결과를 새로운 배열에 담아 반환
    const renderCards = Video.map((video, index) => { 

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24}>
            {/* video당 각각 하나의 페이지이므로 link를 걸음 */}
            <div styles={{position: 'relative'}}>
                <a href={`/video/${video._id}`} >
                    <img style={{width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    <div className="duration">
                        <span> {minutes} : {seconds} </span>
                    </div>
                </a>
            </div>

            <br/>
            {/* Avatar: user의 이미지 */}
            <Meta
                avatar={
                    <Avatar src={video.writer.image}/>
                }
                title={video.title}
                description=""
            />

                <span>{video.writer.name}</span><br/>
                <span style={{marginLeft: '3rem'}}>{video.views} views</span> 
                - <span> {moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> Recommended</Title>
            <hr/>
            <Row gutter={[32, 16]}>

                {renderCards}
                
            </Row>
        </div>
    )
}

export default SubscriptionPage
