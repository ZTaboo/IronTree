import {useEffect, useState} from "react";
import {baseUrl} from "@/utils/base.js";
import localforage from "localforage";
import {DataSheet, Comment, Box} from "@icon-park/react";
import {Banner} from "@/components/Admin/Banner.jsx";
import {DashContent} from "@/components/Admin/DashContent.jsx";

const Dash = () => {
    const [initInfo, setInitInfo] = useState({
        avatar: "",
        role: "",
    });
    useEffect(() => {
        localforage.getItem("user").then((r) => {
            setInitInfo({
                ...initInfo,
                avatar: `${baseUrl}/${r.avatar}`,
                role: r.role,
            });
        });
    }, []);
    return (
        <div>
            <Banner initInfo={initInfo}></Banner>
            {/*    主要内容区域*/}
            <DashContent></DashContent>
        </div>
    );
};

export default Dash;
