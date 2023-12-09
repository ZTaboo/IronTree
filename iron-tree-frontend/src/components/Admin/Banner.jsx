import {Box, Comment, DataSheet} from "@icon-park/react";
import {useEffect, useRef, useState} from "react";
import anime from "animejs";

export const Banner = ({initInfo}) => {
    const [numInfo, setNumInfo] = useState({
        project: 0,
        todo: 0,
        message: 0
    })

    useEffect(() => {
        anime({
            targets: numInfo,
            project: 15,
            todo: 125,
            message: 534,
            easing: 'linear',
            round: 1,
            duration: 1500, // 设置动画持续时间，这里是2秒
            update: (anim) => {
                setNumInfo({
                    project: anim.animations[0].currentValue,
                    todo: anim.animations[1].currentValue,
                    message: anim.animations[2].currentValue
                });
            },
        });
    }, [])
    return (
        <div
            id={'js-object-log'}
            className={
                "min-h-[120px] w-full bg-white grid grid-cols-1 lg:grid-cols-2 dark:bg-dark p-[25px] select-none"
            }
        >
            <div className={"h-[80px] flex"}>
                <img
                    src={initInfo.avatar}
                    className={"h-full rounded-full select-none"}
                    alt=""
                />
                <div className={"ml-3 flex justify-center flex-col w-[200px] lg:w-full"}>
            <span className={"text-xl truncate"}>
              你好，{initInfo.role}，开始您一天的工作吧！
            </span>
                    <span className={"text-sub-title mt-2 truncate"}>
              今日阴转小雨，22℃ - 32℃，出门记得带伞哦。
            </span>
                </div>
            </div>
            <div className="flex text-[#606266] dark:text-white mt-5 lg:m-0 justify-end">
                <div className="h-[80px] flex flex-col items-center">
                    <div className="flex items-center justify-center mb-2">
                        <DataSheet
                            className="mr-1"
                            theme="multi-color"
                            size="22"
                            fill={["#333", "#2F88FF", "#FFF", "#43CCF8"]}
                        />
                        <span className=" text-sm">项目数</span>
                    </div>
                    <span className=" text-2xl">{numInfo.project}</span>
                </div>
                <div className="h-[80px] flex flex-col  ml-6 items-center">
                    <div className="flex items-center justify-center mb-2">
                        <Box
                            className="mr-1"
                            theme="multi-color"
                            size="22"
                            fill={["#333", "#2F88FF", "#FFF", "#43CCF8"]}
                        />
                        <span className=" text-sm">待办项</span>
                    </div>
                    <span className=" text-2xl">{numInfo.todo}</span>
                </div>
                <div className="h-[80px]">
                    <div className="h-[80px] flex flex-col  ml-6 items-center">
                        <div className="flex items-center justify-center mb-2">
                            <Comment
                                className="mr-1"
                                theme="multi-color"
                                size="22"
                                fill={["#333", "#2F88FF", "#FFF", "#43CCF8"]}
                            />
                            <span className="text-sm">消息</span>
                        </div>
                        <span className=" text-2xl">{numInfo.message}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}