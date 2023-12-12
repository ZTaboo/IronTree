import {useEffect, useState} from "react";
import {ApplicationMenu, ArrowLeft, ArrowRight, Close, Other} from "@icon-park/react";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTabs} from "../store/store";
import {Button, Dropdown, message} from "antd";
import "@/assets/css/ironTabs.less";
import localforage from "localforage";

const items = [
    {
        key: 'left',
        label: '关闭左侧',
        icon: <ArrowLeft theme="filled" size="12" fill="#CEDFEF" strokeLinecap="butt"/>
    },
    {
        key: 'right',
        label: '关闭右侧',
        icon: <ArrowRight theme="filled" size="12" fill="#CEDFEF" strokeLinecap="butt"/>
    },

    {
        key: 'other',
        label: '关闭其他',
        icon: <Other theme="filled" size="12" fill="#CEDFEF" strokeLinecap="butt"/>
    },
    {
        key: 'all',
        label: '关闭全部',
        icon: <Close theme="filled" size="12" fill="#CEDFEF" strokeLinecap="butt"/>
    },

]

export const IronTabs = () => {
    const [thisTab, setThisTab] = useState(0);
    const localhost = useLocation();
    const navigate = useNavigate();
    const {tabs, delTabs, delOtherTabs, delAllTabs, delDirectionTabs} = useTabs();
    const [parent] = useAutoAnimate({
        duration: 250, disrespectUserMotionPreference: true,
    });
    const closeBtn = (e, index) => {
        e.stopPropagation();
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].path === localhost.pathname) {
                if (i === index) {
                    console.log('跳转路由:', tabs[index - 1].path)
                    navigate(tabs[index - 1].path);
                    break;
                }
            }
        }

        delTabs(index);
        setThisTab(thisTab - 1);
    };
    const funBtn = ({key}) => {
        switch (key) {
            case 'left':
                thisTab !== 0 && delDirectionTabs(thisTab, 'left');
                thisTab !== 0 && setThisTab(1)
                break
            case 'right':
                delDirectionTabs(thisTab, 'right');
                break
            case 'other':
                setThisTab(1)
                delOtherTabs(tabs[thisTab])
                break
            case 'all':
                delAllTabs()
                navigate(tabs[0].path);
                setThisTab(0);
                break
            default:
                message.error('异常操作')
                setTimeout(() => {
                    localforage.clear()
                    navigate('/login')
                }, 500)
                break
        }
    }
    useEffect(() => {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].path === localhost.pathname) {
                setThisTab(i);
                return;
            }
        }
    }, [localhost.pathname]);


    return (<div
            className="h-[38px] min-h-[38px] pl-[20px] pr-[20px] dark:bg-[#1F2020] flex items-end bg-white shadow-lg justify-between"
            style={{borderTop: "1px solid rgba(5, 5, 5, 0.06)"}}
        >

            <div className={'h-[37px] min-h-[37px] flex overflow-hidden'} ref={parent}>
                {tabs.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={
                            "h-full inline-flex items-center pl-[10px] pr-[10px] select-none cursor-pointer" + "transition-all duration-300 group shrink-0 flex-nowrap cursor-pointer "
                            + `${localhost.pathname === item.path ? "bg-[#E8F4FF] dark:bg-[#111d2c] dark:hover:bg-[#111d2c] !hover:bg-[#E8F4FF] tabs-box" :
                                "bg-[#fff] hover:bg-[#DEE1E6] dark:bg-[#1F2020] dark:hover:bg-[hsla(0,0%,100%,0.05)]"}`
                        }
                    >
                              <span
                                  className={`mr-2 ${localhost.pathname === item.path ? "text-blue-500" : "text-[#646D7F] dark:hover:text-[#ccc]"}`}
                              >
                                {item.label}
                              </span>
                        {index !== 0 ? (
                            <Close
                                onClick={(e) => closeBtn(e, index)}
                                className={`mt-[1px] hover:bg-[#C0C4CC] !text-[#9e9b9b] hover:!text-[#fff] rounded-xl p-[2px] transition-colors duration-300 ${localhost.pathname !== item.path ? "!opacity-0 group-hover:!opacity-100" : ""}`}
                                theme="outline"
                                size="12"
                            />
                        ) : null}
                    </div>
                ))}
            </div>
            <Dropdown menu={{items, onClick: funBtn}} trigger={["hover", "click"]}>
                <Button size={"small"}
                        className={'my-auto flex items-center justify-center border-none'}
                        icon={<ApplicationMenu theme="filled" size="16" fill="#CEDFEF" strokeLinecap="butt"/>}
                />
            </Dropdown>

        </div>

    );
};
