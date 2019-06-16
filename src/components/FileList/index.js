import React   from 'react';
import FileItem from "../../components/FileItem";
import "./index.scss"

const FileList = (props) => {
    let fileList = (<div>No Files Loaded yet.</div>);

    if(props.files){
        fileList = props.files.map((file,index) => (
                <FileItem
                    key={index}
                    name={file.name}
                    type={file.type}
                    selected={index === props.fileSelectedIndex}
                    onClick={()=>{ props.loadPDF(index) }}
                />
            )
        )
    }

    return (
        <div className="file-wrapper">
            <div className="label">Files</div>
            <div className="items">
                {fileList}
            </div>
        </div>
    );
};

export default FileList;
