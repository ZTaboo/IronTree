import {useEffect, useState} from "react";
import {get} from "@/utils/http.js";
import {message, Layout, Menu, Button, theme, Breadcrumb, Tabs, Drawer} from "antd";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {
    AllApplication,
    HomeTwo,
    MenuFoldOne,
    MenuUnfoldOne,
    Workbench,
} from "@icon-park/react";
import {IronTabs} from "@/components/IronTabs.jsx";
import {HeaderRightBox} from "@/components/ToggleTheme/HeaderRightBox.jsx";
import LogoImg from "@/assets/images/logo.png";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {menuList} from "@/components/MenuList.jsx";
import {useTheme, useTabs} from "@/store/store.jsx";

const {Header, Sider, Content} = Layout;
const Admin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {dark} = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [phoneMenu, setPhoneMenu] = useState(false);
    const {setTabs} = useTabs();
    const [selectedValue, setSelectedValue] = useState({
        selectedKeys: [],
        openKeys: [],
        breadValue: [],
    });
    const [breadValue, setBreadValue] = useState([
        {
            href: "/admin",
            title: (
                <HomeTwo theme="filled" size="18" fill="#CEDFEF" strokeLinecap="butt"/>
            ),
        },
        {
            title: "首页",
        },
    ]);
    const [parent, enableAnimations] = useAutoAnimate({
        duration: 200,
        disrespectUserMotionPreference: true,
    });
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    let tmpTabName = "";

    const getTabName = (data, key) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].children) {
                getTabName(data[i].children, key);
            } else {
                if (data[i].key === key) {
                    tmpTabName = data[i].label;
                    return;
                }
            }
        }
    };
    const selectMenuBtn = (e) => {
        if (phoneMenu) {
            setPhoneMenu(false)
        }
        const {key} = e;
        getTabName(menuList, key);
        if (tmpTabName && tmpTabName.trim() !== "" && tmpTabName.length > 1) {
            setTabs({
                label: tmpTabName,
                path: key,
            });
        }
        navigate(key);
    };
    const getMenu = (data, parentKey = [], labels = []) => {
        for (let i = 0; i < data.length; i++) {
            const newPath = [...parentKey, data[i].key];
            const newBread = [...labels, {title: data[i].label}];
            if (data[i].children) {
                getMenu(data[i].children, newPath, newBread);
            } else {
                if (data[i].key === location.pathname) {
                    setSelectedValue({
                        selectedKeys: data[i].key,
                        openKeys: parentKey,
                        breadValue: newBread,
                    });
                    setBreadValue([
                        {
                            href: "/admin",
                            title: (
                                <HomeTwo
                                    theme="filled"
                                    size="18"
                                    fill="#CEDFEF"
                                    strokeLinecap="butt"
                                />
                            ),
                        },
                        ...newBread,
                    ]);
                    return;
                }
            }
        }
    };
    useEffect(() => {
        get("/api/ping").catch(() => {
            message.error("登录失效");
            setTimeout(() => {
                navigate("/login");
            }, 500);
        });
        getTabName(menuList, location.pathname);
        if (tmpTabName && tmpTabName.trim() !== "" && tmpTabName.length > 1) {
            setTabs({
                label: tmpTabName,
                path: location.pathname,
            });
        }
        getMenu(menuList);
    }, [location.pathname]);
    return (
        <Layout className={"h-[100vh] dark:text-white"}>
            <Sider
                style={{backgroundColor: colorBgContainer}}
                className={"shadow-lg hidden sm:block"}
                trigger={null}
                collapsible
                collapsedWidth={50}
                collapsed={collapsed}
            >
                <div
                    ref={parent}
                    style={{borderRight: "1px solid rgba(5, 5, 5, 0.06)"}}
                    className="dark:bg-[#232324] h-[48px] flex items-center justify-center select-none text-lg font-bold"
                >
                    {collapsed ? (
                        <img src={LogoImg} alt="" className={"h-[40px]"}/>
                    ) : (
                        <>
                            <img src={LogoImg} alt="" className={"h-[40px]"}/>
                            <span className={"ml-2"}>IronTree</span>
                        </>
                    )}
                </div>
                <div className={'sm:hidden'}>
                    <Drawer width={220} open={phoneMenu} closeIcon={false} classNames={{body: '!p-3'}} placement="left"
                            onClose={() => setPhoneMenu(false)}>
                        <Menu
                            theme={dark ? "dark" : "light"}
                            onOpenChange={(openKeys) => {
                                setSelectedValue({...selectedValue, openKeys: openKeys});
                            }}
                            openKeys={selectedValue.openKeys}
                            selectedKeys={selectedValue.selectedKeys}
                            onClick={selectMenuBtn}
                            style={{height: "calc(100vh - 48px)"}}
                            mode="inline"
                            defaultSelectedKeys={["1"]}
                            items={menuList}
                        />
                    </Drawer>
                </div>
                <Menu
                    theme={dark ? "dark" : "light"}
                    onOpenChange={(openKeys) => {
                        setSelectedValue({...selectedValue, openKeys: openKeys});
                    }}
                    openKeys={selectedValue.openKeys}
                    selectedKeys={selectedValue.selectedKeys}
                    onClick={selectMenuBtn}
                    style={{height: "calc(100vh - 48px)"}}
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={menuList}
                />
            </Sider>
            <Layout className={"dark:bg-[#292A2A]"}>
                <Header
                    className={
                        "flex items-center pl-3 pr-3 h-[48px] justify-between bg-white"
                    }
                    style={{backgroundColor: colorBgContainer}}
                >
                    <div className={"flex items-center"}>
                        {/*手机端菜单展开按钮*/}
                        <Button
                            className={'sm:hidden'}
                            type="text"
                            icon={
                                !phoneMenu ? (
                                    <MenuFoldOne
                                        theme="filled"
                                        size="25"
                                        fill="#CEDFEF"
                                        strokeLinecap="butt"
                                    />
                                ) : (
                                    <MenuUnfoldOne
                                        theme="filled"
                                        size="25"
                                        fill="#CEDFEF"
                                        strokeLinecap="butt"
                                    />
                                )
                            }
                            onClick={() => setPhoneMenu(!phoneMenu)}
                            style={{
                                fontSize: "16px",
                            }}
                        />
                        {/*电脑端菜单展开按钮*/}
                        <Button
                            className={'hidden sm:block'}
                            type="text"
                            icon={
                                collapsed ? (
                                    <MenuFoldOne
                                        theme="filled"
                                        size="25"
                                        fill="#CEDFEF"
                                        strokeLinecap="butt"
                                    />
                                ) : (
                                    <MenuUnfoldOne
                                        theme="filled"
                                        size="25"
                                        fill="#CEDFEF"
                                        strokeLinecap="butt"
                                    />
                                )
                            }
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: "16px",
                            }}
                        />
                        <Breadcrumb
                            separator=">"
                            className={"ml-3 mt-1 hidden sm:block"}
                            items={breadValue}
                        ></Breadcrumb>
                    </div>
                    <div className={"flex"}>
                        <HeaderRightBox></HeaderRightBox>
                    </div>
                </Header>
                {/* 自定义tabs */}
                <IronTabs></IronTabs>
                <Content
                    className={
                        "p-[20px] dark:bg-[#1f2020] m-[15px] dark:text-[#fff] bg-white rounded-sm"
                    }
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Admin;
