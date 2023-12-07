import {Button, FloatButton, Tooltip} from "antd";
import {Brightness, GrinningFaceWithSquintingEyes, Sleep, Toolkit, Workbench} from "@icon-park/react";
import {happyMode, useTheme} from "@/store/store.jsx";
import {useEffect} from "react";

export const HeaderRightBox = () => {
    const {dark, toggleTheme} = useTheme()
    const toggleThemeBtn = () => {
        toggleTheme()
        dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
    }
    const {happy, toggleHappy} = happyMode()
    useEffect(() => {
        !dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
    }, [dark])
    return (
        <>
            <FloatButton.Group trigger={"hover"}
                               icon={<Toolkit theme="filled" size="16" fill="#CEDFEF" strokeLinecap="butt"/>}>
                <Tooltip placement={'left'} title={!dark ? '切换深色模式' : '切换浅色模式'}>
                    <FloatButton
                        icon={!dark ? <Sleep theme="outline" size="16" fill="#CEDFEF" strokeLinecap="butt"/> :
                            <Brightness theme="outline" size="16" fill="#F1F0FF" strokeLinecap="butt"/>}
                        onClick={toggleThemeBtn}

                    ></FloatButton>
                </Tooltip>
                <Tooltip placement={'left'} title={!happy ? '切换快乐模式' : '切换工作模式'}>
                    <FloatButton
                        icon={happy ?
                            <Workbench theme="filled" size="16" fill="#CEDFEF" strokeLinecap="butt"/> :
                            <GrinningFaceWithSquintingEyes theme="filled" size="16" fill="#CEDFEF"
                                                           strokeLinecap="butt"/>}
                        onClick={toggleHappy}
                    ></FloatButton>
                </Tooltip>
            </FloatButton.Group>
        </>

    )
}