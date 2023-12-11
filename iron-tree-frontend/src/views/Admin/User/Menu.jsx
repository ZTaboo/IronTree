import {
  TreeSelect,
  Button,
  Form,
  Modal,
  Table,
  Input,
  Radio,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { createElement } from "react";
import * as Icons from "@ant-design/icons";

const data = [
  {
    id: 1,
    key: 1,
    createTime: "2022-01-01 00:00:00",
    name: "系统管理",
    type: "menu",
    path: "/admin/system",
    icon: "SettingOutlined",
  },
];

const Menu = () => {
  const [open, setOpen] = useState(false);
  const [icons, setIcons] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [form] = Form.useForm();
  const menuTypeName = Form.useWatch("type", form);
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
      title: "菜单路径",
      dataIndex: "path",
      key: "path",
    },
    {
      width: 200,
      title: "菜单图标",
      dataIndex: "icon",
      key: "icon",
    },
    {
      width: 200,
      title: "类型",
      dataIndex: "type",
      key: "type",
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
          <Button type={"link"}>删除</Button>
        </div>
      ),
    },
  ];
  const initStatus = () => {
    setOpen(false);
  };
  const initIcons = () => {
    let tmpIconList = Object.keys(Icons).map((iconName) => ({
      label: [
        <span className="mr-2" key={iconName}>
          {createElement(Icons[iconName])}
        </span>,
        iconName,
      ],
      value: iconName,
    }));
    setIcons(tmpIconList);
  };
  const saveInfo = () => {
    console.log(form.getFieldsValue());
  };
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
        <Form form={form} className="mt-4" labelCol={{ span: 5 }}>
          <Form.Item
            label={"父级菜单"}
            tooltip={"如果没有则可跳过此项设置"}
            name={"parent"}
            colon
          >
            <TreeSelect
              placeholder="请选择父级目录"
              treeData={[
                {
                  title: "根目录",
                  value: "/",
                  children: [
                    {
                      title: "工作台",
                      value: "dash",
                    },
                  ],
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
            name={"menuName"}
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
            name={"sort"}
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
            name={"type"}
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
                required: menuTypeName === "menu" ? true : false,
                message: "请选择菜单图标",
              },
            ]}
            tooltip={"菜单所展示的Icon"}
            name={"icon"}
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
            name={"router"}
          >
            <Input placeholder="请输入路由地址"></Input>
          </Form.Item>
          <Form.Item
            label={"View路径"}
            rules={[
              {
                required: menuTypeName === "menu" ? true : false,
                message: "请输入页面路径",
              },
            ]}
            tooltip={"这里写的是前端src/下的地址，不需要/"}
            name={"path"}
          >
            <Input
              disabled={menuTypeName === "button"}
              placeholder="请输入页面路径"
            ></Input>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: menuTypeName === "button" ? true : false,
                message: "请输入权限标识",
              },
            ]}
            label={"权限标识"}
            tooltip={"示例:sys::user::delete,名字随便定义,用于权限控制"}
            name={"role"}
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
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            新建
          </Button>
          <Button className={"ml-4"}>折叠全部</Button>
          <Button className={"ml-4"}>展开全部</Button>
        </div>
        <div className={"mt-4"}>
          <Table
            size={"small"}
            columns={columns}
            dataSource={data}
            scroll={{ x: 900, y: 240 }}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default Menu;
