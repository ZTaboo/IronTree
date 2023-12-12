import {Dropdown, FloatButton, Tooltip} from "antd";
import {Brightness, Down, GrinningFaceWithSquintingEyes, Sleep, Toolkit, Up, Workbench,} from "@icon-park/react";
import {happyMode, useTheme} from "@/store/store.jsx";
import {useEffect, useState} from "react";
import localforage from "localforage";
import {baseUrl} from "@/utils/base.js";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useNavigate} from "react-router-dom";

export const HeaderRightBox = () => {
    const [userInfo, setUserInfo] = useState({});
    const [menuIcon, setMenuIcon] = useState(false)
    const {dark, toggleTheme} = useTheme();
    const toggleThemeBtn = () => {
        toggleTheme();
        dark
            ? document.querySelector("html").classList.remove("dark")
            : document.querySelector("html").classList.add("dark");
    };
    const navigate = useNavigate()
    const {happy, toggleHappy} = happyMode();
    const [parent] = useAutoAnimate({
        duration: 250,
        easing: "linear",
        disrespectUserMotionPreference: true,
    });
    // 菜单点击事件
    const menuClick = ({key}) => {
        console.log(key)
        switch (key) {
            case "logout":
                localforage.clear();
                navigate('/')
                break;
            default:
                break;

        }
    }
    useEffect(() => {
        localforage.getItem("user").then((r) => {
            setUserInfo({...r, avatar: `${baseUrl}/${r.avatar}`});
        });
    }, []);
    useEffect(() => {
        !dark
            ? document.querySelector("html").classList.remove("dark")
            : document.querySelector("html").classList.add("dark");
    }, [dark]);
    return (
        <>
            <Dropdown menu={{
                items: [
                    {key: 'logout', label: '退出登录'},
                ],
                onClick: menuClick
            }}>
                <div className="h-[40px] flex items-center pl-1 pr-1 cursor-pointer hover:bg-gray-100"
                     ref={parent}
                     onMouseEnter={() => setMenuIcon(!menuIcon)} onMouseLeave={() => setMenuIcon(!menuIcon)}>
                    <img
                        src={userInfo.avatar}
                        className="mr-2 h-[30px] rounded-full"
                        alt=""
                    />
                    <span className=" text-lg mr-1 ">{userInfo.username}</span>
                    {
                        !menuIcon ?
                            <Down theme="filled" size="18" fill="#000" strokeLinecap="butt"/>
                            :
                            <Up theme="filled" size="18" fill="#000" strokeLinecap="butt"/>
                    }
                </div>
            </Dropdown>

            <FloatButton.Group
                trigger={"hover"}
                icon={
                    <Toolkit
                        theme="filled"
                        size="16"
                        fill="#CEDFEF"
                        strokeLinecap="butt"
                    />
                }
            >
                <Tooltip
                    placement={"left"}
                    title={!dark ? "切换深色模式" : "切换浅色模式"}
                >
                    <FloatButton
                        icon={
                            !dark ? (
                                <Sleep
                                    theme="outline"
                                    size="16"
                                    fill="#CEDFEF"
                                    strokeLinecap="butt"
                                />
                            ) : (
                                <Brightness
                                    theme="outline"
                                    size="16"
                                    fill="#F1F0FF"
                                    strokeLinecap="butt"
                                />
                            )
                        }
                        onClick={toggleThemeBtn}
                    ></FloatButton>
                </Tooltip>
                <Tooltip
                    placement={"left"}
                    title={!happy ? "切换快乐模式" : "切换工作模式"}
                >
                    <FloatButton
                        icon={
                            happy ? (
                                <Workbench
                                    theme="filled"
                                    size="16"
                                    fill="#CEDFEF"
                                    strokeLinecap="butt"
                                />
                            ) : (
                                <GrinningFaceWithSquintingEyes
                                    theme="filled"
                                    size="16"
                                    fill="#CEDFEF"
                                    strokeLinecap="butt"
                                />
                            )
                        }
                        onClick={toggleHappy}
                    ></FloatButton>
                </Tooltip>
            </FloatButton.Group>
        </>
    );
};
