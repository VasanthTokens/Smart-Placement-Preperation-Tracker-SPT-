// Resume Checker

const Resume = {
    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupFileUpload();
    },

    setupEventListeners() {
        document.getElementById('checkResume').addEventListener('click', () => {
            this.checkResume();
        });
        document.getElementById('checkATS').addEventListener('click', () => {
            this.checkATS();
        });
    },

    setupFileUpload() {
        const fileInput = document.getElementById('resumeFile');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        }
    },

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileNameDisplay = document.getElementById('fileName');
        const progressContainer = document.getElementById('uploadProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const textarea = document.getElementById('resumeText');
        
        fileNameDisplay.textContent = `Selected: ${file.name}`;

        const fileType = file.name.split('.').pop().toLowerCase();
        
        try {
            let text = '';
            
            if (fileType === 'txt') {
                // Read text file directly
                progressContainer.classList.remove('hidden');
                progressText.textContent = 'Reading text file...';
                progressFill.style.width = '50%';
                
                text = await this.readTextFile(file);
                
                progressFill.style.width = '100%';
                progressText.textContent = 'Complete!';
                
            } else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
                // Use OCR for image files
                progressContainer.classList.remove('hidden');
                progressText.textContent = 'Processing image with OCR...';
                progressFill.style.width = '10%';
                
                text = await this.extractTextFromImage(file, (progress) => {
                    const percentage = Math.round(progress * 100);
                    progressFill.style.width = `${percentage}%`;
                    progressText.textContent = `Processing image: ${percentage}%`;
                });
                
                progressText.textContent = 'OCR Complete!';
                
            } else if (fileType === 'pdf') {
                // For PDF, show message
                alert('PDF text extraction requires additional setup. Please use an image (JPG/PNG) or TXT file, or convert your PDF to an image first.');
                fileInput.value = '';
                fileNameDisplay.textContent = '';
                return;
            } else if (fileType === 'doc' || fileType === 'docx') {
                // For DOC/DOCX, show message
                alert('DOC/DOCX parsing requires additional libraries. Please use an image (JPG/PNG) or TXT file, or convert your document to an image first.');
                fileInput.value = '';
                fileNameDisplay.textContent = '';
                return;
            }

            // Set the extracted text to the textarea and show it
            textarea.value = text;
            textarea.classList.remove('hidden');
            
            // Hide progress after a short delay
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                progressFill.style.width = '0%';
            }, 1500);
            
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error processing file: ' + error.message);
            fileInput.value = '';
            fileNameDisplay.textContent = '';
            progressContainer.classList.add('hidden');
            progressFill.style.width = '0%';
        }
    },

    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    },

    extractTextFromImage(file, progressCallback) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const imageData = e.target.result;
                    
                    // Use Tesseract.js for OCR
                    const result = await Tesseract.recognize(
                        imageData,
                        'eng',
                        {
                            logger: (m) => {
                                if (m.status === 'recognizing text') {
                                    progressCallback(m.progress);
                                }
                            }
                        }
                    );
                    
                    resolve(result.data.text);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    },

    setupTabs() {
        const tabs = document.querySelectorAll('.resume-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.getAttribute('data-tab'));
            });
        });
    },

    switchTab(tabName) {
        const tabs = document.querySelectorAll('.resume-tab');
        tabs.forEach(t => {
            if (t.getAttribute('data-tab') === tabName) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
        
        if (tabName === 'basic') {
            document.getElementById('resumeResults').classList.remove('hidden');
            document.getElementById('atsResults').classList.add('hidden');
        } else {
            document.getElementById('resumeResults').classList.add('hidden');
            document.getElementById('atsResults').classList.remove('hidden');
        }
    },

    checkResume() {
        const resumeTextEl = document.getElementById('resumeText');
        if (!resumeTextEl) return;
        
        const resumeText = resumeTextEl.value.trim();

        if (!resumeText) {
            alert('Please paste your resume text before checking.');
            return;
        }

        const result = this.analyzeResume(resumeText);
        this.displayResults(result);

        // Save resume check
        const check = {
            date: new Date().toISOString(),
            score: result.score,
            strengths: result.strengths,
            improvements: result.improvements
        };

        Storage.saveResumeCheck(check);
        Dashboard.update();
        
        // Switch to basic tab
        this.switchTab('basic');
    },

    analyzeResume(text) {
        const lowerText = text.toLowerCase();
        let score = 0;
        const strengths = [];
        const improvements = [];

        // Check for key sections
        const sections = {
            'Contact Details': ['email', 'phone', 'contact', 'address', 'linkedin'],
            'Education': ['education', 'degree', 'university', 'college', 'cgpa', 'gpa'],
            'Skills': ['skills', 'programming', 'languages', 'technologies', 'tools'],
            'Projects': ['projects', 'project', 'github', 'portfolio'],
            'Experience': ['experience', 'internship', 'work', 'employment', 'job']
        };

        const foundSections = [];
        Object.keys(sections).forEach(section => {
            const keywords = sections[section];
            const found = keywords.some(keyword => lowerText.includes(keyword));
            if (found) {
                foundSections.push(section);
                score += 15;
                strengths.push(`Contains ${section} section`);
            } else {
                improvements.push(`Add ${section} section`);
            }
        });

        // Check for relevant keywords for placement roles
        const placementKeywords = {
            'Programming Languages': ['java', 'python', 'javascript', 'c++', 'c#', 'go', 'rust'],
            'Web Technologies': ['html', 'css', 'react', 'angular', 'vue', 'node', 'express'],
            'Databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'database'],
            'Tools & Technologies': ['git', 'docker', 'kubernetes', 'aws', 'cloud'],
            'Data Structures': ['algorithm', 'data structure', 'dsa', 'leetcode'],
            'Soft Skills': ['leadership', 'teamwork', 'communication', 'problem solving']
        };

        let keywordScore = 0;
        Object.keys(placementKeywords).forEach(category => {
            const keywords = placementKeywords[category];
            const found = keywords.some(keyword => lowerText.includes(keyword));
            if (found) {
                keywordScore += 5;
                strengths.push(`Mentions relevant ${category.toLowerCase()}`);
            }
        });

        score += Math.min(keywordScore, 25); // Cap keyword score at 25

        // Check for quantifiable achievements
        if (/\d+/.test(text)) {
            score += 5;
            strengths.push('Contains quantifiable achievements');
        } else {
            improvements.push('Add quantifiable achievements (numbers, percentages, etc.)');
        }

        // Check for action verbs
        const actionVerbs = ['developed', 'implemented', 'designed', 'created', 'managed', 'led', 'improved', 'optimized'];
        const hasActionVerbs = actionVerbs.some(verb => lowerText.includes(verb));
        if (hasActionVerbs) {
            score += 5;
            strengths.push('Uses action-oriented language');
        } else {
            improvements.push('Use more action verbs (developed, implemented, designed, etc.)');
        }

        // Ensure score is between 0 and 100
        score = Math.min(100, Math.max(0, score));

        // Add general feedback
        if (score < 50) {
            improvements.push('Consider adding more technical details and achievements');
            improvements.push('Ensure all sections are well-structured and detailed');
        } else if (score < 75) {
            improvements.push('Add more specific technical skills and projects');
            improvements.push('Include metrics and achievements in your experience');
        } else {
            strengths.push('Resume has good structure and content');
        }

        return {
            score: score,
            strengths: strengths.length > 0 ? strengths : ['Resume structure looks good'],
            improvements: improvements.length > 0 ? improvements : ['Keep up the good work!']
        };
    },

    displayResults(result) {
        const container = document.getElementById('resumeResults');
        
        container.innerHTML = `
            <div class="resume-score">
                <h3>Resume Score</h3>
                <div class="resume-score-value">${result.score}/100</div>
            </div>
            <div class="resume-feedback">
                <div class="feedback-section">
                    <h4>Strengths</h4>
                    <ul class="feedback-list">
                        ${result.strengths.map(strength => `<li>${strength}</li>`).join('')}
                    </ul>
                </div>
                <div class="feedback-section">
                    <h4>Areas for Improvement</h4>
                    <ul class="feedback-list improvements">
                        ${result.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        container.classList.remove('hidden');
    },

    getLatestResumeScore() {
        const check = Storage.getResumeCheck();
        return check ? check.score : null;
    },

    checkATS() {
        const resumeTextEl = document.getElementById('resumeText');
        if (!resumeTextEl) return;
        
        const resumeText = resumeTextEl.value.trim();

        if (!resumeText) {
            alert('Please paste your resume text before checking ATS compatibility.');
            return;
        }

        const result = this.analyzeATS(resumeText);
        this.displayATSResults(result);

        // Save ATS check
        Storage.saveATSCheck({
            date: new Date().toISOString(),
            score: result.score,
            categories: result.categories
        });

        // Switch to ATS tab
        this.switchTab('ats');
    },

    analyzeATS(text) {
        const lowerText = text.toLowerCase();
        let totalScore = 0;
        let maxScore = 0;
        const categories = [];

        // 1. Standard Section Headings Check
        const standardHeadings = {
            'Contact Information': ['contact', 'email', 'phone', 'address', 'linkedin', 'github'],
            'Education': ['education', 'academic', 'degree', 'university', 'college'],
            'Experience': ['experience', 'work experience', 'employment', 'professional experience'],
            'Skills': ['skills', 'technical skills', 'competencies'],
            'Projects': ['projects', 'project experience', 'portfolio']
        };

        let headingsScore = 0;
        const headingsFound = [];
        const headingsMissing = [];

        Object.keys(standardHeadings).forEach(heading => {
            const keywords = standardHeadings[heading];
            const found = keywords.some(keyword => lowerText.includes(keyword));
            if (found) {
                headingsFound.push(heading);
                headingsScore += 20;
            } else {
                headingsMissing.push(heading);
            }
        });

        maxScore += 100;
        totalScore += headingsScore;

        categories.push({
            name: 'Standard Section Headings',
            score: headingsScore,
            maxScore: 100,
            status: headingsScore >= 80 ? 'pass' : headingsScore >= 60 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'Required Sections Present',
                    status: headingsFound.length >= 4 ? 'pass' : headingsFound.length >= 3 ? 'warning' : 'fail',
                    details: `Found: ${headingsFound.join(', ') || 'None'}. Missing: ${headingsMissing.join(', ') || 'None'}`
                }
            ]
        });

        // 2. Contact Information Format
        const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/;
        const phonePattern = /[\d\s\(\)\-\+]{10,}/;
        const hasEmail = emailPattern.test(text);
        const hasPhone = phonePattern.test(text);
        const hasLinkedIn = /linkedin/i.test(text);

        let contactScore = 0;
        if (hasEmail) contactScore += 33;
        if (hasPhone) contactScore += 33;
        if (hasLinkedIn) contactScore += 34;

        maxScore += 100;
        totalScore += contactScore;

        categories.push({
            name: 'Contact Information Format',
            score: contactScore,
            maxScore: 100,
            status: contactScore >= 80 ? 'pass' : contactScore >= 60 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'Email Address',
                    status: hasEmail ? 'pass' : 'fail',
                    details: hasEmail ? 'Email address found' : 'Add a professional email address'
                },
                {
                    name: 'Phone Number',
                    status: hasPhone ? 'pass' : 'warning',
                    details: hasPhone ? 'Phone number found' : 'Consider adding a phone number'
                },
                {
                    name: 'LinkedIn Profile',
                    status: hasLinkedIn ? 'pass' : 'warning',
                    details: hasLinkedIn ? 'LinkedIn profile found' : 'Consider adding LinkedIn profile link'
                }
            ]
        });

        // 3. Special Characters Check (ATS unfriendly)
        const problematicChars = {
            'Special Symbols': /[®©™°²³]/g,
            'Unicode Characters': /[^\x00-\x7F]/g,
            'Complex Formatting': /[•▪▫]/g
        };

        let charIssues = [];
        Object.keys(problematicChars).forEach(type => {
            const matches = text.match(problematicChars[type]);
            if (matches && matches.length > 0) {
                charIssues.push(`${type}: ${matches.length} found`);
            }
        });

        const charScore = charIssues.length === 0 ? 100 : Math.max(0, 100 - (charIssues.length * 30));
        maxScore += 100;
        totalScore += charScore;

        categories.push({
            name: 'Special Characters & Formatting',
            score: charScore,
            maxScore: 100,
            status: charScore >= 80 ? 'pass' : charScore >= 60 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'ATS-Friendly Characters',
                    status: charIssues.length === 0 ? 'pass' : 'fail',
                    details: charIssues.length === 0 
                        ? 'No problematic characters found' 
                        : `Issues found: ${charIssues.join('; ')}. Use standard ASCII characters.`
                }
            ]
        });

        // 4. Keywords Optimization
        const importantKeywords = {
            'Programming Languages': ['java', 'python', 'javascript', 'c++', 'c#', 'go', 'rust', 'kotlin', 'swift'],
            'Web Technologies': ['html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask'],
            'Databases': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle'],
            'Tools': ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'ci/cd'],
            'Concepts': ['algorithm', 'data structure', 'oop', 'design pattern', 'api', 'rest', 'microservices']
        };

        let keywordCount = 0;
        const foundKeywords = [];
        Object.keys(importantKeywords).forEach(category => {
            const keywords = importantKeywords[category];
            const found = keywords.filter(kw => lowerText.includes(kw));
            if (found.length > 0) {
                keywordCount += found.length;
                foundKeywords.push(`${category}: ${found.length} keywords`);
            }
        });

        const keywordScore = Math.min(100, (keywordCount / 15) * 100);
        maxScore += 100;
        totalScore += keywordScore;

        categories.push({
            name: 'Keywords Optimization',
            score: keywordScore,
            maxScore: 100,
            status: keywordScore >= 70 ? 'pass' : keywordScore >= 50 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'Relevant Keywords',
                    status: keywordCount >= 10 ? 'pass' : keywordCount >= 5 ? 'warning' : 'fail',
                    details: `Found ${keywordCount} relevant keywords. ${foundKeywords.join('; ')}`
                }
            ]
        });

        // 5. Date Format Consistency
        const dateFormats = [
            /\d{4}-\d{2}/g,  // YYYY-MM
            /\d{2}\/\d{4}/g,  // MM/YYYY
            /\d{4}/g,         // YYYY
            /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}/gi  // Month YYYY
        ];

        let dateCount = 0;
        dateFormats.forEach(format => {
            const matches = text.match(format);
            if (matches) dateCount += matches.length;
        });

        const dateScore = dateCount >= 2 ? 100 : dateCount === 1 ? 50 : 0;
        maxScore += 100;
        totalScore += dateScore;

        categories.push({
            name: 'Date Format Consistency',
            score: dateScore,
            maxScore: 100,
            status: dateScore >= 80 ? 'pass' : dateScore >= 50 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'Consistent Date Format',
                    status: dateCount >= 2 ? 'pass' : dateCount === 1 ? 'warning' : 'fail',
                    details: dateCount >= 2 
                        ? 'Dates are consistently formatted' 
                        : 'Use consistent date format (e.g., MM/YYYY or Month YYYY)'
                }
            ]
        });

        // 6. Action Verbs
        const actionVerbs = ['developed', 'implemented', 'designed', 'created', 'managed', 'led', 'improved', 
                            'optimized', 'built', 'delivered', 'achieved', 'increased', 'reduced', 'solved'];
        const verbCount = actionVerbs.filter(verb => lowerText.includes(verb)).length;
        const verbScore = Math.min(100, (verbCount / 5) * 100);
        maxScore += 100;
        totalScore += verbScore;

        categories.push({
            name: 'Action-Oriented Language',
            score: verbScore,
            maxScore: 100,
            status: verbScore >= 60 ? 'pass' : verbScore >= 40 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'Action Verbs Used',
                    status: verbCount >= 5 ? 'pass' : verbCount >= 3 ? 'warning' : 'fail',
                    details: `Found ${verbCount} action verbs. Use strong action verbs to describe achievements.`
                }
            ]
        });

        // 7. Quantifiable Achievements
        const numberPattern = /\d+[%]?|\d+\.\d+/g;
        const numbers = text.match(numberPattern);
        const quantScore = numbers && numbers.length >= 3 ? 100 : numbers && numbers.length >= 1 ? 50 : 0;
        maxScore += 100;
        totalScore += quantScore;

        categories.push({
            name: 'Quantifiable Achievements',
            score: quantScore,
            maxScore: 100,
            status: quantScore >= 80 ? 'pass' : quantScore >= 50 ? 'warning' : 'fail',
            checks: [
                {
                    name: 'Metrics and Numbers',
                    status: numbers && numbers.length >= 3 ? 'pass' : numbers && numbers.length >= 1 ? 'warning' : 'fail',
                    details: numbers && numbers.length >= 3 
                        ? `Found ${numbers.length} quantifiable metrics` 
                        : 'Add more numbers, percentages, and metrics to quantify achievements'
                }
            ]
        });

        // Calculate overall ATS score
        const overallScore = Math.round((totalScore / maxScore) * 100);

        return {
            score: overallScore,
            categories: categories,
            recommendations: this.generateATSRecommendations(categories, overallScore)
        };
    },

    generateATSRecommendations(categories, overallScore) {
        const recommendations = [];

        if (overallScore < 70) {
            recommendations.push('Your resume needs significant improvements for ATS compatibility');
        }

        categories.forEach(category => {
            if (category.status === 'fail') {
                if (category.name === 'Standard Section Headings') {
                    recommendations.push('Use standard section headings like "Education", "Experience", "Skills"');
                } else if (category.name === 'Contact Information Format') {
                    recommendations.push('Ensure contact information is clearly formatted and easily parseable');
                } else if (category.name === 'Special Characters & Formatting') {
                    recommendations.push('Remove special characters and use plain text formatting');
                }
            }
        });

        if (recommendations.length === 0) {
            recommendations.push('Your resume is well-optimized for ATS systems!');
        }

        return recommendations;
    },

    displayATSResults(result) {
        const container = document.getElementById('atsResults');
        
        container.innerHTML = `
            <div class="ats-score">
                <h3>ATS Compatibility Score</h3>
                <div class="ats-score-value">${result.score}/100</div>
                <p style="color: var(--text-light); margin-top: 0.5rem;">
                    ${result.score >= 80 ? 'Excellent' : result.score >= 60 ? 'Good' : result.score >= 40 ? 'Needs Improvement' : 'Poor'} ATS compatibility
                </p>
            </div>
            <div class="ats-categories">
                ${result.categories.map(category => `
                    <div class="ats-category ${category.status}">
                        <h4>
                            <span class="ats-check-icon ${category.status}">
                                ${category.status === 'pass' ? '✓' : category.status === 'warning' ? '⚠' : '✗'}
                            </span>
                            ${category.name} (${category.score}/${category.maxScore})
                        </h4>
                        ${category.checks.map(check => `
                            <div class="ats-check-item">
                                <span class="ats-check-icon ${check.status}">
                                    ${check.status === 'pass' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}
                                </span>
                                <div class="ats-check-details">
                                    <strong>${check.name}</strong>
                                    <p>${check.details}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            ${result.recommendations.length > 0 ? `
                <div class="ats-recommendations">
                    <h5>Recommendations</h5>
                    <ul>
                        ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        container.classList.remove('hidden');
    }
};

