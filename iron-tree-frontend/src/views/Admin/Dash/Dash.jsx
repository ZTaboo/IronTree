import { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/base";
import localforage from "localforage";
import { DataSheet, Comment, Box } from "@icon-park/react";

const Dash = () => {
  const [initInfo, setInitInfo] = useState({
    avatar: "",
    role: "",
  });
  useEffect(() => {
    localforage.getItem("user").then((r) => {
      setInitInfo({
        ...initInfo,
        avatar: `${baseUrl}/${r.avatar}`,
        role: r.role,
      });
    });
  }, []);
  return (
    <div>
      <div
        className={
          "min-h-[120px] w-full bg-white grid grid-cols-1 lg:grid-cols-2 dark:bg-dark p-[25px]"
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
            <span className=" text-2xl">3</span>
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
            <span className=" text-2xl">8/24</span>
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
              <span className=" text-2xl">120</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;
