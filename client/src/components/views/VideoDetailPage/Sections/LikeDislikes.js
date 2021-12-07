import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Icon } from 'antd';

/* 
<좋아요&&싫어요 버튼 로직>
1) 아무 버튼도 클릭이 안되어있는 경우-> 좋아요 1 올리기
2) 좋아요 버튼이 이미 클릭되어있는 경우-> 좋아요 1 내리기
3) 싫어요 버튼이 이미 클릭되어있는 경우-> 좋아요 1 올리고 싫어요 1 내리기
*/

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)

    const [Dislikes, setDislikes] = useState(0)
    const [DislikeAction, setDislikeAction] = useState(null)


    //video의 like와 comment의 like를 구분해야 함
    //부모 컴포넌트(VideoDetailPage)에서 video라는 이름으로 넘겨준걸 props.video로 받음
    let variable = {}
    if(props.video){
        variable={videoId: props.videoId, userId: props.userId}
    }else{
        variable={commentId:props.commentId , userId: props.userId}
    }



    useEffect(() => {
        axios.post('/api/like/getLikes', variable)
        .then(response =>{
            if(response.data.success){
                //얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)

                //내가 이미 좋아요를 눌렀는지
                //likes: 좋아요를 누른 모든 사람의 정보
                response.data.likes.map(like=>{
                    //likes중 내 userId === local storage에서 가져온 내 자신의 userId
                    if(like.userId === props.userId){
                        setLikeAction('liked')
                    }
                })
            }else{
                alert('Like 정보 가져오기 실패')
            }
        })

        axios.post('/api/like/getDislikes', variable)
        .then(response =>{
            if(response.data.success){
                //얼마나 많은 싫어요를 받았는지
                setDislikes(response.data.dislikes.length)

                //내가 이미 싫어요를 눌렀는지
                response.data.dislikes.map(dislike=>{
                    if(dislike.userId === props.userId){
                        setDislikeAction('disliked')
                    }
                })
            }else{
                alert('Dislike 정보 가져오기 실패')
            }
        })
    }, [])

    const onLike=()=>{
        //아무 버튼도 클릭이 안되어있는 경우
        if(LikeAction === null){
            axios.post('/api/like/upLike', variable)
            .then(response =>{
                if(response.data.success){
                    setLikes(Likes+1)
                    setLikeAction('liked')

                    //싫어요가 이미 클릭되어있는 경우
                    if(DislikeAction !== null){
                        setDislikes(Dislikes-1)
                        setDislikeAction(null)
                    }
                }else{
                    alert('좋아요 실패')
                }
            })
        //좋아요 버튼이 이미 클릭되어있는 경우
        }else{
            axios.post('/api/like/unLike', variable)
            .then(response =>{
                if(response.data.success){
                    setLikes(Likes-1)
                    setLikeAction(null)
                }else{
                    alert('좋아요 취소 실패')
                }
            })
        }
    }

    const onDislike=()=>{
        if(DislikeAction === null){
            axios.post('/api/dislike/upDislike', variable)
            .then(response =>{
                if(response.data.success){
                    setDislikes(Dislikes+1)
                    setDislikeAction('disliked')

                    //좋아요가 이미 클릭되어있는 경우
                    if(LikeAction !== null){
                        setLikes(Dislikes+1)
                        setLikeAction(null)
                    }
                }else{
                    alert('싫어요 실패')
                }
            })
        //싫어요 버튼이 이미 클릭되어있는 경우
        }else{
            axios.post('/api/dislike/unDislike', variable)
            .then(response =>{
                if(response.data.success){
                    setDislikes(Dislikes-1)
                    setDislikeAction(null)
                }else{
                    alert('싫어요 취소 실패')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like" theme={LikeAction==='liked' ? 'filled':'outlined'} onClick={onLike} />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike" theme={DislikeAction==='disliked' ? 'filled':'outlined'} onClick={onDislike} />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}> {Dislikes} </span>
            </span>
            &nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
