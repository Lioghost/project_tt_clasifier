import React from "react";
import { Helmet } from "react-helmet";
import customIcon from "../../assets/icons/index-icon.png"

const Favicon = () => {
    return(
        <Helmet>
            <link rel="icon" href={customIcon} type="image/png"></link>
        </Helmet>
    );
}

export default Favicon;