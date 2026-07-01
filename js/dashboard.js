// Dashboard Management and Analytics

const Dashboard = {
    charts: {},

    init() {
        // Dashboard will be updated when navigated to
        // Clear dashboard data on page close
        this.setupClearOnClose();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Update analytics when analytics section becomes active
        document.querySelector('.nav-link[data-section="analytics"]')?.addEventListener('click', () => {
            setTimeout(() => this.updateAnalytics(), 100);
        });
    },

    setupClearOnClose() {
        // Clear dashboard-related data when the page is closed
        window.addEventListener('beforeunload', () => {
            this.clearDashboardData();
        });
    },

    clearDashboardData() {
        // Clear quiz attempts
        localStorage.removeItem('spt_quiz_attempts');
        
        // Clear resume checks
        localStorage.removeItem('spt_resume_check');
        localStorage.removeItem('spt_ats_check');
        
        // Clear interview sessions
        localStorage.removeItem('spt_interview_sessions');
        
        // Reset company rounds prepared status
        const companies = Storage.getCompanies();
        companies.forEach(company => {
            if (company.rounds) {
                company.rounds.forEach(round => {
                    round.prepared = false;
                });
            }
        });
        Storage.saveCompanies(companies);
        
        // Reset topic completion status
        const topics = Storage.getTopics();
        Object.keys(topics).forEach(category => {
            topics[category].forEach(topic => {
                topic.completed = false;
            });
        });
        Storage.saveTopics(topics);
        
        // Clear topic notes
        localStorage.removeItem('spt_topic_notes');
    },

    update() {
        this.updateReadiness();
        this.updateMetrics();
    },

    updateReadiness() {
        // Calculate overall readiness percentage
        const readiness = this.calculateReadiness();
        const percentage = readiness.overall;

        // Update circular progress
        const circle = document.getElementById('readinessRing');
        const circumference = 2 * Math.PI * 90; // radius = 90
        const offset = circumference - (percentage / 100) * circumference;
        
        if (circle) {
            circle.style.strokeDashoffset = offset;
        }

        // Update percentage text
        const percentageText = document.getElementById('readinessPercentage');
        if (percentageText) {
            percentageText.textContent = `${percentage}%`;
        }
    },

    calculateReadiness() {
        const quizStats = Quiz.getQuizStats();
        const companies = Storage.getCompanies();
        const resumeScore = Resume.getLatestResumeScore();

        // Calculate component scores
        let quizScore = 0;
        if (quizStats.totalAttempts > 0) {
            quizScore = Math.min(100, (quizStats.averageScore / 100) * 30); // 30% weight
        }

        let topicsScore = 0;
        const totalTopics = Learning.getTotalTopicsCount();
        const completedTopics = Learning.getCompletedTopicsCount();
        if (totalTopics > 0) {
            topicsScore = (completedTopics / totalTopics) * 25; // 25% weight
        }

        let companiesScore = 0;
        const totalRounds = companies.reduce((sum, company) => 
            sum + (company.rounds ? company.rounds.length : 0), 0);
        const preparedRounds = Companies.getPreparedRoundsCount();
        if (totalRounds > 0) {
            companiesScore = (preparedRounds / totalRounds) * 25; // 25% weight
        }

        let resumeScoreWeighted = 0;
        if (resumeScore !== null) {
            resumeScoreWeighted = (resumeScore / 100) * 20; // 20% weight
        }

        const overall = Math.round(quizScore + topicsScore + companiesScore + resumeScoreWeighted);

        return {
            quiz: Math.round(quizScore),
            topics: Math.round(topicsScore),
            companies: Math.round(companiesScore),
            resume: Math.round(resumeScoreWeighted),
            overall: overall
        };
    },

    updateMetrics() {
        const quizStats = Quiz.getQuizStats();
        const completedTopics = Learning.getCompletedTopicsCount();
        const exploredCompanies = Companies.getExploredCompaniesCount();
        const preparedRounds = Companies.getPreparedRoundsCount();
        const resumeScore = Resume.getLatestResumeScore();

        // Update quiz metrics
        const quizzesAttemptedEl = document.getElementById('quizzesAttempted');
        if (quizzesAttemptedEl) {
            quizzesAttemptedEl.textContent = quizStats.totalAttempts;
        }

        const averageScoreEl = document.getElementById('averageScore');
        if (averageScoreEl) {
            averageScoreEl.textContent = quizStats.averageScore > 0 ? `${quizStats.averageScore}%` : '0%';
        }

        // Update topics metric
        const topicsCompletedEl = document.getElementById('topicsCompleted');
        if (topicsCompletedEl) {
            topicsCompletedEl.textContent = completedTopics;
        }

        // Update companies metric
        const companiesExploredEl = document.getElementById('companiesExplored');
        if (companiesExploredEl) {
            companiesExploredEl.textContent = exploredCompanies;
        }

        // Update rounds metric
        const roundsPreparedEl = document.getElementById('roundsPrepared');
        if (roundsPreparedEl) {
            roundsPreparedEl.textContent = preparedRounds;
        }

        // Update resume score
        const resumeScoreEl = document.getElementById('resumeScore');
        if (resumeScoreEl) {
            resumeScoreEl.textContent = resumeScore !== null ? `${resumeScore}/100` : '-';
        }
    },

    // Analytics Methods
    updateAnalytics() {
        this.updateStreak();
        this.updateStudyTime();
        this.updateWeakAreas();
        this.updateAchievements();
        this.renderCharts();
        this.generateInsights();
    },

    updateStreak() {
        const streak = this.calculateStreak();
        const streakEl = document.getElementById('studyStreak');
        const messageEl = document.getElementById('streakMessage');
        
        if (streakEl) streakEl.textContent = streak;
        if (messageEl) {
            if (streak === 0) {
                messageEl.textContent = 'Start your journey today!';
            } else if (streak < 7) {
                messageEl.textContent = 'Great start! Keep it up!';
            } else if (streak < 30) {
                messageEl.textContent = 'Amazing consistency! 🔥';
            } else {
                messageEl.textContent = 'Incredible dedication! 🏆';
            }
        }
    },

    calculateStreak() {
        const activities = this.getAllActivities();
        if (activities.length === 0) return 0;

        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let activity of activities) {
            const activityDate = new Date(activity.date);
            activityDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
                streak++;
            } else if (diffDays > streak) {
                break;
            }
        }

        return streak;
    },

    getAllActivities() {
        const activities = [];
        
        // Quiz attempts
        const quizAttempts = Storage.getQuizAttempts();
        quizAttempts.forEach(attempt => {
            activities.push({ date: attempt.date, type: 'quiz' });
        });

        // Interview sessions
        const interviewSessions = Storage.getInterviewSessions();
        interviewSessions.forEach(session => {
            activities.push({ date: session.date, type: 'interview' });
        });

        // Topic completions (stored separately)
        const topicActivities = Storage.getTopicActivities() || [];
        activities.push(...topicActivities);

        return activities;
    },

    updateStudyTime() {
        const totalMinutes = this.calculateTotalStudyTime();
        const hours = Math.floor(totalMinutes / 60);
        const timeEl = document.getElementById('totalStudyTime');
        
        if (timeEl) timeEl.textContent = hours;
    },

    calculateTotalStudyTime() {
        let totalMinutes = 0;
        
        // Estimate from quiz attempts (assume 1 min per question)
        const quizAttempts = Storage.getQuizAttempts();
        quizAttempts.forEach(attempt => {
            totalMinutes += attempt.total || 0;
        });

        // Interview practice time
        const interviewSessions = Storage.getInterviewSessions();
        interviewSessions.forEach(session => {
            totalMinutes += Math.floor((session.practiceTime || 0) / 60);
        });

        // Estimate from completed topics (assume 30 min per topic)
        const completedTopics = Learning.getCompletedTopicsCount();
        totalMinutes += completedTopics * 30;

        return totalMinutes;
    },

    updateWeakAreas() {
        const weakAreas = this.identifyWeakAreas();
        const container = document.getElementById('weakAreas');
        
        if (!container) return;

        if (weakAreas.length === 0) {
            container.innerHTML = '<p>Complete more quizzes to identify weak areas</p>';
            return;
        }

        container.innerHTML = weakAreas.slice(0, 3).map(area => `
            <div class="weak-area-item">
                <span class="area-name">${area.category}</span>
                <span class="area-score">${area.avgScore}%</span>
            </div>
        `).join('');
    },

    identifyWeakAreas() {
        const quizAttempts = Storage.getQuizAttempts();
        const categoryScores = {};

        quizAttempts.forEach(attempt => {
            if (!categoryScores[attempt.category]) {
                categoryScores[attempt.category] = { total: 0, count: 0 };
            }
            categoryScores[attempt.category].total += attempt.score;
            categoryScores[attempt.category].count++;
        });

        const weakAreas = Object.keys(categoryScores)
            .map(category => ({
                category,
                avgScore: Math.round(categoryScores[category].total / categoryScores[category].count)
            }))
            .filter(area => area.avgScore < 70)
            .sort((a, b) => a.avgScore - b.avgScore);

        return weakAreas;
    },

    updateAchievements() {
        const achievements = this.calculateAchievements();
        const container = document.getElementById('achievements');
        
        if (!container) return;

        if (achievements.length === 0) {
            container.innerHTML = '<p>Complete activities to earn achievements!</p>';
            return;
        }

        container.innerHTML = achievements.map(achievement => `
            <div class="achievement-badge ${achievement.earned ? 'earned' : 'locked'}">
                <span class="badge-icon">${achievement.icon}</span>
                <span class="badge-name">${achievement.name}</span>
            </div>
        `).join('');
    },

    calculateAchievements() {
        const quizAttempts = Storage.getQuizAttempts();
        const completedTopics = Learning.getCompletedTopicsCount();
        const streak = this.calculateStreak();

        const achievements = [
            { name: 'First Quiz', icon: '🎯', earned: quizAttempts.length >= 1 },
            { name: '10 Quizzes', icon: '📝', earned: quizAttempts.length >= 10 },
            { name: '50 Quizzes', icon: '🏅', earned: quizAttempts.length >= 50 },
            { name: 'Perfect Score', icon: '💯', earned: quizAttempts.some(a => a.score === 100) },
            { name: '5 Topics', icon: '📚', earned: completedTopics >= 5 },
            { name: '20 Topics', icon: '🎓', earned: completedTopics >= 20 },
            { name: '7 Day Streak', icon: '🔥', earned: streak >= 7 },
            { name: '30 Day Streak', icon: '⚡', earned: streak >= 30 },
        ];

        return achievements;
    },

    renderCharts() {
        this.renderQuizTrendChart();
        this.renderCategoryPerformanceChart();
        this.renderWeeklyActivityChart();
        this.renderTopicProgressBars();
    },

    renderQuizTrendChart() {
        const canvas = document.getElementById('quizTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const quizAttempts = Storage.getQuizAttempts();

        if (quizAttempts.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No quiz data available yet', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Sort by date and take last 10
        const sortedAttempts = quizAttempts
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-10);

        const labels = sortedAttempts.map((_, index) => `Quiz ${index + 1}`);
        const data = sortedAttempts.map(attempt => attempt.score);

        if (this.charts.quizTrend) {
            this.charts.quizTrend.destroy();
        }

        this.charts.quizTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quiz Score (%)',
                    data: data,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    },

    renderCategoryPerformanceChart() {
        const canvas = document.getElementById('categoryPerformanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const quizAttempts = Storage.getQuizAttempts();

        if (quizAttempts.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No category data available yet', canvas.width / 2, canvas.height / 2);
            return;
        }

        const categoryScores = {};
        quizAttempts.forEach(attempt => {
            if (!categoryScores[attempt.category]) {
                categoryScores[attempt.category] = { total: 0, count: 0 };
            }
            categoryScores[attempt.category].total += attempt.score;
            categoryScores[attempt.category].count++;
        });

        const labels = Object.keys(categoryScores);
        const data = labels.map(category => 
            Math.round(categoryScores[category].total / categoryScores[category].count)
        );

        if (this.charts.categoryPerformance) {
            this.charts.categoryPerformance.destroy();
        }

        this.charts.categoryPerformance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Score (%)',
                    data: data,
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    },

    renderWeeklyActivityChart() {
        const canvas = document.getElementById('weeklyActivityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const activities = this.getAllActivities();

        if (activities.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No activity data available yet', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Get last 7 days
        const last7Days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            last7Days.push(date);
        }

        const labels = last7Days.map(date => 
            date.toLocaleDateString('en-US', { weekday: 'short' })
        );

        const data = last7Days.map(date => {
            return activities.filter(activity => {
                const activityDate = new Date(activity.date);
                activityDate.setHours(0, 0, 0, 0);
                return activityDate.getTime() === date.getTime();
            }).length;
        });

        if (this.charts.weeklyActivity) {
            this.charts.weeklyActivity.destroy();
        }

        this.charts.weeklyActivity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Activities',
                    data: data,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    renderTopicProgressBars() {
        const container = document.getElementById('topicProgressBars');
        if (!container) return;

        const topics = Storage.getTopics();
        const categories = Object.keys(topics);

        if (categories.length === 0) {
            container.innerHTML = '<p>No topic data available yet</p>';
            return;
        }

        container.innerHTML = categories.map(category => {
            const categoryTopics = topics[category];
            const completed = categoryTopics.filter(t => t.completed).length;
            const total = categoryTopics.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return `
                <div class="progress-bar-item">
                    <div class="progress-bar-header">
                        <span class="progress-category">${category}</span>
                        <span class="progress-percentage">${percentage}%</span>
                    </div>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-bar-label">${completed} / ${total} topics</div>
                </div>
            `;
        }).join('');
    },

    generateInsights() {
        const container = document.getElementById('insightsList');
        if (!container) return;

        const insights = [];
        const quizAttempts = Storage.getQuizAttempts();
        const completedTopics = Learning.getCompletedTopicsCount();
        const totalTopics = Learning.getTotalTopicsCount();
        const weakAreas = this.identifyWeakAreas();
        const streak = this.calculateStreak();

        // Quiz insights
        if (quizAttempts.length > 0) {
            const recentAttempts = quizAttempts.slice(-5);
            const recentAvg = Math.round(
                recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length
            );
            
            if (recentAvg >= 80) {
                insights.push({
                    type: 'success',
                    message: `Excellent performance! Your recent quiz average is ${recentAvg}%. Keep up the great work!`
                });
            } else if (recentAvg < 60) {
                insights.push({
                    type: 'warning',
                    message: `Your recent quiz average is ${recentAvg}%. Consider reviewing the topics and trying again.`
                });
            }
        } else {
            insights.push({
                type: 'info',
                message: 'Start taking quizzes to track your progress and identify areas for improvement.'
            });
        }

        // Topic completion insights
        if (totalTopics > 0) {
            const completionRate = Math.round((completedTopics / totalTopics) * 100);
            if (completionRate < 30) {
                insights.push({
                    type: 'info',
                    message: `You've completed ${completionRate}% of topics. Try to complete at least 50% for better preparation.`
                });
            } else if (completionRate >= 80) {
                insights.push({
                    type: 'success',
                    message: `Amazing! You've completed ${completionRate}% of all topics. You're well-prepared!`
                });
            }
        }

        // Weak areas insights
        if (weakAreas.length > 0) {
            insights.push({
                type: 'warning',
                message: `Focus on improving: ${weakAreas.slice(0, 2).map(a => a.category).join(', ')}. These areas need more practice.`
            });
        }

        // Streak insights
        if (streak === 0) {
            insights.push({
                type: 'info',
                message: 'Start your learning streak today! Consistent daily practice leads to better results.'
            });
        } else if (streak >= 7) {
            insights.push({
                type: 'success',
                message: `${streak} day streak! Your consistency is impressive. Keep the momentum going!`
            });
        }

        // Render insights
        if (insights.length === 0) {
            container.innerHTML = '<p>Keep practicing to get personalized insights!</p>';
            return;
        }

        container.innerHTML = insights.map(insight => `
            <div class="insight-item insight-${insight.type}">
                <span class="insight-icon">${this.getInsightIcon(insight.type)}</span>
                <p>${insight.message}</p>
            </div>
        `).join('');
    },

    getInsightIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
};
