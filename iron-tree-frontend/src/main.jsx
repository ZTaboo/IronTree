import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import router from "@/router.jsx";
import {ConfigProvider, theme} from "antd";
import {happyMode, useTheme} from "@/store/store.jsx";
import zhCN from 'antd/locale/zh_CN';
import './index.less'
import '@icon-park/react/styles/index.less'
import {HappyProvider} from "@ant-design/happy-work-theme";

const lightToken = {
    borderRadius: 2,
    colorPrimary: '#1890ff',
    colorBgContainer: "#fff"
}

const darkToken = {
    borderRadius: 2,
    colorPrimary: '#1890ff',
    colorBgContainer: "#1f2020"
}
const App = () => {
    const {dark} = useTheme()
    const {happy} = happyMode()
    const [tokenTheme, setTokenTheme] = useState({})
    useEffect(() => {
        !dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
        !dark ? setTokenTheme(lightToken) : setTokenTheme(darkToken)
    }, [dark])
    return (
        <ConfigProvider locale={zhCN} theme={{
            components: {
                Dropdown: {
                    controlHeight: 27
                },
                Menu: {
                    darkItemBg: '#242525',
                    darkSubMenuItemBg: '#252828',
                }
            },
            token: tokenTheme,
            algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}>
            {/*TODO:快乐模式*/}
            <HappyProvider disabled={!happy}>
                <RouterProvider router={router}></RouterProvider>
            </HappyProvider>
        </ConfigProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App></App>
)
