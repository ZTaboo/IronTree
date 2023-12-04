import React, {useEffect} from 'react'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import router from "@/router.jsx";
import {ConfigProvider, theme} from "antd";
import {useTheme} from "@/store/store.jsx";
import './index.less'
import '@icon-park/react/styles/index.less'
import {HappyProvider} from "@ant-design/happy-work-theme";

const App = () => {
    const {dark, toggleTheme} = useTheme()

    const toggleThemeBtn = () => {
        toggleTheme()
        dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
    }
    useEffect(() => {
        !dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
    }, [dark])
    return (
        <ConfigProvider theme={{
            token: {
                "borderRadius": 2,
                "wireframe": false
            },
            algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}>
            {/*TODO:快乐模式*/}
            {/*<HappyProvider>*/}
            <RouterProvider router={router}></RouterProvider>
            {/*</HappyProvider>*/}
        </ConfigProvider>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App></App>
)
