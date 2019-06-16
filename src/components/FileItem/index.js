import React from "react";

import "./index.scss";
import FileSvg from "../../assets/images/file.svg"

const FileItem = (props) => {
    return (
        <div className="file" onClick={() => { props.onClick() }}>
            <div className={"item " + (props.selected ? "selected" : "")}>
                <div className="icon">
                    <img src={FileSvg} />
                </div>
                <div className="name-wrapper">
                    <div className="name">{props.name}</div>
                    <div className="description">{props.type} </div>
                </div>
            </div>
        </div>
    );
};

export default FileItem;


