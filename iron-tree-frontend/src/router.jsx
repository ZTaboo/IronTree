import {lazy, Suspense, useEffect} from "react";
import {createBrowserRouter} from "react-router-dom";
import NProgress from "nprogress";

const Home = lazy(() => import("@/views/Home/Home.jsx"));
const Login = lazy(() => import("@/views/Login/Login.jsx"));
const NoFound = lazy(() => import("@/views/NoFound/NoFound.jsx"));
const Admin = lazy(() => import("@/views/Admin/Admin.jsx"));
const Dash = lazy(() => import("@/views/Admin/Dash/Dash.jsx"));
const Role = lazy(() => import("@/views/Admin/User/Role.jsx"));
const User = lazy(() => import("@/views/Admin/User/User.jsx"));
const Menu = lazy(() => import("@/views/Admin/User/Menu.jsx"));

const ZNProgress = () => {

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

const lazyLoad = (children) => {
    return <Suspense fallback={<ZNProgress/>}>{children}</Suspense>;
};

const router = createBrowserRouter([
    {
        path: "*",
        element: lazyLoad(<NoFound/>),
    },
    {
        path: "/",
        element: lazyLoad(<Home/>),
    },
    {
        path: "/login",
        element: lazyLoad(<Login/>),
    },
    {
        path: "/admin",
        element: lazyLoad(<Admin/>),
        children: [
            {
                index: true,
                element: lazyLoad(<Dash/>),
            },
            {
                path: "role",
                element: lazyLoad(<Role/>),
            },
            {
                path: "user",
                element: lazyLoad(<User/>),
            },
            {
                path: "menu",
                element: lazyLoad(<Menu/>),
            }
        ],
    },
]);

export default router;
