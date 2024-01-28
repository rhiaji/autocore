"use client"
import React, { useState, useEffect } from "react"
import styles from "@/app/css/Navigation.module.css"

function Navigation() {
	const [user, setUser] = useState("")

	useEffect(() => {
		const storedUsername = localStorage.getItem("username")
		if (storedUsername) {
			setUser(storedUsername.toLowerCase())
		}
	}, [])

	function login() {
		const username = window.prompt("Enter Hive Username")
		const lowercasedUsername = username ? username.toLowerCase() : null

		if (lowercasedUsername) {
			hive_keychain.requestSignBuffer(lowercasedUsername, "Rsg Rewards Login", "Posting", function (response) {
				if (response.success) {
					setUser(lowercasedUsername)
					localStorage.setItem("username", lowercasedUsername)
				} else {
					alert("Login failed") // You might want to handle failures appropriately
				}
			})
		}
	}

	function logout() {
		setUser("")
		localStorage.removeItem("username")
		alert("Logging out...")
		location.href = "/"
	}

	return (
		<nav>
			<div className={styles.container}>
				<div className={styles.links}>
					<ul>
						<li>
							<a href="/">Home</a>
						</li>
						<li>
							<a href="account">Account</a>
						</li>
						<li>
							<a href="#">Tools</a>
						</li>
						<li>
							<a href="#">Payment</a>
						</li>
					</ul>
				</div>
				<div className={styles.login}>
					{user ? <button onClick={logout}>Log Out</button> : <button onClick={login}>Log In</button>}
				</div>
			</div>
		</nav>
	)
}

export default Navigation
