<<<<<<< HEAD
'use client'
import React, { useState, useEffect } from 'react'
import styles from '@/app/css/AccountAdds.module.css'

function AccountAdds() {
    // State for account-related data
    const [accountName, setAccountName] = useState('')
    const [totalAccounts, setTotalAccounts] = useState(0)
    const [scrapDay, setScrapDay] = useState(0)
    const [scrapMonth, setScrapMonth] = useState(0)
    const [hiveMonth, setHiveMonth] = useState(0)
    const [accounts, setAccounts] = useState([])
    const [jsonAccountsData, setJsonAccountsData] = useState([])

    // Load 'accounts' from localStorage on component mount
    useEffect(() => {
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || []
        setAccounts(storedAccounts)
    }, [])

    function showAccounts() {
        accounts.forEach((accountName) => {
            fetchAccountData(accountName)
        })
    }

    // Fetch player data from the API
    async function fetchAccountData(accountName) {
        try {
            const response = await fetch(`https://terracore.herokuapp.com/player/${accountName}`)
            const data = await response.json()

            // Update total accounts and scrap-related data
            setTotalAccounts((prevTotal) => prevTotal + 1)
            setScrapDay((prevScrapDay) => prevScrapDay + data.minerate * 60 * 60 * 24)
            setScrapMonth((prevScrapMonth) => prevScrapMonth + data.minerate * 60 * 60 * 24 * 30)

            // Calculate Hive payment per month
            let hiveMonth = totalAccounts >= 3 ? 6 + totalAccounts - 3 : 5
            setHiveMonth(hiveMonth)

            // Render the account after fetching data
            renderAccount(data)
        } catch (error) {
            console.error('Error fetching player data:', error)
            // Handle the error if needed
        }
    }

    // Render account data and update jsonAccountsData state
    function renderAccount(data) {
        setJsonAccountsData((prevJsonAccountsData) => [
            ...prevJsonAccountsData,
            {
                name: data.username,
                scrap: Number(data.scrap).toFixed(3),
                engineering: data.stats.engineering,
                defense: data.stats.defense,
                damage: data.stats.damage,
                lastUpgrade: new Date(data.last_upgrade_time).toLocaleString(),
            },
        ])
    }

    // Add a new account
    async function addAccount() {
        if (accounts.includes(accountName)) {
            console.log('Account already exists:', accountName)
            return
        }

        setTotalAccounts(totalAccounts + 1)
        setAccounts((prevAccounts) => [...prevAccounts, accountName])
        localStorage.setItem('accounts', JSON.stringify([...accounts, accountName]))

        try {
            const response = await fetch(`https://terracore.herokuapp.com/player/${accountName}`)
            const data = await response.json()

            if (!jsonAccountsData.some((account) => account.name === accountName)) {
                renderAccount(data)
            }
        } catch (error) {
            console.error('Error fetching player data:', error)
            // Handle the error if needed
        }
    }

    // Delete an account
    function deleteAccount(index) {
        const updatedAccounts = accounts.filter((_, i) => i !== index)

        localStorage.setItem('accounts', JSON.stringify(updatedAccounts))
        setAccounts(updatedAccounts)
    }

    // Log the current jsonAccountsData state
    console.log(jsonAccountsData)

    return (
        <section>
            <div className={styles.container}>
                <div>
                    <div className={styles.multi}>
                        <h1>Multi Account Dashboard</h1>
                        <div className={styles.add}>
                            <label htmlFor="accountName">Account Name: </label>
                            <input type="text" id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                            <button type="button" onClick={addAccount}>
                                Add Account
                            </button>
                            <button type="button" onClick={showAccounts}>
                                Show Accounts
                            </button>
                        </div>
                    </div>

                    <div className={styles.stats}>
                        <div className={styles.box}>
                            Total Accounts
                            <p>{totalAccounts}</p>
                        </div>
                        <div className={styles.box}>
                            Scraps / Day
                            <p>{scrapDay}</p>
                        </div>
                        <div className={styles.box}>
                            Scraps / Month
                            <p>{scrapMonth}</p>
                        </div>
                        <div className={styles.box}>
                            Payment / Month
                            <p>{hiveMonth} Hive</p>
                        </div>
                    </div>

                    <table id="accountTable" className={styles.dashboard}>
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Scrap</th>
                                <th>Engineering</th>
                                <th>Defense</th>
                                <th>Damage</th>
                                <th>Last Upgrade Time</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jsonAccountsData.map((account, index) => (
                                <tr key={index}>
                                    <td>{account.name}</td>
                                    <td>{account.scrap}</td>
                                    <td>{account.engineering}</td>
                                    <td>{account.defense}</td>
                                    <td>{account.damage}</td>
                                    <td>{account.lastUpgrade}</td>
                                    <td>
                                        <button onClick={() => deleteAccount(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
=======
"use client"
import React, { useState, useEffect } from "react"
import styles from "@/app/css/AccountAdds.module.css"

function AccountAdds() {
	const [accountName, setAccountName] = useState("")
	const [totalAccounts, setTotalAccounts] = useState(0)
	const [scrapDay, setScrapDay] = useState(0)
	const [scrapMonth, setScrapMonth] = useState(0)
	const [hiveMonth, setHiveMonth] = useState(0)
	const [accounts, setAccounts] = useState()

	useEffect(() => {
		// Example: Load 'accounts' from localStorage on component mount
		const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || []
		setAccounts(storedAccounts)
	}, [])

	function showAccounts() {
		// Fetch data for existing accounts and then render them
		accounts.forEach((accountName) => {
			fetchAccountData(accountName)
		})
	}

	async function fetchAccountData(accountName) {
		try {
			const response = await fetch(`https://terracore.herokuapp.com/player/${accountName}`)
			const data = await response.json()

			// Assuming you have setTotalAccounts, setScrapDay, setScrapMonth, and setHiveMonth functions
			setTotalAccounts((prevTotal) => prevTotal + 1)
			setScrapDay((prevScrapDay) => prevScrapDay + data.minerate * 60 * 60 * 24)
			setScrapMonth((prevScrapMonth) => prevScrapMonth + data.minerate * 60 * 60 * 24 * 30)

			let hiveMonth = 0
			if (totalAccounts >= 3) {
				hiveMonth = 6 + totalAccounts - 3
			} else if (totalAccounts < 3) {
				hiveMonth = 5
			}
			setHiveMonth(hiveMonth)

			// Render the account after fetching data
			renderAccount(data)
		} catch (error) {
			console.error("Error fetching player data:", error)
			// Handle the error if needed
		}
	}

	function renderAccount(data) {
		const accountList = document.getElementById("accountList")
		const newRow = accountList.insertRow(-1)
		const cells = Array.from({ length: 8 }, (_, index) => newRow.insertCell(index))

		cells[0].innerHTML = `<a>${data.username}</a>`
		cells[1].innerHTML = `<button>Claim</button>`
		cells[2].innerHTML = Number(data.scrap).toFixed(3)
		cells[3].innerHTML = data.stats.engineering
		cells[4].innerHTML = data.stats.defense
		cells[5].innerHTML = data.stats.damage
		cells[6].innerHTML = new Date(data.last_upgrade_time).toLocaleString()
		cells[7].innerHTML = `<button>Delete</button>`
	}

	async function addAccount() {
		// Check if the account already exists
		if (accounts.includes(accountName)) {
			// Handle the case where the account already exists
			console.log("Account already exists:", accountName)
			return
		}

		setTotalAccounts(totalAccounts + 1)
		setAccounts((prevAccounts) => [...prevAccounts, accountName])
		localStorage.setItem("accounts", JSON.stringify([...accounts, accountName]))

		try {
			const response = await fetch(`https://terracore.herokuapp.com/player/${accountName}`)
			const data = await response.json()

			// Check if the account is already rendered
			if (document.getElementById(`accountRow_${accountName}`)) {
				// Handle the case where the account is already rendered
				console.log("Account already rendered:", accountName)
				return
			}

			const accountList = document.getElementById("accountList")

			const minerate = data.minerate * 60 * 60 * 24
			const minerateMonth = minerate * 30

			const newRow = accountList.insertRow(-1)
			newRow.id = `accountRow_${accountName}` // Set a unique ID for the row

			const cells = Array.from({ length: 8 }, (_, index) => newRow.insertCell(index))

			cells[0].innerHTML = `<a onclick="getStats('${accountName}')">${accountName}</a>`
			cells[1].innerHTML = `<button onclick="claimLogs('${accountName}')">Claim</button>`
			cells[2].innerHTML = Number(data.scrap).toFixed(3)
			cells[3].innerHTML = data.stats.engineering
			cells[4].innerHTML = data.stats.defense
			cells[5].innerHTML = data.stats.damage
			cells[6].innerHTML = new Date(data.last_upgrade_time).toLocaleString()
			cells[7].innerHTML = `<button onclick="deleteAccount('${accountName}')">Delete</button>`

			setScrapDay((prevScrapDay) => prevScrapDay + minerate)
			setScrapMonth((prevScrapMonth) => prevScrapMonth + minerateMonth)

			let hiveMonth = 0
			if (totalAccounts >= 3) {
				hiveMonth = 6 + totalAccounts - 3
			} else if (totalAccounts < 3) {
				hiveMonth = 5
			}
			setHiveMonth(hiveMonth)

			setAccountName("")
		} catch (error) {
			console.error("Error fetching player data:", error)
			// Handle the error if needed
		}
	}

	function deleteAccount(index) {
		const updatedAccounts = accounts.filter((_, i) => i !== index)

		localStorage.setItem("accounts", JSON.stringify(updatedAccounts))
		setAccounts(updatedAccounts)

		location.reload() // Note: Reloading the page might not be the best user experience
	}

	return (
		<section>
			<div className={styles.container}>
				<div>
					<div className={styles.multi}>
						<h1>Multi Account Dashboard</h1>
						<div className={styles.add}>
							<label htmlFor="accountName">Account Name: </label>
							<input
								type="text"
								id="accountName"
								value={accountName}
								onChange={(e) => setAccountName(e.target.value)}
							/>
							<button type="button" onClick={addAccount}>
								Add Account
							</button>
							<button type="button" onClick={showAccounts}>
								Show Accounts
							</button>
						</div>
					</div>

					<div className={styles.stats}>
						<div className={styles.box}>
							Total Accounts
							<p>{totalAccounts}</p>
						</div>
						<div className={styles.box}>
							Scraps / Day
							<p>{scrapDay}</p>
						</div>
						<div className={styles.box}>
							Scraps / Month
							<p>{scrapMonth}</p>
						</div>
						<div className={styles.box}>
							Payment / Month
							<p>{hiveMonth} Hive</p>
						</div>
					</div>

					<table id="accountTable" className={styles.dashboard}>
						<thead>
							<tr>
								<th>Account</th>
								<th>Logs</th>
								<th>Scrap</th>
								<th>Engineering</th>
								<th>Defense</th>
								<th>Damage</th>
								<th>Last Upgrade Time</th>
								<th>Options</th>
							</tr>
						</thead>
						<tbody id="accountList"></tbody>
					</table>
				</div>
			</div>
		</section>
	)
>>>>>>> origin/main
}

export default AccountAdds
