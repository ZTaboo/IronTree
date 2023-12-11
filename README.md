## IronTree Axum

> axum后台快速开发框架后端

### 技术选型

- Axum：Tokio开源web框架

- MongoDB：非关系行数据库

- moka-rs：快速、并发的 Rust 缓存库

## 基础功能

- [x] 请求压缩
- [ ] 配置热更新
- [ ] rbac权限管理
- [ ] 日志审查
  - [ ] 登陆日志
  - [ ] 操作日志
- [ ] 案例演示（前端）
- [ ] 验证码登录/注册
- [ ] 服务器监控
- [ ] 定时任务

## 安全性

- [x] argon2用户加密

## Tip

### 菜单权限模型

```json
{
  "父级菜单": "父级菜单id",
  "菜单名称": "name",
  "创建时间": "time",
  // 菜单;按钮
  "菜单类型": "type",
  // 菜单:前端页面地址;按钮:后端api地址
  "路由地址": "txt"
  "页面路径": "前端页面路径",
  "菜单图标": "选择图标",
}
```