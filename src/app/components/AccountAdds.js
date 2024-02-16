'use client'
import React, { useState, useEffect } from 'react'
import styles from '@/app/css/AccountAdds.module.css'

const SSC = require('sscjs')
const ssc = new SSC('https://api2.hive-engine.com/rpc')

function AccountAdds() {
    // State for account-related data
    const [accountName, setAccountName] = useState('')
    const [totalAccounts, setTotalAccounts] = useState(0)
    const [scrapDay, setScrapDay] = useState(0)
    const [scrapMonth, setScrapMonth] = useState(0)
    const [scrapsToClaim, setScrapsToClaim] = useState(0)
    const [accounts, setAccounts] = useState([])
    const [jsonAccountsData, setJsonAccountsData] = useState([])
    const [alt, setAlt] = useState(null)
    const [balance, setBalance] = useState([])
    const [showAlt, setShowAlt] = useState(false)

    // Load 'accounts' from localStorage on component mount
    useEffect(() => {
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || []
        setAccounts(storedAccounts)
    }, [])

    function showAccounts() {
        // Clear existing data
        setJsonAccountsData([])

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
            setScrapsToClaim((preScrapsToClaim) => preScrapsToClaim + data.scrap)

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

    // Delete an account by name
    function deleteAccount(accountName) {
        const updatedAccounts = accounts.filter((name) => name !== accountName)

        localStorage.setItem('accounts', JSON.stringify(updatedAccounts))
        setAccounts(updatedAccounts)
    }

    const getBalances = async (account) => {
        return new Promise((resolve, reject) => {
            ssc.find('tokens', 'balances', { account }, 1000, 0, [], (err, result) => {
                if (err) {
                    reject(err)
                    return
                }

                let bal = []

                result.forEach((element) => {
                    const SYMBOL = element.symbol
                    if (element.symbol != null) {
                        if (SYMBOL === 'SCRAP' || SYMBOL === 'FLUX') {
                            const jsonData = {
                                symbol: SYMBOL,
                                balance: element.balance,
                                stake: element.stake,
                            }
                            bal.push({ ...jsonData }) // Create a shallow copy to avoid circular references
                        }
                    }
                })

                resolve(bal)
            })
        })
    }

    async function altAccount(accountName) {
        try {
            const response = await fetch(`https://terracore.herokuapp.com/player/${accountName}`)
            const data = await response.json()

            const balances = await getBalances(accountName)
            setBalance(balances)

            setAlt(data)
            setShowAlt(true)
        } catch (error) {
            console.error('Error fetching player data:', error)
            // Handle the error if needed
        }
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
                            <div>
                                <label htmlFor="accountName">Account Name: </label>
                                <input type="text" id="accountName" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                            </div>
                            <div>
                                <button type="button" onClick={addAccount}>
                                    Add Account
                                </button>
                                <button type="button" onClick={showAccounts}>
                                    Show Accounts
                                </button>
                            </div>
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
                            Scraps To Claim
                            <p>{scrapsToClaim.toFixed(3)} SCRAPS</p>
                            <button>Claim All</button>
                        </div>
                    </div>
                    <div className={styles.dashboard}>
                        <table>
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
                                        <td>
                                            <button onClick={() => altAccount(account.name)}>{account.name}</button>
                                        </td>
                                        <td>{account.scrap}</td>
                                        <td>{account.engineering}</td>
                                        <td>{account.defense}</td>
                                        <td>{account.damage}</td>
                                        <td>{account.lastUpgrade}</td>
                                        <td>
                                            <button onClick={() => deleteAccount(account.name)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={styles.overlay} style={{ display: showAlt ? 'flex' : 'none' }}>
                    {alt && (
                        <div className={styles.boxAlt}>
                            <div className={styles.altHeader}>
                                <span>{alt.username}'s Account</span>
                                <button onClick={() => setShowAlt(false)}>Close</button>
                            </div>
                            <div className={styles.altStats}>
                                <div className={styles.dataBox}>
                                    <p>Level {alt?.level}</p>
                                    <p>
                                        <span className={styles.white}>Stash:</span> {Number(alt?.scrap).toFixed(3)}{' '}
                                        <span className={styles.gray}>SCRAP</span>
                                    </p>
                                    <p>
                                        <span className={styles.gray}>Claims :</span> {alt?.claims} <span className={styles.gray}>Attacks :</span>{' '}
                                        {alt?.attacks}
                                    </p>
                                </div>
                                <div className={styles.dataBox}>
                                    <p>
                                        <span className={styles.white}>Stash Size:</span> {Number(balance[0]?.stake).toFixed(3)}
                                    </p>
                                    <p>
                                        +{Number(alt?.stats.dodge).toFixed(3)}% <span className={styles.gray}>Dodge</span>
                                    </p>
                                    <p>
                                        +{Number(alt?.stats.luck).toFixed(3)}% <span className={styles.gray}>Luck</span>
                                    </p>
                                </div>
                                <div className={styles.dataBox}>
                                    <p>
                                        <span className={styles.white}>Favor:</span> {Number(alt?.favor).toFixed(3)}
                                    </p>
                                    <p>
                                        +{Number(alt?.stats.crit).toFixed(3)}% <span className={styles.gray}>Crit</span>
                                    </p>
                                </div>
                                <div className={styles.dataBox}>
                                    <p>
                                        <span className={styles.white}>Engineering:</span> {alt?.engineering}
                                    </p>

                                    <p>
                                        <span className={styles.gray}>Minerate: </span>
                                        {Number(alt?.minerate * 60 * 60).toFixed(3)}/h
                                    </p>
                                </div>
                                <div className={styles.dataBox}>
                                    <p>
                                        <span className={styles.white}>Damage</span>
                                    </p>
                                    <p>{alt?.stats.damage}</p>
                                </div>
                                <div className={styles.dataBox}>
                                    <p>
                                        <span className={styles.white}>Defense</span>
                                    </p>
                                    <p>{alt?.stats.defense}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default AccountAdds
