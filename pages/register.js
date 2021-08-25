import { Space, Card, Typography, Form, Input, Button, message, } from "antd";
import LayoutEmpty from "../layouts/LayoutEmpty";
import {getAppCookies, verifyToken} from '../lib/utils'

const Register = () => {
	const [form] = Form.useForm();

	const onFinish = async data => {
		const res = await fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify(data)
		})

		const resp = await res.json();
		if(resp.success) {
			message.success(resp.message)
			form.resetFields()
		}else{
			message.error(resp.message)
		}
	};

	return (
		<LayoutEmpty>
			<Space
				align="center"
				style={{ height: "100vh" }}
				direction="horizontal"
			>
				<Space
					align="center"
					style={{ width: "100vw" }}
					direction="vertical"
				>
					<Card style={{ width: 300 }}>
						<Typography.Title
							style={{ textAlign: "center" }}
							level={3}
						>
							Register
						</Typography.Title>
						<Form
							onFinish={onFinish}
							form={form}
							layout="vertical"
							requiredMark={false}
						>
							<Form.Item
								name="username"
								label="Username"
								rules={[
									{
										required: true,
										message: "Please input your username!",
									},
								]}
							>
								<Input placeholder="Username" />
							</Form.Item>
							<Form.Item
								name="password"
								label="Password"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
								]}
							>
								<Input.Password placeholder="Password" />
							</Form.Item>
							<Form.Item>
								<Button block type="primary" htmlType="submit">
									Register
								</Button>
							</Form.Item>
							<Typography.Text
								style={{
									display: "flex",
									justifyContent: "center",
									gap: 2,
								}}
							>
								Already have account?{" "}
								<Typography.Link href="/login">
									Login
								</Typography.Link>
							</Typography.Text>
						</Form>
					</Card>
				</Space>
			</Space>
		</LayoutEmpty>
	);
};

export async function getServerSideProps(context) {
	const { req } = context;
	const { token } = getAppCookies(req);
	const profile = token ? verifyToken(token) : "";
	if (profile) {
		return {
			redirect: {
				destination: "/",
			},
		};
	}
	return {
		props: {},
	};
}

export default Register;
