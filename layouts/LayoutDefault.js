import React, { useState } from "react";
import { Layout, Space, Menu, Button } from "antd";
const { Header, Sider, Content } = Layout;
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import { setLogout } from "../lib/utils";

const LayoutDefault = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);

	const toggle = () => {
		setCollapsed(!collapsed);
	};

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className="logo">
					<Space
						direction="vertical"
						align="center"
						style={{ width: "100%", height: "100%" }}
					>
						<span>{collapsed ? "CT" : "Calendar Test"}</span>
					</Space>
				</div>
				<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
					<Menu.Item key="1" icon={<CalendarOutlined />}>
						Calendar
					</Menu.Item>
				</Menu>
			</Sider>
			<Layout className="site-layout">
				<Header
					className="site-layout-background"
					style={{ padding:"0 24px", display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
				>
					{collapsed ? (
						<MenuFoldOutlined
							className="trigger"
							onClick={toggle}
						></MenuFoldOutlined>
					) : (
						<MenuUnfoldOutlined
							className="trigger"
							onClick={toggle}
						></MenuUnfoldOutlined>
					)}
					<Button onClick={setLogout} type="danger" htmlType="button">
						Logout
					</Button>
				</Header>
				<Content
					className="site-layout-background"
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};

export default LayoutDefault;
