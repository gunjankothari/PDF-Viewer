import React,{ PureComponent }  from 'react';

import './index.scss';
import { arrayBufferToString, Type } from "./helper";
import db, {FILE_STORE} from '../../Database/db';


import FileList from "../../components/FileList";
import PDFViewer from "../../components/PDFViewer";

import LOGO from "../../assets/images/logo.svg";
import UPLOAD from "../../assets/images/upload.svg";
import OPENER from "../../assets/images/open-menu-01-512.png";


export default class HomePage extends PureComponent {

    state = {
        files: [],
        fileSelectedIndex: 0,
        sidebarOpen: false
    };

    componentWillMount() {
        this.fetchFiles();
    }

    fetchFiles() {
        db.table('files')
            .toArray()
            .then((files) => {
                this.setState({ files: files || [] });
            });
    }

    uploadFile(event){
        const input = event.target;
        const reader = new FileReader();

        reader.onload = () => {
            this.onFileLoaded(input.files[0], reader.result);
        };
        reader.readAsArrayBuffer(input.files[0]);
    }

    onFileLoaded(file, data){
        const type = file.type;
        let fileData;
        fileData = this.getFileData(type, data);
        if(fileData){
            this.saveFile(file, fileData)
        }
    }

    getFileData(type, data){
        switch(type){
            case Type.PDF:
                return new Uint8Array(data);

            case Type.TEXT:
                return arrayBufferToString(data);

            default :
                return null;
        }
    }

    saveFile(file, fileData) {
        const type = file.type;
        const newFile = {
            name: file.name,
            file: fileData,
            type: type
        };
        db.table('files')
            .add(newFile)
            .then((id) => {
                const newList = [
                    ...this.state.files,
                    Object.assign({}, newFile, { id })];
                this.setState({ files: newList });
            });

        this.setState({
            fileSelectedIndex: this.state.files.length,
            sidebarOpen: false
        })
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
        const selectedFile = files[fileSelectedIndex];

        return (
            <div className="main">
                <div className={ "sidebar " + (this.state.sidebarOpen ? "open" : "") }>
                    <div className="sidebar-toogle" onClick={this.toggleSidebar.bind(this)} >
                        <img src={OPENER} />
                    </div>
                    <div className="logo">
                        <img src={LOGO} />
                    </div>
                    <FileList
                        files={files}
                        fileSelectedIndex={fileSelectedIndex}
                        loadPDF={ this.loadPDF.bind(this) }
                    />
                    <div className="bottom">
                        <input id="file-upload" type="file" accept="application/pdf, text/plain" onChange={this.uploadFile.bind(this)}/>
                        <label htmlFor="file-upload" className="file-upload-btn">
                            <img src={UPLOAD} />
                            <span>Upload Files</span>
                        </label>
                    </div>
                </div>
                <div className="container">
                    { this.getContent(selectedFile) }
                </div>
            </div>
        );
    }
};
