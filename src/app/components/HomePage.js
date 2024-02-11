import React from "react"
import styles from "@/app/css/HomePage.module.css"

function HomePage() {
	return (
		<section>
			<div className={styles.container}>
				<div className={styles.welcome}>Welcome to AutoCore</div>
				<div className={styles.info1}>Your ultimate destination for Terracore Game Bot Services.</div>
				<div className={styles.info2}>
					Elevating your gaming experience with a diverse range of services tailored to your needs. Whether
					you seek automation, optimization, or a competitive edge, AutoCore is here to provide personalized
					solutions.
				</div>
				<p>
					Feel free to explore the official Terracore Game and become a part of our vibrant community on the
				</p>
				<p>
					<a className={styles.welcomeLink} href="https://www.terracoregame.com/" target="_blank">
						Official Terracore Game website
					</a>
					<a className={styles.welcomeLink} href="https://discord.gg/7fGrsr3ZBx/" target="_blank">
						Official Discord
					</a>
				</p>

				<p>
					Crafted with dedication by
					<a className={styles.welcomeLink} href="https://peakd.com/@rhiaji" target="_blank">
						{" "}
						Rhiaji
					</a>
				</p>
			</div>
		</section>
	)
}

export default HomePage
