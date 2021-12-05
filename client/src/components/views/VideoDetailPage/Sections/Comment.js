import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux'; //redux hook
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';


const {TextArea} = Input;

function Comment(props) {

    //postId라는 prop으로 부모 컴포넌트(VideoDetailPage)에서 받아옴.
    const videoId = props.postId;
    //writer 정보를 redux에서 가져올건데, extension에서 보면 user의 모든 데이터(_id, isAdmin, isAuth, email,,,)을 가져올 수 있음
    const user = useSelector(state=>state.user)

    const [CommentValue, setCommentValue] = useState('')
    
    //없으면 타이핑안됨
    const handleClick=(event)=>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit=(event)=>{
        event.preventDefault();

        const variables={ 
            content: CommentValue,
            writer: user.userData._id, //redux에서 user정보 가져오기
            postId: videoId
        }

        axios.post('/api/comment/saveComment', variables)
        .then(response=>{
            if(response.data.success){
                console.log(response.data.result);
                setCommentValue('')
                //VideoDetailPage(부모)의 Comments를 수정해줘야 함
                props.refreshFunc(response.data.result);
            }else{
                alert('댓글 등록 실패')
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {/* 댓글과 대댓글의 차이: responseTo의 유무. responseTo가 없는 것만 렌더링 */}
            {props.commentLists && props.commentLists.map((comment, index)=>(
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} postId={videoId} refreshFunc={props.refreshFunc} />
                        <ReplyComment commentLists={props.commentLists} postId={videoId} parentCommentId={comment._id} refreshFunc={props.refreshFunc}/>
                    </React.Fragment>
                    
                )
                
            ))}
            

            {/* Root Comment Form */}
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <TextArea
                style={{width:'100%', borderRadius:'5px'}}
                onChange={handleClick}
                value={CommentValue}
                placeholder="Write comments"
                />
                <br />
                <Button style={{width: '20%', height:'52px'}} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment
