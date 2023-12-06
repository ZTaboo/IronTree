import {useEffect, useState} from "react";
import {get} from "@/utils/http.js";
import {message, Layout, Menu, Button, theme, Breadcrumb, Tabs} from "antd";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {AllApplication, HomeTwo, MenuFoldOne, MenuUnfoldOne, Workbench} from "@icon-park/react";
import {ToggleTheme} from "@/components/ToggleTheme/ToggleTheme.jsx";
import LogoImg from '@/assets/images/logo.png'
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {menuList} from "@/components/MenuList.jsx";
import {useTheme} from "@/store/store.jsx";

const {Header, Sider, Content} = Layout;
const Admin = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {dark} = useTheme()
    const [collapsed, setCollapsed] = useState(false);
    const [selectedValue, setSelectedValue] = useState({
        selectedKeys: [],
        openKeys: [],
        breadValue: []
    })
    const [breadValue, setBreadValue] = useState([
        {
            href: '/admin',
            title: <HomeTwo theme="filled" size="18" fill="#CEDFEF" strokeLinecap="butt"/>
        },
        {
            title: '首页'
        }
    ])
    // const [parent, enableAnimations] = useAutoAnimate({duration: 500, disrespectUserMotionPreference: true})
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const selectMenuBtn = (e) => {
        const {item, key, keyPath, domEvent} = e
        console.log({item, key, keyPath, domEvent})
        navigate(key)
    }
    const getMenu = (data, parentKey = [], labels = []) => {
        for (let i = 0; i < data.length; i++) {
            const newPath = [...parentKey, data[i].key];
            const newBread = [...labels, {title: data[i].label}]
            if (data[i].children) {
                console.log('递归start')
                getMenu(data[i].children, newPath, newBread)
            } else {
                if (data[i].key === location.pathname) {
                    setSelectedValue({selectedKeys: data[i].key, openKeys: parentKey, breadValue: newBread})
                    console.log({selectedKeys: data[i].key, openKeys: parentKey, newBread: newBread})
                    setBreadValue([
                        {
                            href: '/admin',
                            title: <HomeTwo theme="filled" size="18" fill="#CEDFEF" strokeLinecap="butt"/>
                        },
                        ...newBread
                    ])
                    return
                }
            }

        }
    }
    useEffect(() => {
        get('/api/ping').catch(() => {
            message.error('登录失效')
            setTimeout(() => {
                navigate('/login')
            }, 500)
        })
        getMenu(menuList)
    }, [location.pathname])
    return (
        <Layout
            className={'h-[100vh] dark:text-white'}
        >
            <Sider
                style={{backgroundColor: colorBgContainer}}
                className={'shadow-lg'}
                trigger={null} collapsible
                collapsedWidth={50}
                collapsed={collapsed}>
                <div
                    style={{borderRight: '1px solid rgba(5, 5, 5, 0.06)'}}
                    className="dark:bg-[#232324] h-[48px] flex items-center justify-center select-none text-lg font-bold"
                >
                    <img src={LogoImg} alt="" className={'h-[40px]'}/>
                    <span style={collapsed ? {display: 'none'} : {}} className={'ml-2'}>IronTree</span>
                </div>
                <Menu
                    theme={dark ? "dark" : 'light'}
                    onOpenChange={(openKeys) => {
                        setSelectedValue({...selectedValue, openKeys: openKeys})
                    }}
                    openKeys={selectedValue.openKeys}
                    selectedKeys={selectedValue.selectedKeys}
                    onClick={selectMenuBtn}
                    style={{height: 'calc(100vh - 48px)'}}
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuList}
                />
            </Sider>
            <Layout className={'dark:bg-[#292A2A]'}>
                <Header
                    className={
                        'flex items-center pl-3 pr-3 h-[48px] justify-between bg-white'}
                    style={{backgroundColor: colorBgContainer}}
                >
                    <div className={'flex items-center'}>
                        <Button
                            type="text"
                            icon={collapsed ?
                                <MenuFoldOne theme="filled" size="25" fill="#CEDFEF" strokeLinecap="butt"/> :
                                <MenuUnfoldOne theme="filled" size="25" fill="#CEDFEF" strokeLinecap="butt"/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                            }}
                        />
                        <Breadcrumb separator=">"
                                    className={'ml-3 mt-1'} items={breadValue}></Breadcrumb>
                    </div>
                    <div className={'flex'}>
                        <ToggleTheme></ToggleTheme>
                    </div>
                </Header>
                <Content
                    className={'p-[20px] dark:bg-[#1f2020] m-[15px] dark:text-[#fff] bg-white rounded-sm'}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Admin