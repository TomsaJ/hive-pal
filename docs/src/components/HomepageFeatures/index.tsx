import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import { Book, Calendar, Clipboard, Cloud, Database, LineChart, Map, Shield, Smartphone } from 'lucide-react';
import styles from './styles.module.css';

interface Feature {
    titleKey: string;
    icon: React.ReactNode;
    descriptionKey: string;
    status: 'core' | 'in-progress' | 'planned';
}

const FeatureList: Feature[] = [
    {
        titleKey: 'features.mobileFirstDesign.title',
        icon: <Smartphone size={32} />,
        descriptionKey: 'features.mobileFirstDesign.description',
        status: 'core',
    },
    {
        titleKey: 'features.apiaryManagement.title',
        icon: <Map size={32} />,
        descriptionKey: 'features.apiaryManagement.description',
        status: 'core',
    },
    {
        titleKey: 'features.hiveTracking.title',
        icon: <Database size={32} />,
        descriptionKey: 'features.hiveTracking.description',
        status: 'core',
    },
    {
        titleKey: 'features.inspectionForms.title',
        icon: <Clipboard size={32} />,
        descriptionKey: 'features.inspectionForms.description',
        status: 'in-progress',
    },
    {
        titleKey: 'features.queenManagement.title',
        icon: <Shield size={32} />,
        descriptionKey: 'features.queenManagement.description',
        status: 'in-progress',
    },
    {
        titleKey: 'features.weatherIntegration.title',
        icon: <Cloud size={32} />,
        descriptionKey: 'features.weatherIntegration.description',
        status: 'planned',
    },
    {
        titleKey: 'features.treatmentTracking.title',
        icon: <Calendar size={32} />,
        descriptionKey: 'features.treatmentTracking.description',
        status: 'in-progress',
    },
    {
        titleKey: 'features.performanceInsights.title',
        icon: <LineChart size={32} />,
        descriptionKey: 'features.performanceInsights.description',
        status: 'planned',
    },
    {
        titleKey: 'features.selfHosted.title',
        icon: <Book size={32} />,
        descriptionKey: 'features.selfHosted.description',
        status: 'core',
    },
];

function Feature({titleKey, icon, descriptionKey, status}: Feature) {
    return (
        <div className={clsx('col col--4', styles.featureCard)}>
            <div className={styles.featureContent}>
                <div className={styles.featureIcon}>
                    {icon}
                </div>
                <div className={styles.featureDetails}>
                    <div className={styles.featureHeader}>
                        <Heading as="h3" className={styles.featureTitle}>
                            <Translate id={titleKey} />
                        </Heading>
                        {status !== 'core' && (
                            <span className={clsx(styles.featureStatus, {
                                [styles.statusInProgress]: status === 'in-progress',
                                [styles.statusPlanned]: status === 'planned',
                            })}>
                                <Translate id={status === 'in-progress' ? 'features.status.inProgress' : 'features.status.planned'} />
                            </span>
                        )}
                    </div>
                    <p className={styles.featureDescription}>
                        <Translate id={descriptionKey} />
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <div className={styles.featuresContainer}>
            <div className="row">
                {FeatureList.map((props, idx) => (
                    <Feature {...props} />
                ))}
            </div>
        </div>
    );
}