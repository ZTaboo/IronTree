import {Button} from "antd";
import {Brightness, Sleep} from "@icon-park/react";
import {useTheme} from "@/store/store.jsx";
import {useEffect} from "react";
import localforage from "localforage";

export const ToggleTheme = () => {
    const {dark, toggleTheme} = useTheme()

    const toggleThemeBtn = () => {
        toggleTheme()
        dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
    }
    useEffect(() => {
        !dark ? document.querySelector('html').classList.remove('dark') : document.querySelector('html').classList.add('dark')
    }, [dark])
    return (
        <Button
            icon={!dark ? <Sleep theme="outline" size="25" fill="#CEDFEF" strokeLinecap="butt"/> :
                <Brightness theme="outline" size="25" fill="#F1F0FF" strokeLinecap="butt"/>}
            onClick={toggleThemeBtn}
        />
    )
}