import {useNavigate} from "react-router-dom";
import Logo from '@/assets/images/logo.png'
import {Button, Form, Input, message} from "antd";
import {Avatar, Fingerprint, Key} from "@icon-park/react";
import LeftBg from '@/assets/images/login-left.svg'
import {useEffect, useState} from "react";
import {get} from "@/utils/http.js";

const Login = () => {
    const navigate = useNavigate()
    const [captcha, setCaptcha] = useState({
        id: '',
        base64: ''
    })
    const getCaptcha = () => {
        get('/captcha').then(r => {
            if (r.code !== 200) {
                console.log(r)
                message.error('系统错误')
            } else {
                setCaptcha(r.data)
            }
        })
    }

    useEffect(() => {
        getCaptcha()
    }, [])
    return (
        <div
            className={'h-[100vh] bg-[#D5E1F2] w-full dark:bg-[#141414] dark:text-white flex justify-center items-center shadow-xl'}>
            <div className={'w-[900px] bg-white rounded-xl h-[550px] dark:bg-[#222631]'}>
                <div>
                    <div className={'flex items-center justify-center pt-5 pb-5 pl-3 pr-3 sm:justify-start'}>
                        <img src={Logo} className={'w-10 h-10'} alt=""/>
                        <span className={'text-lg font-bold select-none'}>IronTree</span>
                    </div>
                    <div className={'pl-3 pr-3 sm:pl-10 sm:pr-10 sm:justify-between sm:flex sm:items-center'}>
                        <div className={'hidden sm:block h-full -ml-10'}>
                            <img src={LeftBg} className={'h-[320px]'} alt=""/>
                        </div>
                        <div>
                            <span
                                className={'hidden sm:text-2xl sm:block sm:pb-10 font-bold text-blue-500 sm:text-center'}>WELCOME CLOUD</span>
                            <Form className={'max-w-[600px]'} labelAlign={'right'} labelCol={{span: 4}}>
                                <Form.Item label={'用户名'}>
                                    <Input
                                        prefix={<Avatar theme="outline" size="16" fill="#CEDFEF" strokeLinecap="butt"/>}
                                        placeholder={'请输入用户名'}
                                    ></Input>
                                </Form.Item>
                                <Form.Item label={'密码'}>
                                    <Input.Password
                                        prefix={<Key theme="outline" size="16" fill="#CEDFEF" strokeLinecap="butt"/>}
                                        placeholder={'请输入密码'}></Input.Password>
                                </Form.Item>
                                <Form.Item label={'验证码'}>
                                    <div className={'flex'}>
                                        <Input
                                            prefix={<Fingerprint theme="outline" size="16" fill="#CEDFEF"
                                                                 strokeLinecap="butt"/>}
                                            placeholder={'请输入验证码'}></Input>
                                        <img
                                            onClick={getCaptcha}
                                            src={captcha.base64}
                                            alt="" className={'w-[100px] h-[30px]'}/>
                                    </div>
                                </Form.Item>
                                <Form.Item>
                                    <a className={'text-blue-600 float-right'}>忘记密码</a>
                                </Form.Item>
                                <Form.Item className={'sm:mt-8'}>
                                    <Button className={'w-full bg-blue-600'} color={'blue'}
                                            type={"primary"}>登录</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;