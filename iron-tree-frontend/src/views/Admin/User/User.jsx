import {Button, Input, message, Popconfirm, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {deleteHttp, getHttp} from "@/utils/http.js";
import {baseUrl} from "@/utils/base.js";
import {RefreshOne} from "@icon-park/react";

let searchInfo = {
    status: false,
    con: ""
}
const User = () => {
    const [dataSource, setDataSource] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
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

    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const columns = [
        {
            width: 90,
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            sorter: {
                compare: (a, b) => {
                    return a.key - b.key
                },
                multiple: 3,
            },
        }, {
            width: 200,
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
        }, {
            width: 130,
            title: '操作',
            dataIndex: 'event',
            fixed: 'right',
            key: 'event',
            render: (_, record) => (
                <div>
                    <Button size={"small"} type={"link"}>编辑</Button>
                    <Popconfirm title={'危险操作'} description={"你确定要删除这个用户么?"}
                                onConfirm={() => deleteEvent(record.username)}>
                        <Button type={"text"} size={"small"} danger className={'ml-4'}>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    ]
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
    useEffect(() => {
        getData(pagination.current, pagination.pageSize)
    }, [])
    return (
        <div className={'bg-white dark:bg-dark pl-4 pr-4 pb-4'}>
            {contextHolder}
            {/*顶部功能按钮*/}
            <div className={'flex sm:justify-between justify-end flex-wrap sm:flex-nowrap w-full'}>
                <div className={'mt-4'}>
                    <Button type={"primary"}>添加</Button>
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
                       type: "checkbox",
                       selectedRowKeys: selectedKeys,
                       onChange: tableRow
                   }}
                   columns={columns}
                   dataSource={dataSource}
                   className={'mt-4'}
                   scroll={{x: 900}}
                   loading={loading}
                   pagination={pagination}
            ></Table>
        </div>
    )
}

export default User