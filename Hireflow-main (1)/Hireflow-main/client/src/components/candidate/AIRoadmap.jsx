import styles from './AIRoadmap.module.css';

export default function AIRoadmap({ roadmap, error }) {
  if (error && !roadmap) {
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconBadge}>🗺️</div>
            <h3 className={styles.title}>AI Career & Skill Roadmap</h3>
          </div>
        </div>
        <div className={styles.errorBox}>
          <p>
            AI Roadmap unavailable — add your <code>ANTHROPIC_API_KEY</code> to <code>server/.env</code> to enable this feature.
          </p>
        </div>
      </div>
    );
  }

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBadge}>🚀</div>
          <div>
            <h3 className={styles.title}>AI Career & Skill Roadmap</h3>
          </div>
        </div>
        <span className={styles.badge}>Powered by Claude</span>
      </div>

      {/* Summary Box */}
      <div className={styles.summaryBox}>
        {roadmap.targetRole && (
          <div className={styles.targetRole}>Target Role: {roadmap.targetRole}</div>
        )}
        <p className={styles.summaryText}>{roadmap.summary}</p>
        {roadmap.estimatedTimeframe && (
          <div className={styles.metaBar}>
            <span className={styles.metaItem}>
              ⏱️ Timeframe: <strong>{roadmap.estimatedTimeframe}</strong>
            </span>
            <span className={styles.metaItem}>
              🎯 Phases: <strong>{roadmap.phases.length} Steps</strong>
            </span>
          </div>
        )}
      </div>

      {/* Phased Timeline */}
      <div className={styles.timeline}>
        {roadmap.phases.map((phase, idx) => (
          <div key={idx} className={styles.phaseCard}>
            <div className={styles.phaseDot}>
              <div className={styles.phaseDotInner} />
            </div>

            <div className={styles.phaseHeader}>
              <h4 className={styles.phaseTitle}>{phase.title}</h4>
              {phase.duration && (
                <span className={styles.phaseDuration}>⏳ {phase.duration}</span>
              )}
            </div>

            {phase.focusArea && (
              <span className={styles.focusAreaTag}>Focus: {phase.focusArea}</span>
            )}

            {/* Action Items */}
            {phase.actionItems && phase.actionItems.length > 0 && (
              <ul className={styles.actionList}>
                {phase.actionItems.map((item, i) => (
                  <li key={i} className={styles.actionItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Recommended Resources / Topics */}
            {phase.recommendedResources && phase.recommendedResources.length > 0 && (
              <div className={styles.resourceBox}>
                <span className={styles.resourceLabel}>Key Topics & Tools:</span>
                {phase.recommendedResources.map((res, i) => (
                  <span key={i} className={styles.resourcePill}>{res}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
