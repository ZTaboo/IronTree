import {lazy, Suspense, useEffect} from "react";
import {createBrowserRouter} from "react-router-dom";
import NProgress from 'nprogress'

const Home = lazy(() => import("@/views/Home/Home.jsx"))
const Login = lazy(() => import("@/views/Login/Login.jsx"))
const NoFound = lazy(() => import("@/views/NoFound/NoFound.jsx"))
const ZNProgress = () => {
    useEffect(() => {
        NProgress.start()
        return () => {
            NProgress.done()
        }
    }, [])
    return ''
}

const lazyLoad = (children) => {
    return (
        <Suspense fallback={<ZNProgress/>}>
            {children}
        </Suspense>
    )
}
const router = createBrowserRouter([
        {
            path: '*',
            element: lazyLoad(<NoFound/>)
        },
        {
            path: "/",
            element: lazyLoad(<Home/>)
        },
        {
            path: "/login",
            element: lazyLoad(<Login/>)
        }
    ]
)

export default router;