import React, { useEffect, useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'; //redux hook
import LikeDislikes from './LikeDislikes';

const {TextArea} = Input;

function SingleComment(props) {
    //writer 정보를 redux에서 가져올건데, extension에서 보면 user의 모든 데이터(_id, isAdmin, isAuth, email,,,)을 가져올 수 있음
    const user = useSelector(state=>state.user)

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState('')

    //대댓글 창 toggle
    const onClickOpenReply=()=>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange=(event)=>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit=(event)=>{
        event.preventDefault();
        
        //댓글 다는 유저 정보, 내용들로 리퀘스트를 보내야 하는데..!? 이미 했었네!
        const variables={ 
            content: CommentValue,
            writer: user.userData._id, //redux에서 user정보 가져오기
            postId: props.postId,
            responseTo: props.comment._id
        }

        axios.post('/api/comment/saveComment', variables)
        .then(response=>{
            if(response.data.success){
                console.log(response.data.result);
                setCommentValue('')
                setOpenReply(false)
                //VideoDetailPage(부모)의 Comments를 수정해줘야 함
                props.refreshFunc(response.data.result)
            }else{
                alert('댓글 등록 실패')
            }
        })
    }

    const actions=[
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        ,<span onClick={onClickOpenReply} key="comment-basic-reply-to"> Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="image" />}
                content={<p> {props.comment.content}</p>}
            />

            {OpenReply &&
                <form style={{display: 'flex'}} onSubmit={onSubmit}>
                    <TextArea
                    style={{width:'100%', borderRadius:'5px'}}
                    onChange={onHandleChange}
                    value={CommentValue}
                    placeholder="Write comments"
                    />
                    <br />
                    <Button style={{width: '20%', height:'52px'}} onClick={onSubmit}>Submit</Button>
                </form>
            }
        </div>
    )
}

export default SingleComment
