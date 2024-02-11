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
}

export default AccountAdds
