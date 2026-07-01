// Mock Interview Practice

const MockInterview = {
    currentCategory: null,
    currentQuestions: [],
    currentQuestionIndex: 0,
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false,
    userAnswers: {},
    interviewMode: 'text', // 'text' or 'video'
    mediaRecorder: null,
    recordedChunks: [],
    videoStream: null,
    videoAnswers: {},
    speechRecognition: null,
    speechData: {}, // Store speech analysis per question

    init() {
        this.renderCategories();
        this.setupEventListeners();
    },

    renderCategories() {
        const questions = Storage.getInterviewQuestions();
        const container = document.getElementById('interviewCategories');

        if (Object.keys(questions).length === 0) {
            container.innerHTML = '<p>No interview categories available. Sample data will be loaded on first visit.</p>';
            return;
        }

        container.innerHTML = `
            ${Object.keys(questions).map(category => `
                <div class="interview-category-card">
                    <div class="category-icon">${this.getCategoryIcon(category)}</div>
                    <h3>${category}</h3>
                    <p>${questions[category].length} questions</p>
                    <p class="category-description">${this.getCategoryDescription(category)}</p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn-primary" onclick="MockInterview.startInterview('${category}', 'text')" style="flex: 1; font-size: 0.9rem; padding: 0.5rem;">
                            📝 Text
                        </button>
                        <button class="btn-secondary" onclick="MockInterview.startInterview('${category}', 'video')" style="flex: 1; font-size: 0.9rem; padding: 0.5rem;">
                            🎥 Video
                        </button>
                    </div>
                </div>
            `).join('')}
            
            <div class="interview-tips-section" style="grid-column: 1 / -1; margin-top: 1rem;">
                <h3 style="color: var(--dark-color); margin-bottom: 1rem;">💡 Face-to-Face Interview Tips</h3>
                <div class="tips-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                    <div class="tip-card">
                        <h4>🪑 How to Sit</h4>
                        <ul style="margin-left: 1.5rem; color: var(--text-light);">
                            <li>Sit upright with your back straight</li>
                            <li>Keep both feet flat on the floor</li>
                            <li>Lean slightly forward to show engagement</li>
                            <li>Don't slouch or lean back too much</li>
                            <li>Keep hands visible on the table or lap</li>
                        </ul>
                    </div>
                    <div class="tip-card">
                        <h4>🗣️ How to Talk</h4>
                        <ul style="margin-left: 1.5rem; color: var(--text-light);">
                            <li>Speak clearly and at moderate pace</li>
                            <li>Maintain appropriate volume</li>
                            <li>Pause before answering to think</li>
                            <li>Use professional language</li>
                            <li>Avoid filler words (um, like, you know)</li>
                        </ul>
                    </div>
                    <div class="tip-card">
                        <h4>👁️ Eye Contact</h4>
                        <ul style="margin-left: 1.5rem; color: var(--text-light);">
                            <li>Maintain natural eye contact (70-80%)</li>
                            <li>Look at all interviewers if multiple</li>
                            <li>Don't stare continuously</li>
                            <li>Look away naturally when thinking</li>
                            <li>Smile genuinely when appropriate</li>
                        </ul>
                    </div>
                    <div class="tip-card">
                        <h4>🤝 Body Language</h4>
                        <ul style="margin-left: 1.5rem; color: var(--text-light);">
                            <li>Give a firm handshake</li>
                            <li>Keep arms uncrossed and open</li>
                            <li>Use natural hand gestures</li>
                            <li>Nod to show understanding</li>
                            <li>Avoid fidgeting or nervous movements</li>
                        </ul>
                    </div>
                    <div class="tip-card">
                        <h4>👔 Professional Appearance</h4>
                        <ul style="margin-left: 1.5rem; color: var(--text-light);">
                            <li>Dress formally and appropriately</li>
                            <li>Ensure clothes are clean and ironed</li>
                            <li>Keep hair neat and groomed</li>
                            <li>Minimal jewelry and accessories</li>
                            <li>Arrive 10-15 minutes early</li>
                        </ul>
                    </div>
                    <div class="tip-card">
                        <h4>🎯 General Tips</h4>
                        <ul style="margin-left: 1.5rem; color: var(--text-light);">
                            <li>Listen carefully to questions</li>
                            <li>Be honest and authentic</li>
                            <li>Show enthusiasm and interest</li>
                            <li>Ask thoughtful questions</li>
                            <li>Thank the interviewer at the end</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    getCategoryIcon(category) {
        const icons = {
            'Technical': '💻',
            'HR/Behavioral': '👥',
            'System Design': '🏗️',
            'Problem Solving': '🧩'
        };
        return icons[category] || '❓';
    },

    getCategoryDescription(category) {
        const descriptions = {
            'Technical': 'Programming concepts, algorithms, and technical skills',
            'HR/Behavioral': 'Soft skills, teamwork, and cultural fit questions',
            'System Design': 'Architecture and system design scenarios',
            'Problem Solving': 'Analytical thinking and problem-solving approaches'
        };
        return descriptions[category] || 'Practice interview questions';
    },

    setupEventListeners() {
        document.getElementById('prevInterviewQuestion').addEventListener('click', () => {
            this.navigateQuestion(-1);
        });

        document.getElementById('nextInterviewQuestion').addEventListener('click', () => {
            this.navigateQuestion(1);
        });

        document.getElementById('finishInterview').addEventListener('click', () => {
            this.finishInterview();
        });

        document.getElementById('toggleTimer').addEventListener('click', () => {
            this.toggleTimer();
        });

        document.getElementById('showSampleAnswer').addEventListener('click', () => {
            this.toggleSampleAnswer();
        });

        document.getElementById('showTips').addEventListener('click', () => {
            this.toggleTips();
        });

        // Add back button listener
        const backButton = document.getElementById('backToInterviewSelection');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.cancelInterview();
            });
        }
    },

    async startInterview(category, mode = 'text') {
        const questions = Storage.getInterviewQuestions();
        this.currentCategory = category;
        this.currentQuestions = questions[category] || [];
        this.currentQuestionIndex = 0;
        this.timerSeconds = 0;
        this.timerRunning = false;
        this.userAnswers = {};
        this.interviewMode = mode;
        this.videoAnswers = {};

        if (this.currentQuestions.length === 0) {
            alert('No questions available for this category.');
            return;
        }

        // Hide selection, show interview
        document.querySelector('.interview-selection').classList.add('hidden');
        document.getElementById('interviewContainer').classList.remove('hidden');
        document.getElementById('interviewSummary').classList.add('hidden');

        // Initialize video mode if selected (before rendering)
        if (this.interviewMode === 'video') {
            await this.initVideoMode();
        }

        this.renderQuestion();
        this.updateTimerDisplay();
    },

    renderQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const container = document.getElementById('interviewQuestionText');
        const answerTextarea = document.getElementById('interviewAnswer');

        document.getElementById('interviewCategoryName').textContent = this.currentCategory;
        document.getElementById('interviewQuestionNum').textContent = this.currentQuestionIndex + 1;
        document.getElementById('interviewTotalQuestions').textContent = this.currentQuestions.length;

        container.textContent = question.question;
        
        // Handle different modes
        if (this.interviewMode === 'video') {
            this.renderVideoInterface();
        } else {
            // Load saved answer if exists
            if (this.userAnswers[this.currentQuestionIndex]) {
                answerTextarea.value = this.userAnswers[this.currentQuestionIndex];
            } else {
                answerTextarea.value = '';
            }

            // Save answer when typing
            if (answerTextarea) {
                answerTextarea.oninput = () => {
                    this.userAnswers[this.currentQuestionIndex] = answerTextarea.value;
                };
            }
        }

        // Update sample answer and tips
        document.getElementById('sampleAnswerContent').innerHTML = question.sampleAnswer || 'No sample answer available.';
        document.getElementById('answerTipsList').innerHTML = question.tips 
            ? question.tips.map(tip => `<li>${tip}</li>`).join('')
            : '<li>Think about your experience and provide specific examples.</li>';

        // Hide sample answer and tips initially
        document.getElementById('sampleAnswer').classList.add('hidden');
        document.getElementById('answerTips').classList.add('hidden');

        // Update navigation buttons
        const prevBtn = document.getElementById('prevInterviewQuestion');
        const nextBtn = document.getElementById('nextInterviewQuestion');
        const finishBtn = document.getElementById('finishInterview');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
        const isLastQuestion = this.currentQuestionIndex === this.currentQuestions.length - 1;
        if (nextBtn) nextBtn.classList.toggle('hidden', isLastQuestion);
        if (finishBtn) finishBtn.classList.toggle('hidden', !isLastQuestion);
    },

    navigateQuestion(direction) {
        // Save current answer
        if (this.interviewMode === 'text') {
            const answerTextarea = document.getElementById('interviewAnswer');
            if (answerTextarea) {
                this.userAnswers[this.currentQuestionIndex] = answerTextarea.value;
            }
        }

        const newIndex = this.currentQuestionIndex + direction;
        if (newIndex >= 0 && newIndex < this.currentQuestions.length) {
            this.currentQuestionIndex = newIndex;
            this.renderQuestion();
        }
    },

    toggleTimer() {
        if (this.timerRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    },

    startTimer() {
        this.timerRunning = true;
        document.getElementById('toggleTimer').textContent = 'Stop Timer';
        this.timerInterval = setInterval(() => {
            this.timerSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    },

    stopTimer() {
        this.timerRunning = false;
        document.getElementById('toggleTimer').textContent = 'Start Timer';
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        document.getElementById('timerDisplay').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    toggleSampleAnswer() {
        const sampleAnswerDiv = document.getElementById('sampleAnswer');
        sampleAnswerDiv.classList.toggle('hidden');
    },

    toggleTips() {
        const tipsDiv = document.getElementById('answerTips');
        tipsDiv.classList.toggle('hidden');
    },

    finishInterview() {
        // Save current answer
        if (this.interviewMode === 'text') {
            const answerTextarea = document.getElementById('interviewAnswer');
            if (answerTextarea) {
                this.userAnswers[this.currentQuestionIndex] = answerTextarea.value;
            }
        }

        // Stop timer
        this.stopTimer();

        // Calculate stats
        const totalQuestions = this.currentQuestions.length;
        let answeredQuestions;
        
        if (this.interviewMode === 'video') {
            answeredQuestions = Object.keys(this.videoAnswers).length;
        } else {
            answeredQuestions = Object.keys(this.userAnswers).filter(
                key => this.userAnswers[key] && this.userAnswers[key].trim().length > 0
            ).length;
        }
        
        const practiceTime = this.formatTime(this.timerSeconds);

        // Calculate marks for video mode
        let marks = null;
        if (this.interviewMode === 'video') {
            marks = this.calculateVideoMarks(answeredQuestions, totalQuestions);
        }

        // Save practice session
        const session = {
            date: new Date().toISOString(),
            category: this.currentCategory,
            mode: this.interviewMode,
            totalQuestions: totalQuestions,
            answeredQuestions: answeredQuestions,
            practiceTime: this.timerSeconds,
            completionRate: Math.round((answeredQuestions / totalQuestions) * 100),
            marks: marks
        };

        Storage.saveInterviewSession(session);

        // Show summary
        this.showSummary(totalQuestions, answeredQuestions, practiceTime, marks);

        // Cleanup
        this.cleanupVideoMode();

        // Reset state
        this.currentCategory = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.timerSeconds = 0;
        this.userAnswers = {};
        this.videoAnswers = {};
    },

    calculateVideoMarks(answered, total) {
        // Count actual video recordings with speech analysis
        const videoCount = Object.keys(this.videoAnswers).length;
        
        // Analyze each video for quality metrics including speech
        let qualityScore = 0;
        let totalDuration = 0;
        let speechQualityScore = 0;
        let videosWithSpeech = 0;
        
        Object.keys(this.videoAnswers).forEach(index => {
            const videoBlob = this.videoAnswers[index];
            const speechData = this.speechData[index];
            
            if (videoBlob && videoBlob.size > 0) {
                // Use actual speech duration if available, otherwise estimate from blob
                let estimatedDuration = 0;
                if (speechData && speechData.duration > 0) {
                    estimatedDuration = speechData.duration;
                } else {
                    // Rough estimate: 1MB ≈ 8 seconds for video
                    estimatedDuration = (videoBlob.size / (1024 * 1024)) * 8;
                }
                totalDuration += estimatedDuration;
                
                // CRITICAL: Check if speech was detected
                const hasMeaningfulSpeech = speechData && speechData.hasSpeech && speechData.wordCount >= 10;
                
                if (!hasMeaningfulSpeech) {
                    // NO SPEECH or insufficient speech = 0 marks for this question
                    console.warn(`⚠️ Question ${parseInt(index) + 1}: No meaningful speech detected (${speechData?.wordCount || 0} words)`);
                    qualityScore += 0;
                    speechQualityScore += 0;
                    return; // Skip to next question
                }
                
                videosWithSpeech++;
                
                // Base score on video duration (only if speech detected)
                let videoScore = 0;
                if (estimatedDuration >= 30 && estimatedDuration <= 180) {
                    videoScore = 10; // Ideal duration: 30s - 3min
                } else if (estimatedDuration >= 20 && estimatedDuration < 30) {
                    videoScore = 7; // Acceptable but brief
                } else if (estimatedDuration >= 15 && estimatedDuration < 20) {
                    videoScore = 5; // Too brief
                } else if (estimatedDuration > 180 && estimatedDuration <= 300) {
                    videoScore = 7; // Too long but acceptable
                } else if (estimatedDuration > 300) {
                    videoScore = 5; // Way too long
                } else {
                    videoScore = 3; // Very short
                }
                
                // Speech quality score (10 marks per question)
                const wordCount = speechData.wordCount;
                
                // Score based on word count (ideal: 80-300 words for 1-2 min)
                if (wordCount >= 80 && wordCount <= 300) {
                    speechQualityScore += 10; // Excellent speech content
                } else if (wordCount >= 50 && wordCount < 80) {
                    speechQualityScore += 7; // Good but brief
                } else if (wordCount >= 30 && wordCount < 50) {
                    speechQualityScore += 5; // Acceptable but too brief
                } else if (wordCount >= 10 && wordCount < 30) {
                    speechQualityScore += 3; // Minimal speech
                } else if (wordCount > 300 && wordCount <= 500) {
                    speechQualityScore += 8; // Good but lengthy
                } else if (wordCount > 500) {
                    speechQualityScore += 6; // Too lengthy
                }
                
                qualityScore += videoScore;
            }
        });
        
        // Calculate component scores with stricter requirements
        // Only count videos that have meaningful speech
        const completionScore = (videosWithSpeech / total) * 30; // 30 marks for attempting all WITH SPEECH
        const contentScore = qualityScore; // Video duration quality (10 per question)
        const speechScore = speechQualityScore; // Speech content quality (10 per question)
        const timingScore = this.calculateTimingScore(totalDuration, total); // 20 marks
        
        // Total: 30 + 50 + 50 + 20 = 150, scale to 100
        const rawTotal = completionScore + contentScore + speechScore + timingScore;
        const totalMarks = Math.min(100, Math.round((rawTotal / 150) * 100));
        
        // Generate recommendations
        const recommendations = this.generateRecommendations();
        
        return {
            total: totalMarks,
            completion: Math.round(completionScore),
            timing: Math.round(timingScore),
            participation: Math.round((contentScore + speechScore) / 5), // Combined quality score
            maxMarks: 100,
            recommendations: recommendations,
            speechAnalysis: this.getSpeechSummary(),
            videosWithSpeech: videosWithSpeech,
            totalVideos: videoCount
        };
    },
    
    getSpeechSummary() {
        const summary = {
            totalWords: 0,
            questionsWithSpeech: 0,
            averageWordsPerQuestion: 0
        };
        
        Object.keys(this.speechData).forEach(index => {
            const data = this.speechData[index];
            if (data && data.hasSpeech) {
                summary.totalWords += data.wordCount;
                summary.questionsWithSpeech++;
            }
        });
        
        if (summary.questionsWithSpeech > 0) {
            summary.averageWordsPerQuestion = Math.round(summary.totalWords / summary.questionsWithSpeech);
        }
        
        return summary;
    },
    
    calculateTimingScore(totalDuration, totalQuestions) {
        // Ideal: 60-120 seconds per question
        const idealMin = totalQuestions * 60;
        const idealMax = totalQuestions * 120;
        
        if (totalDuration >= idealMin && totalDuration <= idealMax) {
            return 20; // Perfect timing
        } else if (totalDuration >= idealMin * 0.5 && totalDuration <= idealMax * 1.5) {
            return 15; // Acceptable timing
        } else if (totalDuration >= idealMin * 0.25 && totalDuration <= idealMax * 2) {
            return 10; // Poor timing
        } else {
            return 5; // Very poor timing
        }
    },

    generateRecommendations() {
        const recommendations = [];
        
        // Check which questions were not answered properly (no video OR no speech)
        for (let i = 0; i < this.currentQuestions.length; i++) {
            const hasVideo = this.videoAnswers[i];
            const videoBlob = this.videoAnswers[i];
            const speechData = this.speechData[i];
            
            // Check if video is missing, too short, or has no meaningful speech
            const hasMeaningfulSpeech = speechData && speechData.hasSpeech && speechData.wordCount >= 10;
            const isLowQuality = !hasVideo || (videoBlob && videoBlob.size < 50000) || !hasMeaningfulSpeech;
            
            if (isLowQuality) {
                const question = this.currentQuestions[i];
                const keywords = this.extractKeywords(question.question, question.sampleAnswer, question);
                
                let note = '';
                if (!hasVideo) {
                    note = '❌ No video recorded';
                } else if (!hasMeaningfulSpeech) {
                    note = `⚠️ No speech detected (${speechData?.wordCount || 0} words) - Please speak your answer`;
                } else if (videoBlob && videoBlob.size < 50000) {
                    note = '⚠️ Video too short - provide detailed answer';
                }
                
                recommendations.push({
                    questionIndex: i + 1,
                    question: question.question,
                    keywords: keywords,
                    category: this.currentCategory,
                    note: note,
                    wordCount: speechData?.wordCount || 0
                });
            }
        }
        
        // If all questions have proper videos with speech, show top improvement areas
        if (recommendations.length === 0) {
            for (let i = 0; i < Math.min(3, this.currentQuestions.length); i++) {
                const question = this.currentQuestions[i];
                const speechData = this.speechData[i];
                const keywords = this.extractKeywords(question.question, question.sampleAnswer, question);
                
                recommendations.push({
                    questionIndex: i + 1,
                    question: question.question,
                    keywords: keywords,
                    category: this.currentCategory,
                    note: `✅ Good answer (${speechData?.wordCount || 0} words) - Review these topics to improve further`,
                    wordCount: speechData?.wordCount || 0
                });
            }
        }
        
        return recommendations;
    },

    extractKeywords(question, sampleAnswer, questionObj = null) {
        // If question object has keywords property, use it
        if (questionObj && questionObj.keywords && Array.isArray(questionObj.keywords)) {
            return questionObj.keywords;
        }
        
        // Fallback: Extract important keywords from question and sample answer
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'your', 'you', 'me', 'my', 'we', 'our', 'they', 'their'];
        
        const text = (question + ' ' + (sampleAnswer || '')).toLowerCase();
        const words = text.match(/\b[a-z]{4,}\b/g) || [];
        
        // Count word frequency
        const wordCount = {};
        words.forEach(word => {
            if (!commonWords.includes(word)) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
        
        // Get top 5 keywords
        const sortedWords = Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
        
        return sortedWords;
    },

    getAIVideoResources(category) {
        // AI-powered video resources for different categories (YouTube video IDs)
        const resources = {
            'Technical': [
                {
                    title: 'Technical Interview Preparation - Complete Guide',
                    videoId: '1t1_a1BZ04o',
                    description: 'Comprehensive technical interview preparation with sample answers'
                },
                {
                    title: 'How To Ace a Technical Job Interview',
                    videoId: 'zwjm8zmbEbA',
                    description: 'Expert tips on structuring technical interview responses'
                },
                {
                    title: 'Common Technical Interview Questions',
                    videoId: '1qw5ITr3k9E',
                    description: 'Most asked technical questions with detailed answers'
                }
            ],
            'HR/Behavioral': [
                {
                    title: 'HR Interview Questions & Answers',
                    videoId: 'naIkpQ_cIt0',
                    description: 'Complete guide to answering HR and behavioral questions'
                },
                {
                    title: 'Tell Me About Yourself - Perfect Answer',
                    videoId: 'es7XtrloDIQ',
                    description: 'How to craft the perfect self-introduction'
                },
                {
                    title: 'Behavioral Interview Techniques',
                    videoId: 'CAda15Tawlg',
                    description: 'STAR method and behavioral question strategies'
                }
            ],
            'System Design': [
                {
                    title: 'System Design Interview Guide',
                    videoId: 'UzLMhqg3_Wc',
                    description: 'Complete system design interview preparation'
                },
                {
                    title: 'How to Approach System Design',
                    videoId: '0163cssUxLA',
                    description: 'Step-by-step approach to system design problems'
                },
                {
                    title: 'System Design Examples',
                    videoId: 'xpDnVSmNFX0',
                    description: 'Real-world system design interview examples'
                }
            ],
            'Problem Solving': [
                {
                    title: 'Problem Solving Interview Techniques',
                    videoId: 'GBuHSRDGZBY',
                    description: 'How to approach and solve interview problems'
                },
                {
                    title: 'Analytical Thinking in Interviews',
                    videoId: 'DIR_rxusO8Q',
                    description: 'Developing analytical thinking for interviews'
                },
                {
                    title: 'Problem Solving Frameworks',
                    videoId: 'v4cd1O4zkGw',
                    description: 'Frameworks for solving complex problems'
                }
            ]
        };
        
        return resources[category] || resources['HR/Behavioral'];
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}m ${secs}s`;
    },

    showSummary(total, answered, time, marks = null) {
        const container = document.getElementById('interviewSummary');
        const completionRate = Math.round((answered / total) * 100);

        let marksHTML = '';
        let recommendationsHTML = '';
        
        if (marks) {
            const grade = marks.total >= 80 ? 'Excellent' : marks.total >= 60 ? 'Good' : marks.total >= 40 ? 'Average' : 'Needs Improvement';
            const gradeColor = marks.total >= 80 ? '#10b981' : marks.total >= 60 ? '#06b6d4' : marks.total >= 40 ? '#f59e0b' : '#ef4444';
            
            // Speech analysis display
            const speechAnalysis = marks.speechAnalysis || { totalWords: 0, questionsWithSpeech: 0, averageWordsPerQuestion: 0 };
            const speechWarning = marks.videosWithSpeech < marks.totalVideos ? 
                `<div style="background: rgba(239, 68, 68, 0.15); padding: 0.75rem; border-radius: 8px; border-left: 4px solid #ef4444; margin-top: 1rem;">
                    <strong style="color: #ef4444;">⚠️ Speech Detection Issue:</strong>
                    <p style="color: #0a0a0a; font-size: 0.85rem; margin-top: 0.25rem;">
                        Only ${marks.videosWithSpeech} out of ${marks.totalVideos} videos had detectable speech. 
                        Videos without speech receive 0 marks. Please speak clearly when recording your answers.
                    </p>
                </div>` : '';
            
            marksHTML = `
                <div class="marks-section" style="background: rgba(0, 217, 255, 0.1); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 2px solid rgba(0, 217, 255, 0.3); backdrop-filter: blur(10px);">
                    <h3 style="text-align: center; color: #0a0a0a; margin-bottom: 1rem;">📊 Video Interview Assessment</h3>
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <div style="font-size: 3rem; font-weight: bold; color: ${gradeColor};">${marks.total}/${marks.maxMarks}</div>
                        <div style="font-size: 1.2rem; font-weight: 600; color: ${gradeColor}; margin-top: 0.5rem;">${grade}</div>
                    </div>
                    
                    ${speechWarning}
                    
                    <div style="background: rgba(0, 217, 255, 0.08); padding: 1rem; border-radius: 8px; border: 1px solid rgba(0, 217, 255, 0.2); margin: 1rem 0;">
                        <h4 style="color: #0a0a0a; margin-bottom: 0.75rem; font-size: 1rem;">🎤 Speech Analysis</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.75rem;">
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #00d9ff;">${speechAnalysis.totalWords}</div>
                                <div style="font-size: 0.75rem; color: #0a0a0a;">Total Words</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #00d9a8;">${marks.videosWithSpeech}/${marks.totalVideos}</div>
                                <div style="font-size: 0.75rem; color: #0a0a0a;">With Speech</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #4dffff;">${speechAnalysis.averageWordsPerQuestion}</div>
                                <div style="font-size: 0.75rem; color: #0a0a0a;">Avg Words/Q</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                        <div style="background: rgba(0, 184, 212, 0.15); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid rgba(0, 217, 255, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #00d9ff;">${marks.completion}</div>
                            <div style="font-size: 0.85rem; color: #0a0a0a;">Completion (30)</div>
                        </div>
                        <div style="background: rgba(0, 217, 168, 0.15); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid rgba(0, 217, 255, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #00d9a8;">${marks.timing}</div>
                            <div style="font-size: 0.85rem; color: #0a0a0a;">Timing (20)</div>
                        </div>
                        <div style="background: rgba(77, 255, 255, 0.15); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid rgba(0, 217, 255, 0.3);">
                            <div style="font-size: 1.5rem; font-weight: bold; color: #4dffff;">${marks.participation}</div>
                            <div style="font-size: 0.85rem; color: #0a0a0a;">Content Quality (20)</div>
                        </div>
                    </div>
                    <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 217, 255, 0.08); border-radius: 8px; border: 1px solid rgba(0, 217, 255, 0.2);">
                        <h4 style="color: #0a0a0a; margin-bottom: 0.5rem;">💡 Improvement Tips:</h4>
                        <ul style="margin-left: 1.5rem; color: #0a0a0a; font-size: 0.9rem;">
                            ${marks.videosWithSpeech === 0 ? '<li><strong>CRITICAL:</strong> No speech detected in any video! Please speak your answers clearly.</li>' : ''}
                            ${marks.videosWithSpeech > 0 && marks.videosWithSpeech < marks.totalVideos ? '<li><strong>Important:</strong> Some videos had no speech. Speak clearly for all questions.</li>' : ''}
                            ${speechAnalysis.averageWordsPerQuestion < 50 && marks.videosWithSpeech > 0 ? '<li>Your answers are too brief. Aim for 80-300 words per question (1-2 minutes).</li>' : ''}
                            ${marks.completion < 25 ? '<li>Record video answers WITH SPEECH for all questions to improve completion score</li>' : ''}
                            ${marks.timing < 15 ? '<li>Aim for 1-2 minutes per question for better timing</li>' : ''}
                            ${marks.participation < 15 ? '<li>Provide detailed spoken answers - silent or very short videos get low scores</li>' : ''}
                            ${marks.total >= 80 ? '<li>Excellent performance! Keep practicing to maintain this level</li>' : ''}
                            ${marks.total < 60 && marks.videosWithSpeech > 0 ? '<li>Review sample answers and practice speaking clearly with proper content</li>' : ''}
                            ${marks.total < 40 ? '<li>Focus on answering with relevant SPOKEN content and proper duration (1-2 min per question)</li>' : ''}
                        </ul>
                    </div>
                </div>
            `;

            // Generate recommendations section
            if (marks.recommendations && marks.recommendations.length > 0) {
                const keywordsHTML = marks.recommendations.map(rec => {
                    const wordCountColor = rec.wordCount === 0 ? '#ef4444' : rec.wordCount < 30 ? '#f59e0b' : '#10b981';
                    const wordCountText = rec.wordCount === 0 ? '(0 words - NO SPEECH)' : `(${rec.wordCount} words)`;
                    
                    return `
                    <div style="background: rgba(0, 217, 255, 0.08); padding: 1rem; border-radius: 8px; border-left: 4px solid ${rec.wordCount === 0 ? '#ef4444' : '#00d9ff'}; margin-bottom: 1rem;">
                        <h5 style="color: #0a0a0a; margin-bottom: 0.5rem;">
                            Question ${rec.questionIndex}: ${rec.question.substring(0, 60)}...
                            <span style="color: ${wordCountColor}; font-size: 0.85rem; font-weight: normal; margin-left: 0.5rem;">${wordCountText}</span>
                        </h5>
                        ${rec.note ? `<p style="color: ${rec.wordCount === 0 ? '#ef4444' : '#00d9a8'}; font-size: 0.85rem; margin-bottom: 0.5rem; font-weight: 500;">${rec.note}</p>` : ''}
                        <div style="margin-top: 0.5rem;">
                            <strong style="color: #0a0a0a; font-size: 0.85rem;">${rec.wordCount > 0 ? 'Key Topics to Review:' : 'Key Topics to Cover:'}</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                                ${rec.keywords.map(keyword => `
                                    <span style="background: rgba(0, 217, 255, 0.2); color: #0a0a0a; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 500; border: 1px solid rgba(0, 217, 255, 0.4);">
                                        ${keyword}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `}).join('');

                const videoResources = this.getAIVideoResources(this.currentCategory);
                const videosHTML = videoResources.map((video, index) => `
                    <div style="background: rgba(0, 217, 255, 0.08); padding: 1rem; border-radius: 8px; border: 1px solid rgba(0, 217, 255, 0.3); margin-bottom: 1rem;">
                        <h5 style="color: #0a0a0a; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span>🎥</span> ${video.title}
                        </h5>
                        <p style="color: #0a0a0a; font-size: 0.85rem; margin-bottom: 0.75rem;">${video.description}</p>
                        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background: #000;">
                            <iframe 
                                src="https://www.youtube.com/embed/${video.videoId}" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                `).join('');

                recommendationsHTML = `
                    <div class="recommendations-section" style="background: rgba(0, 217, 255, 0.1); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 2px solid rgba(0, 217, 255, 0.3); backdrop-filter: blur(10px);">
                        <h3 style="color: #0a0a0a; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span>🎯</span> Recommendations for Improvement
                        </h3>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="color: #0a0a0a; margin-bottom: 1rem; font-size: 1.1rem;">📝 Missing Keywords in Unanswered Questions</h4>
                            ${keywordsHTML}
                        </div>

                        <div>
                            <h4 style="color: #0a0a0a; margin-bottom: 1rem; font-size: 1.1rem;">🎬 Expert Video Tutorials</h4>
                            <p style="color: #0a0a0a; margin-bottom: 1rem; font-size: 0.9rem;">
                                Watch these expert videos to learn how to answer ${this.currentCategory} questions correctly:
                            </p>
                            <div style="display: grid; gap: 1rem;">
                                ${videosHTML}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        container.innerHTML = `
            <div class="summary-card" style="color: #0a0a0a;">
                <h3 style="color: #0a0a0a;">Practice Session Complete!</h3>
                ${marksHTML}
                ${recommendationsHTML}
                <div class="summary-stats">
                    <div class="summary-stat">
                        <strong>${answered}/${total}</strong>
                        <p style="color: #0a0a0a;">Questions Answered</p>
                    </div>
                    <div class="summary-stat">
                        <strong>${completionRate}%</strong>
                        <p style="color: #0a0a0a;">Completion Rate</p>
                    </div>
                    <div class="summary-stat">
                        <strong>${time}</strong>
                        <p style="color: #0a0a0a;">Practice Time</p>
                    </div>
                </div>
                <div class="summary-message" style="color: #0a0a0a;">
                    <p style="color: #0a0a0a;">Great job on completing the practice session! Keep practicing to improve your interview skills.</p>
                    <p style="color: #0a0a0a;"><strong style="color: #0a0a0a;">Tip:</strong> Review the sample answers and tips to learn how to structure your responses better.</p>
                </div>
                <button class="btn-primary" onclick="MockInterview.backToSelection()" type="button" style="margin-top: 1.5rem; width: 100%;">
                    Practice Another Category
                </button>
            </div>
        `;

        document.getElementById('interviewContainer').classList.add('hidden');
        container.classList.remove('hidden');
    },

    backToSelection() {
        document.querySelector('.interview-selection').classList.remove('hidden');
        document.getElementById('interviewContainer').classList.add('hidden');
        document.getElementById('interviewSummary').classList.add('hidden');
        this.stopTimer();
        this.cleanupVideoMode();
    },

    cancelInterview() {
        if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
            this.currentCategory = null;
            this.currentQuestions = [];
            this.currentQuestionIndex = 0;
            this.timerSeconds = 0;
            this.userAnswers = {};
            this.videoAnswers = {};
            this.backToSelection();
        }
    },

    getPracticeStats() {
        const sessions = Storage.getInterviewSessions();
        return {
            totalSessions: sessions.length,
            totalTime: sessions.reduce((sum, s) => sum + (s.practiceTime || 0), 0),
            averageCompletion: sessions.length > 0 
                ? Math.round(sessions.reduce((sum, s) => sum + (s.completionRate || 0), 0) / sessions.length)
                : 0
        };
    },

    // Video Interview Methods
    async initVideoMode() {
        try {
            this.videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            const videoPreview = document.getElementById('videoPreview');
            if (videoPreview) {
                videoPreview.srcObject = this.videoStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions and try again.');
            this.interviewMode = 'text';
            this.renderQuestion();
        }
    },

    renderVideoInterface() {
        const answerContainer = document.getElementById('interviewAnswer') || document.getElementById('videoInterviewContainer');
        if (!answerContainer) return;

        const isRecording = this.mediaRecorder && this.mediaRecorder.state === 'recording';
        const hasRecording = this.videoAnswers[this.currentQuestionIndex];
        const speechData = this.speechData[this.currentQuestionIndex];
        const wordCount = speechData?.wordCount || 0;

        const videoHTML = `
            <div id="videoInterviewContainer" style="margin-top: 1rem;">
                <div style="position: relative; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 1rem;">
                    <video id="videoPreview" autoplay muted playsinline style="width: 100%; max-height: 400px; display: ${hasRecording ? 'none' : 'block'};"></video>
                    <video id="videoPlayback" controls style="width: 100%; max-height: 400px; display: ${hasRecording ? 'block' : 'none'};"></video>
                    ${isRecording ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: red; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold;">● REC</div>
                        <div id="speechIndicator" style="position: absolute; top: 10px; left: 10px; background: rgba(0, 0, 0, 0.7); color: white; padding: 8px 12px; border-radius: 4px; font-size: 0.9rem;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span id="speechIcon">🎤</span>
                                <span id="speechStatus">Listening...</span>
                            </div>
                            <div id="wordCounter" style="font-size: 0.85rem; margin-top: 4px; color: #00d9ff;">Words: <span id="wordCount">0</span></div>
                        </div>
                    ` : ''}
                    ${hasRecording && wordCount > 0 ? `
                        <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(0, 217, 255, 0.9); color: #0a0a0a; padding: 6px 12px; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">
                            ✓ ${wordCount} words detected
                        </div>
                    ` : ''}
                    ${hasRecording && wordCount === 0 ? `
                        <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(239, 68, 68, 0.9); color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">
                            ⚠️ No speech detected!
                        </div>
                    ` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button id="startRecording" class="btn-primary" ${isRecording ? 'disabled' : ''} style="flex: 1;">
                        ${isRecording ? 'Recording...' : 'Start Recording'}
                    </button>
                    <button id="stopRecording" class="btn-secondary" ${!isRecording ? 'disabled' : ''} style="flex: 1;">
                        Stop Recording
                    </button>
                    ${hasRecording ? '<button id="playRecording" class="btn-secondary" style="flex: 1;">Play Recording</button>' : ''}
                    ${hasRecording ? '<button id="deleteRecording" class="btn-secondary" style="flex: 1;">Delete & Re-record</button>' : ''}
                </div>
                ${hasRecording && wordCount < 10 ? `
                    <div style="background: rgba(239, 68, 68, 0.15); padding: 0.75rem; border-radius: 8px; border-left: 4px solid #ef4444; margin-top: 1rem;">
                        <strong style="color: #ef4444;">⚠️ Warning:</strong>
                        <span style="color: #0a0a0a; font-size: 0.9rem;"> This answer has insufficient speech (${wordCount} words). You need at least 10 words to receive marks. Please re-record with a proper spoken answer.</span>
                    </div>
                ` : ''}
            </div>
        `;

        // Replace or update the container
        if (answerContainer.id === 'interviewAnswer') {
            answerContainer.outerHTML = videoHTML;
        } else {
            answerContainer.outerHTML = videoHTML;
        }

        // Re-attach video stream and setup controls
        setTimeout(() => {
            const videoPreview = document.getElementById('videoPreview');
            if (videoPreview && this.videoStream) {
                videoPreview.srcObject = this.videoStream;
                videoPreview.play().catch(err => console.log('Video play error:', err));
            }

            // Load existing recording if available
            if (hasRecording) {
                const videoPlayback = document.getElementById('videoPlayback');
                if (videoPlayback) {
                    videoPlayback.src = URL.createObjectURL(hasRecording);
                }
            }

            // Setup video controls
            this.setupVideoControls();
        }, 100);
    },

    setupVideoControls() {
        const startBtn = document.getElementById('startRecording');
        const stopBtn = document.getElementById('stopRecording');
        const playBtn = document.getElementById('playRecording');
        const deleteBtn = document.getElementById('deleteRecording');

        if (startBtn) {
            startBtn.onclick = () => this.startRecording();
        }
        if (stopBtn) {
            stopBtn.onclick = () => this.stopRecording();
        }
        if (playBtn) {
            playBtn.onclick = () => this.playRecording();
        }
        if (deleteBtn) {
            deleteBtn.onclick = () => this.deleteRecording();
        }
    },

    startRecording() {
        if (!this.videoStream) {
            alert('Camera not initialized. Please refresh and try again.');
            return;
        }

        try {
            this.recordedChunks = [];
            
            // Initialize speech recognition for this question
            this.initSpeechRecognition();
            
            // Check for supported mime types
            let mimeType = 'video/webm;codecs=vp8,opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/mp4';
                }
            }

            this.mediaRecorder = new MediaRecorder(this.videoStream, {
                mimeType: mimeType
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: mimeType });
                this.videoAnswers[this.currentQuestionIndex] = blob;
                
                // Stop speech recognition
                if (this.speechRecognition) {
                    this.speechRecognition.stop();
                }
                
                this.renderVideoInterface();
            };

            this.mediaRecorder.start();
            if (!this.timerRunning) {
                this.startTimer();
            }
            this.renderVideoInterface();
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Failed to start recording: ' + error.message);
        }
    },

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.stopTimer();
        }
        
        // Stop speech recognition
        if (this.speechRecognition) {
            this.speechRecognition.stop();
        }
    },
    
    initSpeechRecognition() {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            alert('Speech recognition not available. Scoring will be based on video duration only.');
            return;
        }
        
        try {
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-US';
            
            // Initialize speech data for current question
            if (!this.speechData[this.currentQuestionIndex]) {
                this.speechData[this.currentQuestionIndex] = {
                    transcript: '',
                    wordCount: 0,
                    duration: 0,
                    startTime: Date.now(),
                    hasSpeech: false
                };
            }
            
            this.speechRecognition.onstart = () => {
                console.log('✅ Speech recognition started for question', this.currentQuestionIndex + 1);
            };
            
            this.speechRecognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    const data = this.speechData[this.currentQuestionIndex];
                    data.transcript += finalTranscript;
                    data.wordCount = data.transcript.trim().split(/\s+/).filter(w => w.length > 0).length;
                    data.hasSpeech = true;
                    data.duration = (Date.now() - data.startTime) / 1000;
                    
                    // Update real-time word count display
                    const wordCountElement = document.getElementById('wordCount');
                    const speechIcon = document.getElementById('speechIcon');
                    const speechStatus = document.getElementById('speechStatus');
                    
                    if (wordCountElement) {
                        wordCountElement.textContent = data.wordCount;
                    }
                    if (speechIcon) {
                        speechIcon.textContent = '🎤✓';
                        speechIcon.style.color = '#10b981';
                    }
                    if (speechStatus) {
                        speechStatus.textContent = 'Speech detected!';
                        speechStatus.style.color = '#10b981';
                    }
                    
                    console.log(`📝 Words spoken: ${data.wordCount}, Duration: ${data.duration.toFixed(1)}s`);
                }
            };
            
            this.speechRecognition.onerror = (event) => {
                console.error('❌ Speech recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Speech analysis will not be available.');
                }
            };
            
            this.speechRecognition.onend = () => {
                console.log('🛑 Speech recognition ended for question', this.currentQuestionIndex + 1);
            };
            
            this.speechRecognition.start();
            console.log('🎤 Starting speech recognition...');
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            alert('Failed to start speech recognition: ' + error.message);
        }
    },

    playRecording() {
        const blob = this.videoAnswers[this.currentQuestionIndex];
        if (!blob) return;

        const videoPlayback = document.getElementById('videoPlayback');
        const videoPreview = document.getElementById('videoPreview');
        
        if (videoPlayback && videoPreview) {
            videoPlayback.src = URL.createObjectURL(blob);
            videoPlayback.style.display = 'block';
            videoPreview.style.display = 'none';
        }
    },

    deleteRecording() {
        if (confirm('Are you sure you want to delete this recording?')) {
            delete this.videoAnswers[this.currentQuestionIndex];
            const videoPlayback = document.getElementById('videoPlayback');
            if (videoPlayback) {
                URL.revokeObjectURL(videoPlayback.src);
            }
            this.renderVideoInterface();
        }
    },

    cleanupVideoMode() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
        }
        if (this.mediaRecorder) {
            this.mediaRecorder = null;
        }
        if (this.speechRecognition) {
            this.speechRecognition.stop();
            this.speechRecognition = null;
        }
        this.recordedChunks = [];
        this.speechData = {};
    }
};

