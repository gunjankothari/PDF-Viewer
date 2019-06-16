import React,{ PureComponent }  from 'react';
import './index.scss';

import FileItem from "../../components/FileItem";
import PDFViewer from "../../components/PDFViewer";

import LOGO from "../../assets/images/logo.svg";
import UPLOAD from "../../assets/images/upload.svg";
import OPENER from "../../assets/images/open-menu-01-512.png";

const Type = Object.freeze({
    PDF : "application/pdf",
    TEXT: "text/plain"
});

export default class HomePage extends PureComponent {
    state = {
        files: [],
        fileSelectedIndex: 0,
        sidebarOpen: false
    };

    componentWillMount() {
        //this.loadFiles();
    }

    uploadFile(event){
        const input = event.target;
        const reader = new FileReader();

        reader.onload = () => {
            const file = input.files[0];
            const type = input.files[0].type;
            let fileData;
            switch(type){
                case Type.PDF:
                    fileData = new Uint8Array(reader.result);
                    break;

                case Type.TEXT:
                    fileData = this.atos(reader.result);
                    break;

                default :
                    fileData = null;
            }
            if(fileData){
                this.setState({
                    files: [
                        ...this.state.files,
                        {
                            name: file.name,
                            file: fileData,
                            type: type
                        }
                    ],

                });
                this.setState({
                    fileSelectedIndex: this.state.files.length -1,
                    sidebarOpen: false
                })
            }
        };
        console.log(input.files[0]);
        reader.readAsArrayBuffer(input.files[0]);
    }

    atos(arrayBuffer){
        return String.fromCharCode.apply(null, new Uint8Array((arrayBuffer)))
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
        if(index > this.state.files.length - 1){
            index = this.state.files.length - 1;
        }
        this.setState({
            fileSelectedIndex: index
        });
    }

    getContent(selectedFile){
        if(selectedFile){
            switch(selectedFile.type){
                case Type.PDF:
                    return (
                        <div>
                            <h4>{selectedFile.name}</h4>
                            <PDFViewer file={{data: selectedFile.file}} />
                        </div>
                    );

                case Type.TEXT:
                    return (<div>
                        <h4>{selectedFile.name}</h4>
                        <pre>{selectedFile.file}</pre>
                    </div>);
            }
        }
        return;
    }

    toggleSidebar(){
        this.setState({
            sidebarOpen: !this.state.sidebarOpen
        })
    }

    render() {
        const { files, fileSelectedIndex } = this.state;
        let fileList = (<div>No Files Loaded yet.</div>);
        const selectedFile = files[fileSelectedIndex];
        if(files){
            fileList = files.map((file,index) => (
                    <FileItem
                        key={index}
                        name={file.name}
                        selected={index === fileSelectedIndex}
                        onClick={()=>{ this.loadPDF(index) }}
                    />
                )
            )
        }


        return (
            <div className={ "sidebar " + (this.state.sidebarOpen ? "open" : "") }>
                <div className="sidebar-toogle" onClick={this.toggleSidebar.bind(this)} >
                    <img src={OPENER} />
                </div>
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
                    <input id="file-upload" type="file" accept="application/pdf, text/plain" onChange={this.uploadFile.bind(this)}/>
                    <label htmlFor="file-upload" className="file-upload-btn">
                        <img src={UPLOAD} />
                        <span>Upload Files</span>
                    </label>
                </div>
            </div>
        );
    }
};
