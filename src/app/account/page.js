import React from "react"
import Navigation from "../components/Navigation"
import AccountPage from "../components/AccountPage"
import AccountAdds from "../components/AccountAdds"

export default function account() {
	return (
		<main>
			<Navigation />
			<AccountPage />
			<AccountAdds />
		</main>
	)
}
