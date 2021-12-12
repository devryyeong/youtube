import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {

    //const videoId = props.postId;

    //대댓글의 갯수 구하기
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    //부모로부터 불러온 props.commentLists가 바뀔때마다 useEffect로 계속 다시 렌더링
    useEffect(() => {
        let commentNumber=0;
        props.commentLists.map((comment)=>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber++;
            }
        })

        setChildCommentNumber(commentNumber)
    }, [props.commentLists, props.parentCommentId])


    //대댓글(N+1 depth)의 responseTo와 댓글(N depth)이 같은 것만 렌더링
    const renderReplyComment=(parentCommentId)=>
        props.commentLists.map((comment, index)=>(
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{width: '80%', marginLeft:'40px'}}>
                        <SingleComment comment={comment} postId={props.videoId} refreshFunc={props.refreshFunc}/>
                        <ReplyComment commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} refreshFunc={props.refreshFunc}/>
                    </div>
                }
            </React.Fragment>
        ))

    const onHandleChange=()=>{
        setOpenReplyComments(!OpenReplyComments)
    }


    return (
        <div>
            {/* 댓글이 있을 때만 렌더링 되도록 */}
            {ChildCommentNumber>0 &&
                <p style={{fontSize: '14px', margin:0, color: 'gray'}} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }
            
            {OpenReplyComments && 
                renderReplyComment(props.parentCommentId)
            }
            
        </div>
    )
}

export default ReplyComment
