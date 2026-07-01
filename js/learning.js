  // Learning Topics Management

const Learning = {
    currentFilter: 'all',
    searchQuery: '',

    init() {
        this.renderTopics();
        this.attachEventListeners();
    },

    attachEventListeners() {
        const searchInput = document.getElementById('learningSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderTopics();
            });
        }

        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                filterChips.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTopics();
            });
        });
    },

    renderTopics() {
        const topics = Storage.getTopics();
        const container = document.getElementById('learningContent');

        if (Object.keys(topics).length === 0) {
            container.innerHTML = '<p>No learning topics available. Sample data will be loaded on first visit.</p>';
            return;
        }

        const controlsHTML = `
            <div class="learning-controls">
                <div class="learning-search">
                    <input type="text" id="learningSearch" placeholder="🔍 Search topics..." value="${this.searchQuery}">
                </div>
                <div class="learning-filters">
                    <button class="filter-chip ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                    <button class="filter-chip ${this.currentFilter === 'completed' ? 'active' : ''}" data-filter="completed">✓ Completed</button>
                    <button class="filter-chip ${this.currentFilter === 'pending' ? 'active' : ''}" data-filter="pending">⏳ Pending</button>
                </div>
            </div>
        `;

        const categoriesHTML = Object.keys(topics).map(category => {
            const categoryTopics = topics[category];
            const completedCount = categoryTopics.filter(t => t.completed).length;
            const totalCount = categoryTopics.length;
            const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return `
                <div class="category-section">
                    <div class="category-header" onclick="Learning.toggleCategory(this)">
                        <div class="category-title-wrapper">
                            <span class="category-icon">▼</span>
                            <h3 class="category-title">${category}</h3>
                        </div>
                        <div class="category-progress-info">
                            <div class="category-progress-bar">
                                <div class="category-progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <span class="category-progress-text">${completedCount}/${totalCount}</span>
                        </div>
                    </div>
                    <div class="category-body expanded">
                        <div class="topics-list">
                            ${this.renderTopicItems(categoryTopics, category)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = controlsHTML + categoriesHTML;
        this.attachEventListeners();
    },

    toggleCategory(headerElement) {
        const categorySection = headerElement.closest('.category-section');
        const body = categorySection.querySelector('.category-body');
        const header = categorySection.querySelector('.category-header');
        
        if (body.classList.contains('expanded')) {
            body.classList.remove('expanded');
            header.classList.add('collapsed');
        } else {
            body.classList.add('expanded');
            header.classList.remove('collapsed');
        }
    },

    renderTopicItems(topicList, category) {
        const topicNotes = Storage.getTopicNotes();

        // Filter topics based on current filter and search
        let filteredTopics = topicList;
        
        if (this.currentFilter === 'completed') {
            filteredTopics = topicList.filter(t => t.completed);
        } else if (this.currentFilter === 'pending') {
            filteredTopics = topicList.filter(t => !t.completed);
        }

        if (this.searchQuery) {
            filteredTopics = filteredTopics.filter(t => 
                t.name.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filteredTopics.length === 0) {
            return '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No topics found</p>';
        }

        return filteredTopics.map(topic => {
            const key = this.getTopicKey(category, topic.id);
            const note = topicNotes[key]?.note || '';
            const materials = this.getTopicMaterials(category, topic.name);

            return `
            <div class="topic-card" id="topic-card-${this.escapeId(key)}">
                <div class="topic-card-inner">
                    <div class="topic-card-front">
                        <div class="topic-item ${topic.completed ? 'completed' : ''}">
                            <div class="topic-main">
                                <div class="topic-checkbox-label">
                                    <input type="checkbox" 
                                           id="topic-${category}-${topic.id}"
                                           ${topic.completed ? 'checked' : ''}
                                           onchange="Learning.toggleTopic('${category}', ${topic.id})"
                                           aria-label="Mark ${topic.name} as completed">
                                    <label for="topic-${category}-${topic.id}">${topic.name}</label>
                                </div>
                            </div>
                            <div class="topic-actions">
                                <button class="topic-action-btn" type="button"
                                        onclick="Learning.flipCard('${this.escapeId(key)}')"
                                        title="View details">
                                    📖 Details
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="topic-card-back">
                        <div class="topic-materials">
                            <div class="topic-materials-content">
                                <h4>📚 Quick Summary</h4>
                                <p class="topic-summary">${materials.summary}</p>
                                ${materials.points && materials.points.length ? `
                                    <ul class="topic-points">
                                        ${materials.points.map(p => `<li>${p}</li>`).join('')}
                                    </ul>
                                ` : ''}
                                ${materials.resources && materials.resources.length ? `
                                    <div class="topic-resources">
                                        <h5>🔗 Suggested Resources</h5>
                                        <ul>
                                            ${materials.resources.map(r => `
                                                <li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.label}</a></li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="topic-notes">
                                <h4>📝 Your Notes</h4>
                                <textarea id="topic-note-${this.escapeId(key)}"
                                          class="topic-notes-textarea"
                                          placeholder="Write your key takeaways...">${note}</textarea>
                                <button class="topic-action-btn" type="button"
                                        onclick="Learning.saveNote('${category}', ${topic.id})">
                                    💾 Save Note
                                </button>
                            </div>
                            <button class="topic-back-btn" type="button"
                                    onclick="Learning.flipCard('${this.escapeId(key)}')">
                                ← Back to Topics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    },

    flipCard(key) {
        const card = document.getElementById(`topic-card-${key}`);
        if (card) {
            card.classList.toggle('flipped');
        }
    },

    toggleTopic(category, topicId) {
        const topics = Storage.getTopics();
        const categoryTopics = topics[category];
        
        if (categoryTopics) {
            const topic = categoryTopics.find(t => t.id === topicId);
            if (topic) {
                topic.completed = !topic.completed;
                Storage.saveTopics(topics);
                this.renderTopics(); // Re-render to update UI
                Dashboard.update();
            }
        }
    },



    saveNote(category, topicId) {
        const key = this.getTopicKey(category, topicId);
        const textarea = document.getElementById(`topic-note-${this.escapeId(key)}`);
        if (!textarea) return;

        const notes = Storage.getTopicNotes();
        notes[key] = {
            note: textarea.value.trim(),
            updatedAt: new Date().toISOString()
        };
        Storage.saveTopicNotes(notes);
        
        // Show success feedback
        const button = textarea.nextElementSibling;
        const originalText = button.textContent;
        button.textContent = '✓ Saved!';
        button.style.background = 'var(--gradient-secondary)';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    },

    getTopicKey(category, topicId) {
        return `${category}-${topicId}`;
    },

    escapeId(key) {
        // Replace characters that might break id selectors
        return key.replace(/[^a-zA-Z0-9_-]/g, '_');
    },

    getTopicMaterials(category, topicName) {
        const base = {
            summary: `Focus on understanding the core concepts and practicing enough problems to build confidence in ${topicName}.`,
            points: [],
            resources: []
        };

        const lowerCategory = category.toLowerCase();
        const lowerName = topicName.toLowerCase();

        if (lowerCategory.includes('aptitude')) {
            base.summary = `Practice a variety of ${topicName} questions and focus on speed plus accuracy.`;
            base.points = [
                'Revise basic formulas and shortcuts regularly.',
                'Solve timed practice sets to simulate exam conditions.',
                'Analyze mistakes and maintain an error log.'
            ];
            base.resources = [
                { label: 'Aptitude practice (GeeksforGeeks)', url: 'https://www.geeksforgeeks.org/quantitative-aptitude/' },
                { label: 'Aptitude questions (IndiaBix)', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' }
            ];
        } else if (lowerCategory.includes('programming')) {
            base.summary = `Strengthen your problem-solving skills in ${topicName} with consistent coding practice.`;
            base.points = [
                'Start with easy problems and gradually move to medium/hard.',
                'Focus on time and space complexity for each solution.',
                'Try to solve the same problem in multiple ways.'
            ];
            base.resources = [
                { label: 'LeetCode Problems', url: 'https://leetcode.com/problemset/all/' },
                { label: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures/' }
            ];
        } else if (lowerCategory.includes('computer')) {
            base.summary = `Build strong fundamentals in ${topicName}, as they are frequently asked in interviews.`;
            base.points = [
                'Create concise notes for each core topic.',
                'Use diagrams to understand complex concepts like OS and networking.',
                'Review interview questions from past experiences.'
            ];
            base.resources = [
                { label: 'Operating Systems (GfG)', url: 'https://www.geeksforgeeks.org/operating-systems/' },
                { label: 'Computer Networks (GfG)', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' }
            ];
        } else if (lowerCategory.includes('soft')) {
            base.summary = `Improve your ${topicName} through reflection, feedback, and deliberate practice.`;
            base.points = [
                'Record yourself speaking to analyze your communication.',
                'Participate in group discussions and mock interviews.',
                'Ask for feedback from mentors and friends.'
            ];
            base.resources = [
                { label: 'Soft Skills for Interviews', url: 'https://www.geeksforgeeks.org/soft-skills-for-interview/' }
            ];
        }

        // Additional fine-tuning for specific topics if needed
        if (lowerName.includes('data structures')) {
            base.resources.push({ label: 'Data Structures Playlist', url: 'https://www.youtube.com/results?search_query=data+structures+tutorial' });
        } else if (lowerName.includes('algorithms')) {
            base.resources.push({ label: 'Algorithms Course', url: 'https://www.khanacademy.org/computing/computer-science/algorithms' });
        }

        return base;
    },

    getCompletedTopicsCount() {
        const topics = Storage.getTopics();
        let count = 0;
        Object.keys(topics).forEach(category => {
            count += topics[category].filter(topic => topic.completed).length;
        });
        return count;
    },

    getTotalTopicsCount() {
        const topics = Storage.getTopics();
        let count = 0;
        Object.keys(topics).forEach(category => {
            count += topics[category].length;
        });
        return count;
    }
};



