import {lazy, Suspense, useEffect} from "react";
import {createBrowserRouter, Navigate} from "react-router-dom";
import NProgress from "nprogress";

const Home = lazy(() => import("@/views/Home/Home.jsx"));
const Login = lazy(() => import("@/views/Login/Login.jsx"));
const NoFound = lazy(() => import("@/views/NoFound/NoFound.jsx"));
const Admin = lazy(() => import("@/views/Admin/Admin.jsx"));
const Dash = lazy(() => import("@/views/Admin/Dash/Dash.jsx"));
const Role = lazy(() => import("@/views/Admin/User/Role.jsx"));
const User = lazy(() => import("@/views/Admin/User/User.jsx"));
const Menu = lazy(() => import("@/views/Admin/User/Menu.jsx"));

export const ZNProgress = () => {

    useEffect(() => {
        NProgress.start();
        // const timer = setTimeout(() => {
        //     NProgress.start();
        // }, 0); // 例如，延迟100ms开始
        return () => {
            // clearTimeout(timer);
            NProgress.done();
        };
    }, []);
    return <div className={"dark:bg-[#232324] h-[100vh]"}></div>;
};

export const lazyLoad = (children) => {
    return <Suspense fallback={<ZNProgress/>}>{children}</Suspense>;
};

export const modulePaths = import.meta.glob(`./views/**/*.jsx`);

export const router = [
    {
        path: "*",
        element: lazyLoad(<NoFound/>),
    },
    {
        path: "/",
        element: lazyLoad(<Login/>),
    },
    {
        path: "/user",
        element: lazyLoad(<Admin/>),
        children: [
            {       // 重定向到指定路由
                path: "",
                element: <Navigate to="user" replace/>,
            },
            {
                path: "user",
                element: lazyLoad(<User/>),
            },
            {
                path: "role",
                element: lazyLoad(<Role/>),
            },

            {
                path: "menu",
                element: lazyLoad(<Menu/>),
            }
        ]
    },
    {
        path: "/admin",
        element: lazyLoad(<Admin/>),
        children: [
            {       // 重定向到指定路由
                path: "",
                element: <Navigate to="dash" replace/>,
            },
            {
                path: "dash",
                element: lazyLoad(<Dash/>),
            },

        ],
    },
];

