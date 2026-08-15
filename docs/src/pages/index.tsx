import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { CalendarDays, GitPullRequest, Github, Code, Users } from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
      <header className={clsx(styles.heroBanner)}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <Heading as="h1" className={styles.heroTitle}>
                {siteConfig.title}
              </Heading>
              <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
              <div className={styles.buttons}>
                <Link
                    className={clsx("button", styles.buttonPrimary)}
                    to="/docs/intro">
                  <Translate id="homepage.getStarted" />
                </Link>
                <Link
                    className={clsx("button", styles.buttonSecondary)}
                    to="https://github.com/martinhrvn/hive-pal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.githubIcon}>
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <Translate id="homepage.github" />
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              {/*<img src="/hivepal/img/hive.png" alt="Hive-Pal App" />*/}
            </div>
          </div>
        </div>
        <div className={styles.waveDivider}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className={styles.shapeFill}></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className={styles.shapeFill}></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className={styles.shapeFill}></path>
          </svg>
        </div>
      </header>
  );
}

function FeaturesSection() {
  return (
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <Heading as="h2"><Translate id="homepage.aboutTitle" /></Heading>
            <p><Translate id="homepage.aboutSubtitle" /></p>
          </div>
          <HomepageFeatures />
          <div className={styles.developmentNotice}>
            <div className={styles.developmentNoticeIcon}>
              <Code size={24} />
            </div>
            <div>
              <h3><Translate id="homepage.developmentStatusTitle" /></h3>
              <p><Translate id="homepage.developmentStatusDescription" /></p>
            </div>
          </div>
        </div>
      </section>
  );
}

/**
 * Project stats section with repeated card structure.
 * The duplication is intentional declarative JSX for landing page layout.
 */
function ProjectStatsSection() {
  return (
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <Heading as="h2"><Translate id="homepage.openSourceTitle" /></Heading>
            <p><Translate id="homepage.openSourceSubtitle" /></p>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Github size={32} />
              </div>
              <div className={styles.statValue}><Translate id="homepage.stats.openSource.value" /></div>
              <div className={styles.statLabel}><Translate id="homepage.stats.openSource.label" /></div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <GitPullRequest size={32} />
              </div>
              <div className={styles.statValue}><Translate id="homepage.stats.contributions.value" /></div>
              <div className={styles.statLabel}><Translate id="homepage.stats.contributions.label" /></div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={32} />
              </div>
              <div className={styles.statValue}><Translate id="homepage.stats.community.value" /></div>
              <div className={styles.statLabel}><Translate id="homepage.stats.community.label" /></div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CalendarDays size={32} />
              </div>
              <div className={styles.statValue}><Translate id="homepage.stats.active.value" /></div>
              <div className={styles.statLabel}><Translate id="homepage.stats.active.label" /></div>
            </div>
          </div>
        </div>
      </section>
  );
}

function ContributeSection() {
  return (
      <section className={styles.contributeSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <Heading as="h2"><Translate id="homepage.contributeTitle" /></Heading>
            <p><Translate id="homepage.contributeSubtitle" /></p>
          </div>
          <div className={styles.contributeGrid}>
            <div className={styles.contributeCard}>
              <h3><Translate id="homepage.contribute.code.title" /></h3>
              <p><Translate id="homepage.contribute.code.description" /></p>
            </div>
            <div className={styles.contributeCard}>
              <h3><Translate id="homepage.contribute.docs.title" /></h3>
              <p><Translate id="homepage.contribute.docs.description" /></p>
            </div>
            <div className={styles.contributeCard}>
              <h3><Translate id="homepage.contribute.testing.title" /></h3>
              <p><Translate id="homepage.contribute.testing.description" /></p>
            </div>
            <div className={styles.contributeCard}>
              <h3><Translate id="homepage.contribute.requests.title" /></h3>
              <p><Translate id="homepage.contribute.requests.description" /></p>
            </div>
          </div>
        </div>
      </section>
  );
}

function CtaSection() {
  return (
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <Heading as="h2"><Translate id="homepage.ctaTitle" /></Heading>
            <p><Translate id="homepage.ctaDescription" /></p>
            <div className={styles.ctaButtons}>
              <Link
                  className={clsx("button", styles.buttonPrimary)}
                  to="/docs/intro">
                <Translate id="homepage.ctaExplore" />
              </Link>
              <Link
                  className={clsx("button", styles.buttonOutline)}
                  to="https://github.com/martinhrvn/hive-pal/issues">
                <Translate id="homepage.ctaIssues" />
              </Link>
            </div>
          </div>
        </div>
      </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
      <Layout
          title={`${siteConfig.title} - Open Source Beekeeping Management`}
          description="An open-source beekeeping management application designed for both mobile and desktop use. Track your apiaries, hives, inspections, and more with our intuitive interface.">
        <HomepageHeader />
        <main>
          <FeaturesSection />
          <ProjectStatsSection />
          <ContributeSection />
          <CtaSection />
        </main>
      </Layout>
  );
}