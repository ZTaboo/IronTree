import {Button, Form, Input, message, Modal, Popconfirm, Select, Table, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {deleteHttp, getHttp, postHttp} from "@/utils/http.js";
import {baseUrl} from "@/utils/base.js";
import {RefreshOne} from "@icon-park/react";

let searchInfo = {
    status: false, con: ""
}
const User = () => {
    const [dataSource, setDataSource] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [pagination, setPagination] = useState({
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 30, 40, 50],
        onChange: (page, pageSize) => {
            if (searchInfo.status) {
                searchData(searchInfo.con, page, pageSize)
            } else {
                console.log("get data")
                getData(page, pageSize)
            }
        }
    })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUserState, setEditUserState] = useState(false)       // true:编辑用户;false:创建用户
    const [formRef] = Form.useForm()

    const columns = [{
        width: 90, title: '序号', dataIndex: 'key', key: 'key',
        sorter: {
            compare: (a, b) => {
                return a.key - b.key
            }, multiple: 3,
        },
    }, {
        width: 150, title: '用户名', dataIndex: 'username', key: 'username',
    }, {
        width: 100, title: '性别', dataIndex: 'gender', key: 'gender',
        render: (_, record) => (
            <Tag color={record.gender === 1 ? 'blue' : 'pink'}>{record.gender === 1 ? "男" : "女"}</Tag>
        )
    }, {
        width: 200, title: '昵称', dataIndex: 'nickname', key: 'nickname',
    }, {
        width: 200, title: '邮箱', dataIndex: 'email', key: 'email',
    }, {
        width: 200, title: '电话', dataIndex: 'phone', key: 'phone',
    }, {
        width: 200, title: '角色', dataIndex: 'role', key: 'role',
        render: (_, record) => (
            <div>
                {record.role.map((item, index) => {
                    return <Tag color={"blue"} key={index}>{item}</Tag>
                })}
            </div>
        )
    }, {
        width: 130, title: '操作', dataIndex: 'event', fixed: 'right', key: 'event', render: (_, record) => (<div>
            <Button size={"small"} type={"link"} onClick={() => {
                setEditUserState(true)
                setIsModalOpen(true)
                formRef.setFieldsValue(record)
            }}>编辑</Button>
            <Popconfirm title={'危险操作'} description={"你确定要删除这个用户么?"}
                        onConfirm={() => deleteEvent(record.username)}>
                <Button type={"text"} size={"small"} danger className={'ml-4'}>删除</Button>
            </Popconfirm>
        </div>)
    }]
    const getData = (current, pageSize) => {
        setLoading(true)
        getHttp(`/api/users/${current}/${pageSize}/asc`).then(r => {
            if (r.code === 200) {
                let tmpList = []
                r.data.map((item, index) => {
                    tmpList.push({...item, avatar: `${baseUrl}/${item.avatar}`, key: index + 1})
                })
                // 设置分页
                setPagination({...pagination, total: r.total, current, pageSize})
                // 添加数据
                setDataSource(tmpList)
            } else {
                messageApi.error(`获取数据失败:${r.msg}`)
            }
            setLoading(false)
        })
    }
    const searchData = (con, current, pageSize) => {
        setLoading(true)
        getHttp(`/api/search_user/${con}/${current}/${pageSize}`).then(r => {
            if (r.code === 200) {
                let tmpList = []
                r.data.map((item, index) => {
                    tmpList.push({...item, avatar: `${baseUrl}/${item.avatar}`, key: index + 1})
                })
                // 设置分页
                setPagination({...pagination, total: r.total, current, pageSize})
                // 添加数据
                setDataSource(tmpList)
            } else {
                messageApi.error(`获取数据失败:${r.msg}`)
            }
            setLoading(false)
        })
    }
    const initAllData = () => {
        setSelectedRowKeys([])
        getData(pagination.current, pagination.pageSize)
        searchInfo = {status: false, con: ""}
        setEditUserState(false)
        setIsModalOpen(false)
    }
    const deleteEvent = (users) => {
        deleteHttp(`/api/del_user/${users}`).then(r => {
            if (r.code === 200) {
                messageApi.success("删除成功")
                initAllData()
            } else {
                messageApi.error(`删除失败:${r.msg}`)
            }
            setLoading(false)
        })
    }
    const deleteClick = () => {
        selectedRowKeys.length === 0 ? messageApi.error("请选择要删除的数据") : setLoading(true)
        let users = selectedRowKeys.map(item => {
            return item.username
        }).join(",")
        deleteEvent(users)
    }
    const searchClick = (v) => {
        if (v.trim() === "") {
            initAllData()
            getData(1, pagination.pageSize)
            return
        }
        searchInfo = {status: true, con: v}
        searchData(v, pagination.current, pagination.pageSize)
    }
    // 表格选择事件
    const tableRow = (selectedKeys, selectedRows) => {
        let status = false
        selectedRows.map((item, index) => {
            // 删除指定索引数据
            if (item.role.includes("超级管理员")) {
                status = true
                messageApi.error("不可删除超级管理员")
            }
        })
        status ? setSelectedKeys([]) : setSelectedKeys(selectedKeys)
        setSelectedRowKeys(selectedRows)
    }
    // 添加用户
    const addClick = () => {
        formRef.validateFields().then(r => {
            console.log(r)
            postHttp('/api/add_user', r).then(r => {
                if (r.code === 200) {
                    messageApi.success("添加成功")
                    initAllData()
                    setIsModalOpen(false)
                } else {
                    messageApi.error(`创建用户失败:${r.msg}`)
                }
            })
        }).catch(e => {
            console.log(e)
        })
    }
    // 编辑用户
    const editClick = () => {
        formRef.validateFields().then(r => {
            postHttp('/api/update-user', r).then(r => {
                if (r.code === 200) {
                    messageApi.success("编辑成功")
                    initAllData()
                    setIsModalOpen(false)
                } else {
                    messageApi.error(`编辑用户失败:${r.msg}`)
                }
            })
        })
    }
    useEffect(() => {
        getData(pagination.current, pagination.pageSize)
    }, [])
    return (<div className={'bg-white dark:bg-dark pl-4 pr-4 pb-4'}>
        {contextHolder}
        <Modal title={!editUserState ? '用户添加' : '用户编辑'} open={isModalOpen}
               destroyOnClose={true}
               onOk={() => {
                   editUserState ? editClick() : addClick()
               }}
               onCancel={() => initAllData()}>
            <Form labelAlign={"right"} labelCol={{span: 4}} preserve={false} className={'mt-4'} form={formRef}>
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{
                        required: true, message: '请输入用户名',
                    },]}
                >
                    <Input disabled={editUserState} placeholder={'请输入用户名'}/>
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                >
                    <Input placeholder={'请输入邮箱'}/>
                </Form.Item>
                <Form.Item
                    label="性别"
                    name="gender"
                    rules={[{
                        required: true, message: '请选择性别',
                    },]}
                >
                    <Select
                        allowClear
                        style={{width: '100%'}}
                        placeholder="请选择性别"
                        options={[{label: '男', value: 1}, {label: '女', value: 2}]}
                    />
                </Form.Item>
                <Form.Item
                    label="昵称"
                    name="nickname"
                    rules={[{
                        required: true, message: '请输入昵称',
                    },]}
                >
                    <Input placeholder={'请输入昵称'}/>
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{
                        required: !editUserState, message: '请输入密码',
                    },]}
                >
                    <Input placeholder={'请输入密码'}/>
                </Form.Item>
                <Form.Item
                    label="角色"
                    name="role"
                    rules={[{
                        required: true, message: '请选择角色',
                    },]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="请选择角色"
                        options={[{label: '超级管理员', value: '超级管理员'}, {
                            label: '普通用户',
                            value: '普通用户'
                        }]}
                    />
                </Form.Item>


            </Form>
        </Modal>
        {/*顶部功能按钮*/}
        <div className={'flex sm:justify-between justify-end flex-wrap sm:flex-nowrap w-full'}>
            <div className={'mt-4'}>
                <Button type={"primary"} onClick={() => {
                    setEditUserState(false)
                    setIsModalOpen(true)
                }}>添加</Button>
                <Button type={"primary"} danger className={'ml-4'} onClick={deleteClick}>删除</Button>
            </div>
            <div className={'flex ml-4 mt-4'}>
                <Input.Search placeholder={'请输入用户名'} enterButton onSearch={searchClick}></Input.Search>
                <Tooltip title={'刷新'}>
                    <Button className={'ml-4'}
                            type={"text"}
                            icon={<RefreshOne theme="multi-color" size="16" fill="#CEDFEF" strokeLinecap="round"/>}
                            onClick={() => getData(pagination.current, pagination.pageSize)}
                    />
                </Tooltip>
            </div>
        </div>
        {/*    表格内容*/}
        <Table size={"small"}
               rowSelection={{
                   type: "checkbox", selectedRowKeys: selectedKeys, onChange: tableRow
               }}
               columns={columns}
               dataSource={dataSource}
               className={'mt-4'}
               scroll={{x: 900}}
               loading={loading}
               pagination={pagination}
        ></Table>
    </div>)
}

export default User