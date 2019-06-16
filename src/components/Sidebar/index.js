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
        sidebarOpen: false
    };

    uploadFile(event){
        if(this.props.uploadFile) {
            this.props.uploadFile(event);
        }
    }

    loadPDF(index){
        if(this.props.loadPDF){
            this.props.loadPDF();
        }
    }

    toggleSidebar(){
        this.setState({
            sidebarOpen: !this.state.sidebarOpen
        })
    }

    render() {

        const { files, fileSelectedIndex } = this.state;

        let fileList = (<div>No Files Loaded yet.</div>);

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
