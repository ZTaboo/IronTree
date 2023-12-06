import {Button, Tooltip} from "antd";
import {Brightness, GrinningFaceWithSquintingEyes, Sleep, Workbench} from "@icon-park/react";
import {happyMode, useTheme} from "@/store/store.jsx";
import {useEffect} from "react";

export const ToggleTheme = () => {
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
            <Tooltip title={'切换配色'}>
                <Button
                    shape={'circle'}
                    style={dark ? {border: '1px solid #242525'} : {border: '1px solid #CEDFEF'}}
                    size={"small"}
                    icon={!dark ? <Sleep theme="outline" size="16" fill="#CEDFEF" strokeLinecap="butt"/> :
                        <Brightness theme="outline" size="16" fill="#F1F0FF" strokeLinecap="butt"/>
                    }
                    onClick={toggleThemeBtn}
                />
            </Tooltip>
            <Tooltip title={'切换快乐模式'}>
                <Button size={"small"} className={'ml-3'}
                        shape={'circle'}
                        onClick={() => toggleHappy()}
                        style={dark ? {border: '1px solid #242525'} : {border: '1px solid #CEDFEF'}}
                        icon={happy ?
                            <Workbench theme="filled" size="16" fill="#CEDFEF" strokeLinecap="butt"/> :
                            <GrinningFaceWithSquintingEyes theme="filled" size="16" fill="#CEDFEF"
                                                           strokeLinecap="butt"/>
                        }/>
            </Tooltip>

        </>

    )
}