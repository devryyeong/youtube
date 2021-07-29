import React, {useState} from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const { TextArea }=Input;
const { Title } = Typography;

const PrivateOptions=[
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions=[
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"}
]

function VideoUploadPage() {
    const [VideoTitle, setVideoTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [Private, setPrivate] = useState(0) //Private:0, Public: 1
    const [Category, setCategory] = useState("Film & Animation")

    const [FilePath, setFilePath] = useState('')
    const [Duration, setDuration] = useState('')
    const [ThumbnailPath, setThumbnailPath] = useState('')

    const onTitleChange=(e)=>{
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange=(e)=>{
        setDescription(e.currentTarget.value)
    }

    
    const onPrivateChange=(e)=>{
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange=(e)=>{
        setCategory(e.currentTarget.value)
    }


    const onDrop=(files)=>{
        let formData=new FormData();
        const config={
            header: {'content-type': 'multipart/form-data'}
        }

        formData.append("file", files[0]) //배열 형태로 가져옴
        
        //file 정보를 서버로 보냄(index.js로 감.)
        axios.post('/api/video/uploadfiles', formData, config)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                
                let variable={
                    filePath: response.data.filePath,
                    fileName: response.data.fileName
                }

                setFilePath(response.data.url)

                axios.post('/api/video/thumbnail', variable)
                .then(response=>{
                    if(response.data.success){
                        console.log(response.data)

                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    }else{
                        alert('썸네일 생성 실패')
                    }
                })


            }else{
                alert('비디오 업로드 실패')
            }
        })
    }

    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}> Upload Video</Title>
            </div>

            <Form onSubmit>
                <div style={{display: 'flex', justifyContent:'space-between'}}>

                    {/* Drop zone */}
                    <Dropzone
                    onDrop={onDrop}
                    multiple={false} //한번에 파일을 하나만 올리면 false
                    maxSize={90000000000}
                    >
                        {({ getRootProps, getInputProps})=>(
                            <div style={{width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                            
                            <input {...getInputProps()}/>

                            <Icon type="plus" style={{ fontSize:'3rem'}}/>
                        </div>
                        )}
                    </Dropzone>

                    {/* Thumbnail */}
                    {/* Thumbnail Path가 있을 때만 렌더링되도록 */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }

                </div>

                <br/>
                <br/>

                <label>Title</label> 
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br/>
                <br/>

                <label>Description</label> 
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br/>
                <br/>

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index)=>(
                        <option key={index} value={item.value}> {item.label} </option>
                    ))}
                    
                </select>
                <br/>
                <br/>

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index)=>(
                        <option key={index} value={item.value}> {item.label} </option>
                    ))}
                    
                </select>
                <br/>
                <br/>

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>

            </Form>        
        </div>
    )
}

export default VideoUploadPage
