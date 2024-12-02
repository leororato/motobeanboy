import React from "react";
import './Loading.css';
import { CircularProgress } from "@mui/material";
import Text from "../Text";



const Loading = ({ message }) => {

    return (

        <>
            <div className='overlay'></div>
            <div className='context-loading'>
                <div className="loading-container">
                    <div className="loading-box">
                        <Text
                            text={message}
                        />
                        <CircularProgress />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Loading;