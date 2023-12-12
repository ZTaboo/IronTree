import {
    TreeSelect,
    Button,
    Form,
    Modal,
    Table,
    Input,
    Radio,
    Select, Tag,
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {createElement} from "react";
import * as Icons from "@ant-design/icons";

const Menu = () => {
    const [open, setOpen] = useState(false);
    const [icons, setIcons] = useState([]);
    const [dataSource, setDataSource] = useState();
    const [editStatus, setEditStatus] = useState(false);
    const [form] = Form.useForm();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const menuTypeName = Form.useWatch("menu_type", form);
    const columns = [
        {
            width: 80,
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            width: 200,
            title: "创建时间",
            dataIndex: "createTime",
            key: "createTime",
        },
        {
            width: 200,
            title: "菜单名称",
            dataIndex: "name",
            key: "name",
        },
        {
            width: 200,
            title: "组件路径",
            dataIndex: "path",
            key: "path",
        },
        {
            width: 200,
            title: "路由路径",
            dataIndex: "router",
            key: "router",
        },
        {
            width: 200,
            title: "菜单图标",
            dataIndex: "icon",
            key: "icon",
            render: (_, record) => (
                <div>
                    <span>{createElement(Icons[record.icon])}</span>
                    <span className={'ml-2'}>{record.icon}</span>
                </div>
            ),
        },
        {
            width: 200,
            title: "类型",
            dataIndex: "type",
            key: "type",
            render: (_, record) => (
                <Tag color={record.type === "menu" ? 'blue' : 'red'}>{record.type === "menu" ? "菜单" : "按钮"}</Tag>
            ),
        },
        {
            fixed: "right",
            width: 200,
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (_, record) => (
                <div>
                    <Button type={"link"} disabled={record.type === "button"}>
                        编辑
                    </Button>
                    <Button type={"link"} danger={true}>删除</Button>
                </div>
            ),
        },
    ];
    const initStatus = () => {
        setOpen(false);
    };
    const initIcons = () => {
        let tmpIconList = []
        for (let i = 0; i < Object.keys(Icons).length; i++) {
            let iconName = Object.keys(Icons)[i];
            if (typeof Icons[iconName] === "object" && Icons[iconName] !== null && iconName.trim() !== "") {
                tmpIconList.push({
                    label: [
                        <span className="mr-2" key={iconName}>
                            {createElement(Icons[iconName])}
                        </span>,
                        iconName,
                    ],
                    value: iconName,
                })
            } else {
                break
            }

        }
        setIcons(tmpIconList);
    };
    const saveInfo = () => {
        console.log(form.getFieldsValue());
    };
    // 表格展开受控事件
    const onExpand = (record, event) => {
        if (record) {
            setExpandedRowKeys([...expandedRowKeys, event.key])
        } else {
            const index = expandedRowKeys.findIndex((e) => e === event.key);
            expandedRowKeys.splice(index, 1);
            setExpandedRowKeys([...expandedRowKeys])
        }
    }
    // 展开全部表格事件
    const expandAllBtn = () => {
        let tmpList = []
        dataSource && dataSource.map(item => {
            if (item.children) {
                tmpList.push(item.key)
            }
        })
        setExpandedRowKeys(tmpList)
    }
    //  切换菜单类型时处理表单内容
    useEffect(() => {
        form.setFieldValue("icon", null);
        form.setFieldValue("router", null);
        form.setFieldValue("path", null);
        form.setFieldValue("role", null);
    }, [menuTypeName]);

    useEffect(() => {
        initIcons();
    }, []);

    return (
        <>
            <Modal
                width={600}
                open={open}
                onOk={saveInfo}
                onCancel={() => initStatus()}
                title={editStatus ? "编辑菜单" : "新建菜单"}
            >
                <Form form={form} className="mt-4" labelCol={{span: 5}}>
                    <Form.Item
                        label={"父级菜单"}
                        tooltip={"请选择父级目录"}
                        name="parent"
                        rules={[
                            {
                                required: true,
                                message: "请选择父级目录",
                            },
                        ]}
                        initialValue={0}
                        colon
                    >
                        <TreeSelect
                            showSearch
                            switcherIcon={<PlusOutlined/>}
                            placeholder="请选择父级目录"
                            treeDefaultExpandAll
                            treeData={[
                                {
                                    title: "根目录",
                                    value: 0,
                                    children: [
                                        {
                                            title: "工作台1",
                                            value: "dash1",
                                        },
                                    ]
                                },
                            ]}
                        ></TreeSelect>
                    </Form.Item>
                    <Form.Item
                        label={"菜单名称"}
                        rules={[
                            {
                                required: true,
                                message: "请输入菜单名称",
                            },
                        ]}
                        tooltip={"后台展示的菜单名字"}
                        name="menuName"
                    >
                        <Input placeholder="请输入菜单名称"></Input>
                    </Form.Item>
                    <Form.Item
                        label={"排序ID"}
                        rules={[
                            {
                                required: true,
                                message: "请输入排序ID",
                            },
                        ]}
                        tooltip={"根据数字进行从大到小排序"}
                        name="sort"
                    >
                        <Input placeholder="排序ID"></Input>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "请选择菜单类型",
                            },
                        ]}
                        label={"菜单类型"}
                        tooltip={"菜单是后台页面,按钮是api接口"}
                        name="menu_type"
                        initialValue={"menu"}
                    >
                        <Radio.Group>
                            <Radio value={"menu"}>菜单</Radio>
                            <Radio value={"button"}>按钮</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={"菜单图标"}
                        rules={[
                            {
                                required: menuTypeName === "menu",
                                message: "请选择菜单图标",
                            },
                        ]}
                        tooltip={"菜单所展示的Icon"}
                        name="icon"
                    >
                        <Select
                            placeholder="请选择图标"
                            options={icons}
                            showSearch
                            disabled={menuTypeName === "button"}
                        ></Select>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: "请输入路由地址",
                            },
                        ]}
                        label={"router路径"}
                        tooltip={"菜单类型是前端router地址,按钮类型是api完整请求地址"}
                        name="router"
                    >
                        <Input placeholder="请输入路由地址"></Input>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: menuTypeName === "button",
                                message: "请输入权限标识",
                            },
                        ]}
                        label={"权限标识"}
                        tooltip={"示例:sys::user::delete,名字随便定义,用于权限控制"}
                        name="role"
                    >
                        <Input
                            disabled={menuTypeName === "menu"}
                            placeholder="请输入权限标识"
                        ></Input>
                    </Form.Item>
                </Form>
            </Modal>
            <div className={"bg-white dark:bg-dark p-4"}>
                <div className={"flex"}>
                    <Button
                        type={"primary"}
                        icon={<PlusOutlined/>}
                        onClick={() => setOpen(true)}
                    >
                        新建
                    </Button>
                    <Button className={"ml-4"} onClick={() => setExpandedRowKeys([])}>折叠全部</Button>
                    <Button className={"ml-4"} onClick={expandAllBtn}>展开全部</Button>
                </div>
                <div className={"mt-4"}>
                    <Table
                        expandable={{
                            expandedRowKeys: expandedRowKeys, onExpand: onExpand,
                        }}
                        size={"small"}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{x: 900, y: 240}}
                    ></Table>
                </div>
            </div>
        </>
    );
};

export default Menu;
