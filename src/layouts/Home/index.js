import React,{ PureComponent }  from 'react';
import { Document, Page } from "react-pdf/dist/entry.webpack";

import './index.scss';

import FileItem from "../../components/FileItem";
import PDFViewer from "../../components/PDFViewer";

import LOGO from "../../assets/images/logo.svg";
import UPLOAD from "../../assets/images/upload.svg";

export default class HomePage extends PureComponent {
    state = {
        fileLoaded: false,
        files: [],
        fileSelectedIndex: 0
    };

    componentWillMount() {
        //this.loadFiles();
    }

    uploadFile(event){
        const input = event.target;
        const reader = new FileReader();

        this.setState({
            fileLoaded: false
        });

        reader.onload = () => {
            this.setState({
                files: [
                    ...this.state.files,
                    {
                        name: input.files[0].name,
                        file: new Uint8Array(reader.result)
                    }
                ]
            });
            this.setState({
                fileLoaded: true,
                fileSelectedIndex: this.state.files.length - 1
            });
            //this.saveFile();
        };
        reader.readAsArrayBuffer(input.files[0]);
    }

    saveFile(){
        localStorage.setItem("files",JSON.stringify(this.state.files));
    }

    loadFiles(){
        const files = JSON.parse(localStorage.getItem("files"));
        this.setState({
            files: files || []
        });
    }

    loadPDF(index){
        debugger;
        console.log(index);
        this.setState({
            fileSelectedIndex: index
        });
    }

    render() {
        const { files, fileLoaded, fileSelectedIndex } = this.state;
        let fileList = (<div>No Files Loaded yet.</div>)
        if(files){
            fileList = files.map((file,index) => (<FileItem key={index} name={file.name} onClick={()=>{ this.loadPDF(index) }}/>))
        }
        return (
            <div className="main">
                <div className="sidebar">
                    <div className="logo">
                        <img src={LOGO} />
                    </div>
                    <div className="file-wrapper">
                        <div className="label">Files</div>
                        <div className="items">
                            {fileList}
                        </div>
                    </div>
                    <div className="bottom">
                        <input id="file-upload" type="file" accept="application/pdf" onChange={this.uploadFile.bind(this)}/>
                        <label htmlFor="file-upload" className="file-upload-btn">
                            <img src={UPLOAD} />
                            <span>Upload Files</span>
                        </label>
                    </div>
                </div>
                <div className="container">
                    { fileLoaded && <PDFViewer file={{ data: files[fileSelectedIndex].file }} /> }
                </div>
            </div>
        );
    }
};
