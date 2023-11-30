import React from 'react';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

type Props = {
  items: Array<{
    name: string;
    description: string;
    link: string;
    icon?: React.ReactNode;
  }>;
};

export const QuickStartLinks = (props: Props) => {
  return (
    <section className={styles.section}>
      {props.items.map((item) => (
        <Link to={item.link}>
          <div className={styles.item}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </div>
        </Link>
      ))}
    </section>
  );
};
