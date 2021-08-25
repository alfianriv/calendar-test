import React, { useState, useEffect } from "react";
import {
	Layout,
	Calendar,
	Badge,
	Row,
	Col,
	Select,
	Typography,
	Modal,
	Input,
	Form,
	Button,
	Card,
} from "antd";
import randomstring from "randomstring";
const { Content } = Layout;
import { getAppCookies, verifyToken } from "../lib/utils";
import LayoutDefault from "../layouts/LayoutDefault";
import moment from "moment";
import absoluteUrl from "next-absolute-url";

const Home = () => {
	const [form] = Form.useForm();
	const [selectedDate, setSelectedDate] = useState(moment());
	const [data, setData] = useState(null);

	useEffect(() => {
		getData(selectedDate);
	}, [selectedDate]);

	const getData = async date => {
		const res = await fetch(
			`/api/getCalendar?date=${moment(date).format("YYYY-MM-DD")}`
		);
		const resp = await res.json();
		setData(resp.data);
		if (resp.data) {
			form.setFieldsValue({hyperlink: `${origin}/c/${resp.data.hyperlink}`});
		}
	};

	function onPanelChange(value, mode) {
	}

	const onFinish = async data => {
		const res = await fetch(`/api/createCalendar`, {
			method: "POST",
			body: JSON.stringify({
				hyperlink: generate(),
				date: selectedDate.format("YYYY-MM-DD"),
			}),
		});
		const resp = await res.json();
		setData(resp.data);
		if (resp.data) {
			form.setFieldsValue(resp.data);
		}
	};

	const generate = () => {
		return randomstring.generate({
			length: 7,
			charset: "alphabetic",
		});
	};

	return (
		<LayoutDefault>
			<Content>
				<Typography.Title level={4}>My Calendar</Typography.Title>

				<Row gutter={20}>
					<Col className="gutter-row" span={12}>
						<Calendar
							fullscreen={false}
							headerRender={({
								value,
								type,
								onChange,
								onTypeChange,
							}) => {
								const start = 0;
								const end = 12;
								const monthOptions = [];

								const current = value.clone();
								const localeData = value.localeData();
								const months = [];
								for (let i = 0; i < 12; i++) {
									current.month(i);
									months.push(
										localeData.monthsShort(current)
									);
								}

								for (let index = start; index < end; index++) {
									monthOptions.push(
										<Select.Option
											className="month-item"
											key={`${index}`}
										>
											{months[index]}
										</Select.Option>
									);
								}
								const month = value.month();

								const year = value.year();
								const options = [];
								for (let i = year - 10; i < year + 10; i += 1) {
									options.push(
										<Select.Option
											key={i}
											value={i}
											className="year-item"
										>
											{i}
										</Select.Option>
									);
								}
								return (
									<div style={{ padding: 8 }}>
										<Row gutter={8}>
											<Col>
												<Select
													size="small"
													dropdownMatchSelectWidth={
														false
													}
													className="my-year-select"
													onChange={newYear => {
														const now = value
															.clone()
															.year(newYear);
														onChange(now);
													}}
													value={String(year)}
												>
													{options}
												</Select>
											</Col>
											<Col>
												<Select
													size="small"
													dropdownMatchSelectWidth={
														false
													}
													value={String(month)}
													onChange={selectedMonth => {
														const newValue =
															value.clone();
														newValue.month(
															parseInt(
																selectedMonth,
																10
															)
														);
														onChange(newValue);
													}}
												>
													{monthOptions}
												</Select>
											</Col>
										</Row>
									</div>
								);
							}}
							onSelect={setSelectedDate}
						/>
					</Col>
					<Col className="gutter-row" span={8}>
						<Card title={selectedDate.format('DD MMMM YYYY')}>
							<Form
								layout="vertical"
								form={form}
								onFinish={onFinish}
							>
								{!data ? (
									<Form.Item>
										<Button
											type="primary"
											htmlType="submit"
										>
											Generate Hyperlink
										</Button>
									</Form.Item>
								) : (
									<Form.Item
										name="hyperlink"
										disabled={true}
										label="Hyperlink"
									>
										<Input disabled={true} />
									</Form.Item>
								)}
							</Form>
						</Card>
					</Col>
				</Row>
			</Content>
		</LayoutDefault>
	);
};

export async function getServerSideProps(context) {
	const { req } = context;
	const { origin } = absoluteUrl(req);
	const { token } = getAppCookies(req);
	const profile = token ? verifyToken(token) : "";
	if (!profile) {
		return {
			redirect: {
				destination: "/login",
			},
		};
	}
	return {
		props: {
			profile,
			hostname: origin
		},
	};
}

export default Home;
