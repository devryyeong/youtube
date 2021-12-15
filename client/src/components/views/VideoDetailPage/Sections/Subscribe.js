import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Styled= { 
    subscribeBtn: styled.button`
        border-radius: 4px;
        color: white;
        padding: 10px 16px;
        font-weight: 500;
        font-size: 1rem;
        text-transform: uppercase;
    `
}


function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    
    useEffect(() => {
        let variable={userTo: props.userTo}
        
        axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response =>{
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            }else{
                alert('구독자 수 정보 받아오기 실패');
            }
        })
        

        //내가 이 비디오 업로드한 유저를 구독하는지 정보 가져오기(->내 아이디도 필요함)
        //로그인할 때 임의적으로 userId를 Local Storage에 넣어두었기 때문.
        let subscribedVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if(response.data.success){
                setSubscribed(response.data.subscribed)
            }else{
                alert('구독하는지에 대한 정보 가져오기 실패');
            }
        })
    }, [])

    const onSubscribe=()=>{
        let subscribedVariable={
            userTo: props.userTo,
            userFrom: props.userFrom
        }
        
        //이미 구독중이라면
        if(Subscribed){
            axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('구독 취소 실패');
                }
            })
        }
        //아직 구독중이 아니라면
        else{
            axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                }else{
                    alert('구독 실패');
                }
            })
        }
    }

    return (
        <div>
            <Styled.subscribeBtn style={{ backgroundColor: `${Subscribed ? '#AAAAAA':'#CC0000'}`}} onClick={onSubscribe}> 
                {SubscribeNumber} {Subscribed ? "Subscribed":"Subscribe"}
            </Styled.subscribeBtn>
        </div>
    )
}

export default Subscribe
