import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'; // 动态依赖插件

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "src")
        }
    },
    plugins: [react(),
        dynamicImportVars({
            //这里配置插件在那个文件夹内生效 这里是在router文件夹内生效
            include: ["src"],
            //这里是哪些文件夹内不生效
            exclude: [],
            //插件在遇到错误时会退出构建过程。如果您将此选项设置为 true，它将引发警告，并且保持代码不变。
            warnOnError: false
        })
    ],
})
