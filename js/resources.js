// Resource Library Management

const Resources = {
    currentFilter: 'all',
    searchQuery: '',

    init() {
        // Force clear all existing resources
        localStorage.removeItem('spt_resources');
        
        this.initializeSampleResources();
        this.renderResources();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderResources();
            });
        });

        // Search
        const searchInput = document.getElementById('resourceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.renderResources();
            });
        }
    },

    initializeSampleResources() {
        const existing = Storage.getResources();
        if (existing && existing.length > 0) return;

        const sampleResources = [
            // Free Videos - YouTube
            {
                id: 1,
                title: 'Complete Interview Preparation',
                type: 'video',
                category: 'Interview Prep',
                url: 'https://youtu.be/-JNjsOX0N0c?si=jNI-Zy0lQVIIixdK',
                description: 'Free comprehensive campus placement interview preparation covering technical and HR rounds.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 2,
                title: 'Resume Writing for Freshers',
                type: 'video',
                category: 'Resume & CV',
                url: 'https://www.youtube.com/watch?v=Tt08KmFfIYQ',
                description: 'Free step-by-step guide to create professional ATS-friendly resumes.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 3,
                title: 'Communication Skills Masterclass',
                type: 'video',
                category: 'Soft Skills',
                url: 'https://www.youtube.com/watch?v=HAnw168huqA',
                description: 'Free masterclass on effective communication for interviews and professional settings.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 4,
                title: 'Body Language for Success',
                type: 'video',
                category: 'Soft Skills',
                url: 'https://youtu.be/M2NFhwHyNhc?si=cOzdl9sK1jb6Q0n7',
                description: 'Free guide to powerful body language techniques for interviews.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 5,
                title: 'Aptitude Questions ',
                type: 'video',
                category: 'Aptitude',
                url: 'https://youtu.be/x9xR0GLYn3s?si=1BH9jOR7d_u_qK2B',
                description: 'Free complete aptitude preparation covering quantitative and logical reasoning.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
             {
                id: 6,
                title: 'Behavioral interview questions',
                type: 'video',
                category: 'Aptitude',
                url: 'https://youtu.be/WdyiUe7_3cA?si=ZCZS_sluGSUSc1xK',
                description: 'Answering behavioral interview questions is shockingly uncomplicated.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },

            // Free Articles - Medium & Other Free Platforms
            {
                id:7,
                title: 'Top Interview Questions Guide',
                type: 'article',
                category: 'Interview Prep',
                url: 'https://www.themuse.com/advice/interview-questions-and-answers',
                description: 'Free comprehensive guide with common interview questions and answers.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 8,
                title: 'How to Ace Job Interviews',
                type: 'article',
                category: 'Interview Prep',
                url: 'https://www.experis.com/en/insights/articles/20-tips-for-great-job-interviews',
                description: 'Free essential tips and strategies to succeed in job interviews.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 9,
                title: 'Resume Writing Complete Guide',
                type: 'article',
                category: 'Resume & CV',
                url: 'https://in.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume-with-examples',
                description: 'Free complete guide to writing professional resumes with examples.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 10,
                title: 'Professional Email Writing',
                type: 'article',
                category: 'Soft Skills',
                url: 'https://in.indeed.com/career-advice/resumes-cover-letters/job-application-email',
                description: 'Free guide to professional email writing for job applications.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 11,
                title: 'Career Development Strategies',
                type: 'article',
                category: 'Career Development',
                url: 'https://peoplespheres.com/career-development-its-importance-and-strategies-for-success/',
                description: 'Free career development strategies for professional success.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },

            // Free Courses (Fully Free Access)
            {
                id: 12,
                title: 'Introduction to Public Speaking',
                type: 'course',
                category: 'Soft Skills',
                url: 'https://www.coursera.org/learn/public-speaking',
                description: 'Free course on public speaking and presentation skills (audit option available).',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 13,
                title: 'Successful Negotiation',
                type: 'course',
                category: 'Career Development',
                url: 'https://www.coursera.org/learn/negotiation-skills',
                description: 'Free course on negotiation strategies (audit option available).',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 14,
                title: 'Work Smarter, Not Harder',
                type: 'course',
                category: 'Career Development',
                url: 'https://www.coursera.org/learn/work-smarter-not-harder',
                description: 'Free course on time management and productivity (audit option available).',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 15,
                title: 'Professional Development',
                type: 'course',
                category: 'Career Development',
                url: 'https://www.edx.org/learn/professional-development',
                description: 'Free professional development courses from leading institutions.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },

            // Free Books - Project Gutenberg (Verified Working)
            {
                id: 16,
                title: 'The Art of Public Speaking',
                type: 'book',
                category: 'Soft Skills',
                url: 'https://www.gutenberg.org/ebooks/16317',
                description: 'Free comprehensive guide to public speaking and presentation skills.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 17,
                title: 'The Science of Getting Rich',
                type: 'book',
                category: 'Career Development',
                url: 'https://www.gutenberg.org/ebooks/43340',
                description: 'Free book on success and wealth creation principles.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 18,
                title: 'As a Man Thinketh',
                type: 'book',
                category: 'Career Development',
                url: 'https://www.gutenberg.org/ebooks/4507',
                description: 'Free classic on personal development and positive mindset.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 19,
                title: 'Self-Help by Samuel Smiles',
                type: 'book',
                category: 'Career Development',
                url: 'https://www.gutenberg.org/ebooks/935',
                description: 'Free classic book on self-improvement and character development.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 20,
                title: 'The Way to Wealth',
                type: 'book',
                category: 'Career Development',
                url: 'https://www.gutenberg.org/ebooks/48',
                description: 'Free Benjamin Franklin classic on success and financial wisdom.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },

            // Free Podcasts
            {
                id: 21,
                title: 'Career Contessa Podcast',
                type: 'audio',
                category: 'Career Development',
                url: 'https://www.careercontessa.com/podcast/',
                description: 'Free podcast with career advice and job search strategies.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 22,
                title: 'Coaching Real Leaders',
                type: 'audio',
                category: 'Soft Skills',
                url: 'https://hbr.org/2020/12/podcast-coaching-real-leaders',
                description: 'Real-life coaching sessions with leaders working to overcome professional challenges..',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 23,
                title: 'Job Interview Questions You will Never Fear Again',
                type: 'audio',
                category: 'Interview Prep',
                url: 'https://soundcloud.com/penguin-audio/101-job-interview-questions?in=wafaa-jo/sets/english',
                description: 'Free podcast with expert interview tips and strategies.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            {
                id: 24,
                title: 'WorkLife with Adam Grant',
                type: 'audio',
                category: 'Career Development',
                url: 'https://www.ted.com/podcasts/worklife',
                description: 'Free TED podcast on workplace culture and productivity.',
                bookmarked: false,
                addedDate: new Date().toISOString()
            },
            
        ];

        Storage.saveResources(sampleResources);
    },

    renderResources() {
        const container = document.getElementById('resourcesGrid');
        if (!container) return;

        let resources = Storage.getResources() || [];

        // Apply filters
        if (this.currentFilter !== 'all') {
            if (this.currentFilter === 'bookmarked') {
                resources = resources.filter(r => r.bookmarked);
            } else {
                resources = resources.filter(r => r.type === this.currentFilter);
            }
        }

        // Apply search
        if (this.searchQuery) {
            resources = resources.filter(r => 
                r.title.toLowerCase().includes(this.searchQuery) ||
                r.description.toLowerCase().includes(this.searchQuery) ||
                r.category.toLowerCase().includes(this.searchQuery)
            );
        }

        if (resources.length === 0) {
            container.innerHTML = '<p class="no-resources">No resources found. Try a different filter!</p>';
            return;
        }

        container.innerHTML = resources.map(resource => `
            <div class="resource-card" data-id="${resource.id}">
                <div class="resource-header">
                    <span class="resource-type-badge ${resource.type}">${this.getTypeIcon(resource.type)} ${resource.type}</span>
                    <button class="bookmark-btn ${resource.bookmarked ? 'bookmarked' : ''}" 
                            onclick="Resources.toggleBookmark(${resource.id})"
                            aria-label="${resource.bookmarked ? 'Remove bookmark' : 'Add bookmark'}">
                        ${resource.bookmarked ? '★' : '☆'}
                    </button>
                </div>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-category">${resource.category}</p>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-actions">
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="btn-primary resource-link">
                        Open Resource
                    </a>
                </div>
            </div>
        `).join('');
    },

    getTypeIcon(type) {
        const icons = {
            video: '🎥',
            audio: '🎧',
            article: '📄',
            course: '🎓',
            book: '📚'
        };
        return icons[type] || '📌';
    },

    toggleBookmark(id) {
        const resources = Storage.getResources();
        const resource = resources.find(r => r.id === id);
        
        if (resource) {
            resource.bookmarked = !resource.bookmarked;
            Storage.saveResources(resources);
            this.renderResources();
        }
    }
};
