import {Button, Form, Modal, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";

const data = [
    {
        id: 1,
        createTime: '2022-01-01 00:00:00',
        name: '系统管理',
        type: 'menu',
        path: '/admin/system',
        icon: 'SettingOutlined',
        children: [
            {
                id: 2,
                createTime: '2022-01-01 00:00:00',
                name: '系统管理',
                type: 'button',
                path: '/admin/system',
                icon: 'SettingOutlined',
                children: [
                    {
                        id: 2,
                        createTime: '2022-01-01 00:00:00',
                        name: '系统管理',
                        type: 'button',
                        path: '/admin/system',
                        icon: 'SettingOutlined',
                        children: [
                            {
                                id: 2,
                                createTime: '2022-01-01 00:00:00',
                                name: '系统管理',
                                type: 'button',
                                path: '/admin/system',
                                icon: 'SettingOutlined',
                                children: [
                                    {
                                        id: 2,
                                        createTime: '2022-01-01 00:00:00',
                                        name: '系统管理',
                                        type: 'button',
                                        path: '/admin/system',
                                        icon: 'SettingOutlined',
                                        children: [
                                            {
                                                id: 2,
                                                createTime: '2022-01-01 00:00:00',
                                                name: '系统管理',
                                                type: 'button',
                                                path: '/admin/system',
                                                icon: 'SettingOutlined',
                                                children: [
                                                    {
                                                        id: 2,
                                                        createTime: '2022-01-01 00:00:00',
                                                        name: '系统管理',
                                                        type: 'button',
                                                        path: '/admin/system',
                                                        icon: 'SettingOutlined',
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

const Menu = () => {
    const [open, setOpen] = useState(false)
    const [editStatus, setEditStatus] = useState(false)
    const [form] = Form.useForm()
    const columns = [
        {
            width: 80,
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            width: 200,
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            width: 200,
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            width: 200,
            title: '菜单路径',
            dataIndex: 'path',
            key: 'path',
        }, {
            width: 200,
            title: '菜单图标',
            dataIndex: 'icon',
            key: 'icon',
        }, {
            width: 200,
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        }, {
            fixed: 'right',
            width: 200,
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => (
                <div>
                    <Button type={"link"} disabled={record.type === "button"}>编辑</Button>
                    <Button type={"link"}>删除</Button>
                </div>
            )
        }
    ]
    const initStatus = () => {
        setOpen(false)
    }

    return (
        <>
            <Modal open={open} onCancel={() => initStatus()}
                   title={editStatus ? '编辑菜单' : '新建菜单'}
            ></Modal>
            <div className={'bg-white dark:bg-dark p-4'}>
                <div className={'flex'}>
                    <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => setOpen(true)}>新建</Button>
                    <Button className={'ml-4'}>折叠全部</Button>
                    <Button className={'ml-4'}>展开全部</Button>
                </div>
                <div className={'mt-4'}>
                    <Table size={"small"} columns={columns} dataSource={data} scroll={{x: 900, y: 240}}></Table>
                </div>
            </div>
        </>
    )
}

export default Menu