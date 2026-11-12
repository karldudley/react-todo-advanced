export default function EmptyState({ selectedTab, hasTodos }) {
    const { icon, title, text } = !hasTodos
        ? {
              icon: 'fa-seedling',
              title: 'Nothing here yet',
              text: 'Add your first task above to get going.',
          }
        : selectedTab === 'Completed'
        ? {
              icon: 'fa-hourglass-start',
              title: 'Nothing completed yet',
              text: 'Tick off a task and it will show up here.',
          }
        : {
              icon: 'fa-champagne-glasses',
              title: 'All clear',
              text: 'Every task is ticked off. Time for a game.',
          };

    return (
        <div className="empty-state">
            <div className="empty-icon">
                <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
            </div>
            <h2>{title}</h2>
            <p>{text}</p>
        </div>
    );
}
