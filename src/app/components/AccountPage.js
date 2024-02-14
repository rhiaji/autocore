'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '@/app/css/AccountPage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faShop, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SSC = require('sscjs')
const ssc = new SSC('https://api2.hive-engine.com/rpc')

function AccountPage() {
    const [user, setUser] = useState('')
    const [balance, setBalance] = useState([])
    const [accountData, setAccountData] = useState()

    const fetchData = async (player) => {
        const url = `https://terracore.herokuapp.com/player/${player}`

        try {
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }

            const playerData = await response.json()
            setAccountData(playerData)
        } catch (error) {
            console.error('Error:', error)
            // Handle errors more gracefully if needed
        }
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
                            bal.push(jsonData)
                        }
                    }
                })

                resolve(bal)
            })
        })
    }

    useEffect(() => {
        const userPlayer = localStorage.getItem('username')

        setUser(userPlayer)

        const fetchDataAndBalances = async () => {
            try {
                if (userPlayer) {
                    await fetchData(userPlayer)

                    const balances = await getBalances(userPlayer)
                    setBalance(balances)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchDataAndBalances()
    }, [])

    const handleSearch = async () => {
        const playerName = document.getElementById('playerName').value
        setUser(playerName)

        try {
            if (playerName) {
                await fetchData(playerName)

                const balances = await getBalances(playerName)
                setBalance(balances)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    function scrap() {
        window.open('https://tribaldex.com/trade/SCRAP', '_blank')
    }

    function flux() {
        window.open('https://tribaldex.com/trade/FLUX', '_blank')
    }

    return (
        <section>
            <div className={styles.container}>
                <div className={styles.stats}>
                    <div>
                        <p>@{user}'s terracore account</p>
                    </div>
                    <div className={styles.searchDiv}>
                        <input type="text" id="playerName" placeholder="Search player by username..." />
                        <button onClick={handleSearch}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.balance}>
                        <p>Hive Engine Balance</p>
                        <div className={styles.balances}>
                            <div>
                                <Image src="/images/scrap.png" width={40} height={40} alt="scrap" />
                                {balance.length > 0 && balance[0].symbol === 'SCRAP' ? (
                                    <>
                                        {Number(balance[0].balance).toFixed(3)}
                                        <button>
                                            <FontAwesomeIcon icon={faPaperPlane} width={20} height={20} />
                                        </button>
                                        <button onClick={scrap}>
                                            <FontAwesomeIcon icon={faShop} width={20} height={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        0
                                        <button>
                                            <FontAwesomeIcon icon={faPaperPlane} width={20} height={20} />
                                        </button>
                                        <button onClick={scrap}>
                                            <FontAwesomeIcon icon={faShop} width={20} height={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                            <div>
                                <Image src="/images/flux.png" width={40} height={40} alt="flux" />
                                {balance.length > 0 && balance[0].symbol === 'FLUX' ? (
                                    <>
                                        {Number(balance[1].balance).toFixed(3)}
                                        <button>
                                            <FontAwesomeIcon icon={faPaperPlane} width={20} height={20} />
                                        </button>
                                        <button onClick={flux}>
                                            <FontAwesomeIcon icon={faShop} width={20} height={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        0
                                        <button>
                                            <FontAwesomeIcon icon={faPaperPlane} width={20} height={20} />
                                        </button>
                                        <button onClick={flux}>
                                            <FontAwesomeIcon icon={faShop} width={20} height={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.box}>
                        <div className={styles.dataBox}>
                            <p>Level {accountData?.level}</p>
                            <p>
                                <span className={styles.white}>Stash:</span> {Number(accountData?.scrap).toFixed(3)}{' '}
                                <span className={styles.gray}>SCRAP</span>
                            </p>
                            <p>
                                <span className={styles.gray}>Claims :</span> {accountData?.claims} <span className={styles.gray}>Attacks :</span>{' '}
                                {accountData?.attacks}
                            </p>
                        </div>
                        <div className={styles.dataBox}>
                            <p>
                                <span className={styles.white}>Stash Size:</span> {Number(balance[0]?.stake).toFixed(3)}
                            </p>
                            <p>
                                +{Number(accountData?.stats.dodge).toFixed(3)}% <span className={styles.gray}>Dodge</span>
                            </p>
                            <p>
                                +{Number(accountData?.stats.luck).toFixed(3)}% <span className={styles.gray}>Luck</span>
                            </p>
                        </div>
                        <div className={styles.dataBox}>
                            <p>
                                <span className={styles.white}>Favor:</span> {Number(accountData?.favor).toFixed(3)}
                            </p>
                            <p>
                                +{Number(accountData?.stats.crit).toFixed(3)}% <span className={styles.gray}>Crit</span>
                            </p>
                        </div>
                        <div className={styles.dataBox}>
                            <p>
                                <span className={styles.white}>Engineering:</span> {accountData?.engineering}
                            </p>

                            <p>
                                <span className={styles.gray}>Minerate: </span>
                                {Number(accountData?.minerate * 60 * 60).toFixed(3)}/h
                            </p>
                        </div>
                        <div className={styles.dataBox}>
                            <p>
                                <span className={styles.white}>Damage</span>
                            </p>
                            <p>{accountData?.stats.damage}</p>
                        </div>
                        <div className={styles.dataBox}>
                            <p>
                                <span className={styles.white}>Defense</span>
                            </p>
                            <p>{accountData?.stats.defense}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AccountPage
