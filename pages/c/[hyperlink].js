import React, { useState, useEffect } from "react";
import {
	Layout,
	Row,
	Col,
	Typography,
	Input,
	Form,
	Button,
	Card,
	Badge,
} from "antd";
const { Content } = Layout;
import LayoutEmpty from "../../layouts/LayoutEmpty";
import moment from "moment";
import absoluteUrl from "next-absolute-url";

const Hyperlink = props => {
	const [form] = Form.useForm();
	const [events, setEvents] = useState(props.calendar.events);

	const onFinish = async data => {
		const res = await fetch("/api/createEvent", {
			method: "POST",
			body: JSON.stringify({
				event: data.event,
				calendarId: props.calendar.id,
			}),
		});
		const resp = await res.json();
		if (!resp.success) {
			return message.error(resp.message);
		}
		setEvents([...events, resp.data]);
		form.setFieldsValue({event: ""})
	};

	return (
		<LayoutEmpty>
			<Content style={{ padding: 20 }}>
				<Typography.Title level={4}>
					Create Event at{" "}
					{moment(props.calendar.date).format("DD MMMM YYYY")}
				</Typography.Title>
				<Row gutter={10}>
					<Col span={6}>
						<Card>
							<Form
								requiredMark={false}
								form={form}
								onFinish={onFinish}
								layout="vertical"
							>
								<Form.Item
									label="Event Name"
									name="event"
									rules={[
										{
											required: true,
											message:
												"Please input your event name!",
										},
									]}
								>
									<Input placeholder="Event Name" />
								</Form.Item>
								<Form.Item>
									<Button
										block
										type="primary"
										htmlType="submit"
									>
										Add Event
									</Button>
								</Form.Item>
							</Form>
						</Card>
					</Col>
					<Col span={8}>
						<Card title="Events">
							{events.length > 0 ? (
								<ul className="events">
									{events.map(item => (
										<li key={item.event}>
											<Badge
												status="success"
												text={item.event}
											/>
										</li>
									))}
								</ul>
							) : (
								<Typography.Title level={5}>
									No events, create a new one
								</Typography.Title>
							)}
						</Card>
					</Col>
				</Row>
			</Content>
		</LayoutEmpty>
	);
};

export async function getServerSideProps({ req, params }) {
	const { origin } = absoluteUrl(req);
	const res = await fetch(
		`${origin}/api/getEvent?hyperlink=${params.hyperlink}`
	);
	const resp = await res.json();
	if (!resp.success || !resp.data) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			calendar: resp.data,
		},
	};
}

export default Hyperlink;
