import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "AutoCore Dashboard",
	description: "Your ultimate destination for Terracore Game Bot Services",
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
