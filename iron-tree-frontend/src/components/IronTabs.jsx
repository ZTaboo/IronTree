import { useEffect, useState } from "react";
import { Close } from "@icon-park/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/ironTabs.css";
import { useTabs } from "../store/store";

export const IronTabs = () => {
  const [hoverSelect, setHoverSelect] = useState(null);
  const [thisTab, setThisTab] = useState(0);
  const localhost = useLocation();
  const navigate = useNavigate();
  const { tabs, delTabs } = useTabs();
  const [parent] = useAutoAnimate({
    duration: 300,
    easing: "ease-in-out",
    disrespectUserMotionPreference: true,
  });
  useEffect(() => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].path === localhost.pathname) {
        setThisTab(i);
        return;
      }
    }
  }, []);

  const closeBtn = (e, index) => {
    e.stopPropagation();
    console.log(thisTab);
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].path === localhost.pathname) {
        if (i === index) {
          navigate(tabs[index - 1].path);
          break;
        }
      }
    }

    delTabs(index - 1);
    setThisTab(thisTab - 1);
  };

  return (
    <div
      ref={parent}
      className="h-[38px] min-h-[38px] pl-[20px] pr-[20px] dark:bg-[#1F2020] flex items-end bg-white shadow-lg"
      style={{ borderTop: "1px solid rgba(5, 5, 5, 0.06)" }}
    >
      {tabs.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
          onMouseEnter={() => setHoverSelect(index)}
          onMouseLeave={() => setHoverSelect(thisTab)}
          className={
            "h-full flex items-center pl-[15px] pr-[3px] select-none cursor-pointer " +
            " transition-all duration-300 group " +
            `${
              localhost.pathname === item.path
                ? "bg-[#E8F4FF] dark:bg-[#111d2c] dark:hover:bg-[#111d2c] !hover:bg-[#E8F4FF] tabs-box"
                : "bg-[#fff] hover:bg-[#DEE1E6] dark:bg-[#1F2020] dark:hover:bg-[hsla(0,0%,100%,0.05)]"
            }`
          }
          style={
            hoverSelect === index
              ? {
                  paddingRight: "15px",
                }
              : {}
          }
        >
          <span
            className={`mr-2 ${
              localhost.pathname === item.path
                ? "text-blue-500"
                : "text-[#646D7F] dark:hover:text-[#ccc]"
            }`}
          >
            {item.label}
          </span>
          {index !== 0 ? (
            <Close
              onClick={(e) => closeBtn(e, index)}
              className={`mt-[3px] hover:bg-[#C0C4CC] !text-[#9e9b9b] hover:!text-[#fff] rounded-xl p-[3px] transition-colors duration-300 ${
                localhost.pathname !== item.path
                  ? "!opacity-0 group-hover:!opacity-100"
                  : ""
              }`}
              theme="outline"
              size="12"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};
