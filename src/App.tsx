import { useState } from 'react';
import { Tabs } from './components/Tabs';
import { TABS } from './data/bigO';
import { TabPanel } from './components/TabPanel';
import bigOImg from './assets/images/Logarithmic-time-complexity-blog-1.jpg';

export default function App() {
  const [active, setActive] = useState(TABS[0].id);
  return (
    <div className="page">
      <header className="header">
        <h1>Big O Notation</h1>
      </header>
      <div className="subtle" style={{ marginBottom: 12 }}>
        Big O describes how an algorithm's time or space grows with input size n. It focuses on the trend,
        not exact times. Use the tabs to explore common classes with a single animated bar.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <img src={bigOImg} alt="logarithmic chart" style={{ maxWidth: '80%', borderRadius: 8, border: '1px solid #1f2937' }} />
      </div>
      <Tabs
        tabs={TABS.map((t) => ({ id: t.id, label: t.id }))}
        active={active}
        onChange={(id) => setActive(id)}
      />
      <div className="panel" style={{ marginTop: 8 }}>
        {TABS.filter((t) => t.id === active).map((spec) => (
          <TabPanel key={spec.id} spec={spec} />
        ))}
      </div>
  <footer className="footer">Clamp: 1 us-20 s; Space scaled up to ~1 GB for display</footer>
    </div>
  );
}
