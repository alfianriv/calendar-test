import { Layout, Space, Menu } from "antd"

const LayoutEmpty = ({children}) => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
			{children}
		</Layout>
    )
}

export default LayoutEmpty