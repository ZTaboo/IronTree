import {CoordinateSystem, EveryUser, ExpandDown, FileEditing, Log, Workbench} from "@icon-park/react";

export const menuList = [
    {
        key: '/admin/dash',
        icon: <Workbench theme="filled" size="16" fill="#CFDEE7" strokeLinecap="butt"/>,
        label: '工作台',
    }, {
        key: 'user',
        icon: <EveryUser theme="filled" size="16" fill="#CFDEE7" strokeLinecap="butt"/>,
        label: '用户管理',
        children: [
            {
                key: '/user/user',
                label: '用户管理',
            },
            {
                key: '/user/role',
                label: '角色管理',
            },

            {
                key: '/user/menu',
                label: '菜单管理',
            }
        ]
    },
    {
        key: 'examplePage',
        icon: <ExpandDown theme="filled" size="16" fill="#CFDEE7" strokeLinecap="butt"/>,
        label: '示例页',
    }, {
        key: 'edit',
        icon: <FileEditing theme="filled" size="16" fill="#CFDEE7" strokeLinecap="butt"/>,
        label: '图编辑器',
        children: [
            {
                key: 'loading',
                label: '待定',
            }
        ]
    }, {
        key: 'log',
        icon: <Log theme="filled" size="16" fill="#CFDEE7" strokeLinecap="butt"/>,
        label: '日志审计',
        children: [
            {
                key: 'loginLog',
                label: '登录日志',
            },
            {
                key: 'operationLog',
                label: '操作日志',
            }
        ]
    },
    {
        key: 'setting',
        icon: <CoordinateSystem theme="filled" size="16" fill="#CFDEE7" strokeLinecap="butt"/>,
        label: '系统设置',
        children: [
            {
                key: 'smtp',
                label: '邮件配置',
            }
        ]
    },
]