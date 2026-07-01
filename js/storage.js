// LocalStorage Helper Functions

const Storage = {
    // User Profile
    saveProfile(profile) {
        localStorage.setItem('spt_profile', JSON.stringify(profile));
    },

    getProfile() {
        const profile = localStorage.getItem('spt_profile');
        return profile ? JSON.parse(profile) : null;
    },

    // Quiz Questions
    saveQuestions(questions) {
        localStorage.setItem('spt_questions', JSON.stringify(questions));
    },

    getQuestions() {
        const questions = localStorage.getItem('spt_questions');
        return questions ? JSON.parse(questions) : {};
    },

    // Quiz Attempts
    saveQuizAttempt(attempt) {
        const attempts = this.getQuizAttempts();
        attempts.push(attempt);
        localStorage.setItem('spt_quiz_attempts', JSON.stringify(attempts));
    },

    getQuizAttempts() {
        const attempts = localStorage.getItem('spt_quiz_attempts');
        return attempts ? JSON.parse(attempts) : [];
    },

    // Companies
    saveCompanies(companies) {
        localStorage.setItem('spt_companies', JSON.stringify(companies));
    },

    getCompanies() {
        const companies = localStorage.getItem('spt_companies');
        return companies ? JSON.parse(companies) : [];
    },

    // Learning Topics
    saveTopics(topics) {
        localStorage.setItem('spt_topics', JSON.stringify(topics));
    },

    getTopics() {
        const topics = localStorage.getItem('spt_topics');
        return topics ? JSON.parse(topics) : {};
    },

    // Resume Checks
    saveResumeCheck(check) {
        localStorage.setItem('spt_resume_check', JSON.stringify(check));
    },

    getResumeCheck() {
        const check = localStorage.getItem('spt_resume_check');
        return check ? JSON.parse(check) : null;
    },

    // ATS Checks
    saveATSCheck(check) {
        localStorage.setItem('spt_ats_check', JSON.stringify(check));
    },

    getATSCheck() {
        const check = localStorage.getItem('spt_ats_check');
        return check ? JSON.parse(check) : null;
    },

    // Interview Questions
    saveInterviewQuestions(questions) {
        localStorage.setItem('spt_interview_questions', JSON.stringify(questions));
    },

    getInterviewQuestions() {
        const questions = localStorage.getItem('spt_interview_questions');
        return questions ? JSON.parse(questions) : {};
    },

    // Interview Sessions
    saveInterviewSession(session) {
        const sessions = this.getInterviewSessions();
        sessions.push(session);
        localStorage.setItem('spt_interview_sessions', JSON.stringify(sessions));
    },

    getInterviewSessions() {
        const sessions = localStorage.getItem('spt_interview_sessions');
        return sessions ? JSON.parse(sessions) : [];
    },

    // Topic Notes (per-learning-topic notes)
    saveTopicNotes(notes) {
        localStorage.setItem('spt_topic_notes', JSON.stringify(notes));
    },

    getTopicNotes() {
        const notes = localStorage.getItem('spt_topic_notes');
        return notes ? JSON.parse(notes) : {};
    },

    // Resources
    saveResources(resources) {
        localStorage.setItem('spt_resources', JSON.stringify(resources));
    },

    getResources() {
        const resources = localStorage.getItem('spt_resources');
        return resources ? JSON.parse(resources) : [];
    },

    // Topic Activities (for streak tracking)
    saveTopicActivities(activities) {
        localStorage.setItem('spt_topic_activities', JSON.stringify(activities));
    },

    getTopicActivities() {
        const activities = localStorage.getItem('spt_topic_activities');
        return activities ? JSON.parse(activities) : [];
    },

    addTopicActivity() {
        const activities = this.getTopicActivities();
        activities.push({ date: new Date().toISOString(), type: 'topic' });
        this.saveTopicActivities(activities);
    },

    // Initialize with sample data if empty
    initializeSampleData() {
        // Force reload interview questions with 5 questions per category
        localStorage.removeItem('spt_interview_questions');
        
        // Initialize questions with 20 items per category
        const questions = this.getQuestions();
        if (!questions || Object.keys(questions).length === 0) {
            const sampleQuestions = {
                'Aptitude': [
                    {
                        id: 1,
                        question: 'What is 25% of 200?',
                        options: ['40', '50', '60', '70'],
                        correct: 1,
                        explanation: '25% of 200 = (25/100) × 200 = 50'
                    },
                    {
                        id: 2,
                        question: 'If a train travels 120 km in 2 hours, what is its speed?',
                        options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
                        correct: 1,
                        explanation: 'Speed = Distance/Time = 120/2 = 60 km/h'
                    },
                    {
                        id: 3,
                        question: 'What is the next number in the sequence: 2, 6, 12, 20, ?',
                        options: ['28', '30', '32', '34'],
                        correct: 1,
                        explanation: 'The pattern is: n(n+1) where n starts from 1. So 5×6 = 30'
                    },
                    {
                        id: 4,
                        question: 'A shopkeeper sells an item for ₹1200 and makes a profit of 20%. What was the cost price?',
                        options: ['₹900', '₹1000', '₹960', '₹1100'],
                        correct: 1,
                        explanation: 'If profit is 20%, SP = 120% of CP. So CP = (1200/120) × 100 = ₹1000'
                    },
                    {
                        id: 5,
                        question: 'If 15 workers can complete a job in 10 days, how many days will 25 workers take?',
                        options: ['6 days', '7 days', '8 days', '9 days'],
                        correct: 0,
                        explanation: 'More workers means less time. 15 × 10 = 25 × x, so x = 6 days'
                    },
                    {
                        id: 6,
                        question: 'What is the average of first 10 natural numbers?',
                        options: ['5', '5.5', '6', '6.5'],
                        correct: 1,
                        explanation: 'Sum = 1+2+...+10 = 55, Average = 55/10 = 5.5'
                    },
                    {
                        id: 7,
                        question: 'A number when divided by 5 leaves remainder 3. What is the remainder when twice the number is divided by 5?',
                        options: ['1', '2', '3', '4'],
                        correct: 0,
                        explanation: 'If n = 5k + 3, then 2n = 10k + 6 = 5(2k+1) + 1. So remainder is 1'
                    },
                    {
                        id: 8,
                        question: 'If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?',
                        options: ['8', '10', '12', '15'],
                        correct: 1,
                        explanation: 'If boys:girls = 3:2, then 3x = 15, so x = 5. Girls = 2x = 10'
                    },
                    {
                        id: 9,
                        question: 'What is the compound interest on ₹10,000 at 10% per annum for 2 years?',
                        options: ['₹2000', '₹2100', '₹2200', '₹2500'],
                        correct: 1,
                        explanation: 'CI = P(1 + r/100)^t - P = 10000(1.1)^2 - 10000 = 12100 - 10000 = ₹2100'
                    },
                    {
                        id: 10,
                        question: 'A car covers 300 km in 5 hours. If it increases its speed by 20 km/h, how long will it take to cover the same distance?',
                        options: ['3 hours', '3.5 hours', '3.75 hours', '4 hours'],
                        correct: 2,
                        explanation: 'Original speed = 300/5 = 60 km/h. New speed = 80 km/h. Time = 300/80 = 3.75 hours'
                    },
                    {
                        id: 11,
                        question: 'If 3x + 5 = 20, what is the value of x?',
                        options: ['3', '4', '5', '6'],
                        correct: 2,
                        explanation: '3x + 5 = 20, so 3x = 15, therefore x = 5'
                    },
                    {
                        id: 12,
                        question: 'What is 15% of 80 plus 20% of 60?',
                        options: ['20', '22', '24', '26'],
                        correct: 2,
                        explanation: '15% of 80 = 12, 20% of 60 = 12. Total = 12 + 12 = 24'
                    },
                    {
                        id: 13,
                        question: 'A pipe can fill a tank in 6 hours. Another pipe can empty it in 8 hours. If both are opened, how long will it take to fill the tank?',
                        options: ['20 hours', '22 hours', '24 hours', '26 hours'],
                        correct: 2,
                        explanation: 'Net rate = 1/6 - 1/8 = 1/24 per hour. Time = 24 hours'
                    },
                    {
                        id: 14,
                        question: 'What is the LCM of 12, 15, and 20?',
                        options: ['60', '80', '100', '120'],
                        correct: 0,
                        explanation: 'LCM(12, 15, 20) = 60 (smallest number divisible by all three)'
                    },
                    {
                        id: 15,
                        question: 'If a:b = 2:3 and b:c = 4:5, what is a:c?',
                        options: ['8:15', '2:5', '6:15', '8:12'],
                        correct: 0,
                        explanation: 'a:b = 2:3 = 8:12, b:c = 4:5 = 12:15. Therefore a:c = 8:15'
                    },
                    {
                        id: 16,
                        question: 'A man buys 5 pens for ₹20 and sells them at ₹5 each. What is his profit percentage?',
                        options: ['20%', '25%', '30%', '35%'],
                        correct: 1,
                        explanation: 'CP = ₹20, SP = ₹25. Profit = 5. Profit% = (5/20) × 100 = 25%'
                    },
                    {
                        id: 17,
                        question: 'What is the area of a circle with radius 7 cm? (Use π = 22/7)',
                        options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'],
                        correct: 1,
                        explanation: 'Area = πr² = (22/7) × 7 × 7 = 154 cm²'
                    },
                    {
                        id: 18,
                        question: 'If 40% of a number is 80, what is the number?',
                        options: ['180', '200', '220', '240'],
                        correct: 1,
                        explanation: '40% of x = 80, so x = (80 × 100)/40 = 200'
                    },
                    {
                        id: 19,
                        question: 'What is the sum of angles in a pentagon?',
                        options: ['360°', '450°', '540°', '630°'],
                        correct: 2,
                        explanation: 'Sum of angles in n-sided polygon = (n-2) × 180°. For pentagon: (5-2) × 180° = 540°'
                    },
                    {
                        id: 20,
                        question: 'A clock shows 3:00. What is the angle between hour and minute hands?',
                        options: ['75°', '90°', '105°', '120°'],
                        correct: 1,
                        explanation: 'At 3:00, hour hand is at 90° from 12, minute hand is at 0°. Angle = 90°'
                    }
                ],
                'Programming': [
                    {
                        id: 1,
                        question: 'What is the time complexity of binary search?',
                        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                        correct: 1,
                        explanation: 'Binary search divides the search space in half at each step, resulting in O(log n) time complexity.'
                    },
                    {
                        id: 2,
                        question: 'Which data structure follows LIFO principle?',
                        options: ['Queue', 'Stack', 'Array', 'Linked List'],
                        correct: 1,
                        explanation: 'Stack follows Last In First Out (LIFO) principle.'
                    },
                    {
                        id: 3,
                        question: 'What does HTML stand for?',
                        options: ['HyperText Markup Language', 'High-level Text Markup Language', 'Hyperlink Text Markup Language', 'Home Tool Markup Language'],
                        correct: 0,
                        explanation: 'HTML stands for HyperText Markup Language.'
                    },
                    {
                        id: 4,
                        question: 'What is the time complexity of quicksort in average case?',
                        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
                        correct: 1,
                        explanation: 'Quicksort has O(n log n) average time complexity, though worst case is O(n²).'
                    },
                    {
                        id: 5,
                        question: 'Which sorting algorithm is stable?',
                        options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
                        correct: 2,
                        explanation: 'Merge Sort is stable as it maintains the relative order of equal elements.'
                    },
                    {
                        id: 6,
                        question: 'What is a hash table collision?',
                        options: ['When two keys map to the same index', 'When hash table is full', 'When key is not found', 'When hash function fails'],
                        correct: 0,
                        explanation: 'A collision occurs when two different keys produce the same hash value and map to the same index.'
                    },
                    {
                        id: 7,
                        question: 'What is the difference between ArrayList and LinkedList?',
                        options: ['ArrayList uses array, LinkedList uses nodes', 'No difference', 'ArrayList is faster for insertion', 'LinkedList uses less memory'],
                        correct: 0,
                        explanation: 'ArrayList uses dynamic array (O(1) access), LinkedList uses nodes with pointers (O(1) insertion at ends).'
                    },
                    {
                        id: 8,
                        question: 'What is polymorphism in OOP?',
                        options: ['Multiple forms of same function', 'Inheritance', 'Encapsulation', 'Abstraction'],
                        correct: 0,
                        explanation: 'Polymorphism allows objects of different types to be accessed through the same interface.'
                    },
                    {
                        id: 9,
                        question: 'What is the purpose of a constructor?',
                        options: ['To destroy objects', 'To initialize objects', 'To call methods', 'To inherit classes'],
                        correct: 1,
                        explanation: 'A constructor initializes an object when it is created.'
                    },
                    {
                        id: 10,
                        question: 'What is recursion?',
                        options: ['A function calling itself', 'A loop', 'A data structure', 'An algorithm'],
                        correct: 0,
                        explanation: 'Recursion is when a function calls itself to solve a problem by breaking it into smaller subproblems.'
                    },
                    {
                        id: 11,
                        question: 'What is the space complexity of merge sort?',
                        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                        correct: 2,
                        explanation: 'Merge sort requires O(n) extra space for the temporary arrays used during merging.'
                    },
                    {
                        id: 12,
                        question: 'Which of the following is NOT a valid variable name in Python?',
                        options: ['_variable', 'variable1', '1variable', 'variable_1'],
                        correct: 2,
                        explanation: 'Variable names cannot start with a number in Python.'
                    },
                    {
                        id: 13,
                        question: 'What does CSS stand for?',
                        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
                        correct: 1,
                        explanation: 'CSS stands for Cascading Style Sheets.'
                    },
                    {
                        id: 14,
                        question: 'What is the output of: print(type([]))?',
                        options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
                        correct: 1,
                        explanation: '[] creates an empty list in Python, so type([]) returns <class \'list\'>.'
                    },
                    {
                        id: 15,
                        question: 'Which data structure is best for implementing a priority queue?',
                        options: ['Array', 'Linked List', 'Heap', 'Stack'],
                        correct: 2,
                        explanation: 'Heap is the most efficient data structure for implementing a priority queue with O(log n) operations.'
                    },
                    {
                        id: 16,
                        question: 'What is the time complexity of accessing an element in an array by index?',
                        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                        correct: 0,
                        explanation: 'Array access by index is O(1) as it uses direct memory addressing.'
                    },
                    {
                        id: 17,
                        question: 'What is a closure in programming?',
                        options: ['A function with no parameters', 'A function that returns another function', 'A function that has access to outer scope variables', 'A function that closes the program'],
                        correct: 2,
                        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.'
                    },
                    {
                        id: 18,
                        question: 'Which of these is a mutable data type in Python?',
                        options: ['Tuple', 'String', 'List', 'Integer'],
                        correct: 2,
                        explanation: 'List is mutable in Python, meaning its contents can be changed after creation.'
                    },
                    {
                        id: 19,
                        question: 'What is the purpose of the "break" statement?',
                        options: ['To pause execution', 'To exit a loop', 'To skip an iteration', 'To restart a loop'],
                        correct: 1,
                        explanation: 'The break statement is used to exit a loop prematurely.'
                    },
                    {
                        id: 20,
                        question: 'What is Big O notation used for?',
                        options: ['Measuring memory usage', 'Describing algorithm efficiency', 'Counting lines of code', 'Debugging programs'],
                        correct: 1,
                        explanation: 'Big O notation describes the upper bound of algorithm time or space complexity as input size grows.'
                    }
                ],
                'Computer Science': [
                    {
                        id: 1,
                        question: 'What is the main purpose of an operating system?',
                        options: ['To manage hardware resources', 'To compile programs', 'To design websites', 'To create databases'],
                        correct: 0,
                        explanation: 'An operating system manages hardware resources and provides services for computer programs.'
                    },
                    {
                        id: 2,
                        question: 'What is the difference between TCP and UDP?',
                        options: ['TCP is connectionless, UDP is connection-oriented', 'TCP is connection-oriented, UDP is connectionless', 'Both are connection-oriented', 'Both are connectionless'],
                        correct: 1,
                        explanation: 'TCP is connection-oriented (reliable), while UDP is connectionless (faster but less reliable).'
                    },
                    {
                        id: 3,
                        question: 'What is a deadlock?',
                        options: ['A process waiting for resources', 'Two or more processes waiting indefinitely', 'A crashed process', 'A terminated process'],
                        correct: 1,
                        explanation: 'Deadlock occurs when two or more processes are blocked, each waiting for a resource held by another.'
                    },
                    {
                        id: 4,
                        question: 'What is the purpose of an index in a database?',
                        options: ['To store data', 'To speed up queries', 'To delete records', 'To update records'],
                        correct: 1,
                        explanation: 'Indexes speed up data retrieval by providing quick access paths to data without scanning entire tables.'
                    },
                    {
                        id: 5,
                        question: 'What is ACID in database transactions?',
                        options: ['Atomicity, Consistency, Isolation, Durability', 'A database type', 'A query language', 'A storage format'],
                        correct: 0,
                        explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.'
                    },
                    {
                        id: 6,
                        question: 'What is the difference between HTTP and HTTPS?',
                        options: ['HTTPS is faster', 'HTTPS uses encryption', 'No difference', 'HTTP is more secure'],
                        correct: 1,
                        explanation: 'HTTPS uses SSL/TLS encryption to secure data transmission, while HTTP sends data in plain text.'
                    },
                    {
                        id: 7,
                        question: 'What is a semaphore?',
                        options: ['A synchronization tool', 'A data structure', 'A network protocol', 'A file system'],
                        correct: 0,
                        explanation: 'A semaphore is a synchronization primitive used to control access to shared resources in concurrent programming.'
                    },
                    {
                        id: 8,
                        question: 'What is virtual memory?',
                        options: ['RAM only', 'Hard disk space used as RAM', 'Cache memory', 'ROM'],
                        correct: 1,
                        explanation: 'Virtual memory uses hard disk space to extend RAM, allowing programs to use more memory than physically available.'
                    },
                    {
                        id: 9,
                        question: 'What is the OSI model?',
                        options: ['A programming language', 'A 7-layer network model', 'An operating system', 'A database model'],
                        correct: 1,
                        explanation: 'OSI (Open Systems Interconnection) is a 7-layer model that describes network communication.'
                    },
                    {
                        id: 10,
                        question: 'What is normalization in databases?',
                        options: ['Making data faster', 'Organizing data to reduce redundancy', 'Encrypting data', 'Backing up data'],
                        correct: 1,
                        explanation: 'Normalization organizes database tables to minimize redundancy and dependency.'
                    },
                    {
                        id: 11,
                        question: 'What is the purpose of DNS?',
                        options: ['To encrypt data', 'To translate domain names to IP addresses', 'To store files', 'To send emails'],
                        correct: 1,
                        explanation: 'DNS (Domain Name System) translates human-readable domain names into IP addresses.'
                    },
                    {
                        id: 12,
                        question: 'What is a primary key in a database?',
                        options: ['A password', 'A unique identifier for records', 'An encryption key', 'A backup key'],
                        correct: 1,
                        explanation: 'A primary key uniquely identifies each record in a database table.'
                    },
                    {
                        id: 13,
                        question: 'What is the difference between compiler and interpreter?',
                        options: ['No difference', 'Compiler translates all at once, interpreter line by line', 'Interpreter is faster', 'Compiler runs code'],
                        correct: 1,
                        explanation: 'A compiler translates entire program at once, while an interpreter translates and executes line by line.'
                    },
                    {
                        id: 14,
                        question: 'What is cache memory?',
                        options: ['Permanent storage', 'Fast temporary storage between CPU and RAM', 'Hard disk space', 'Virtual memory'],
                        correct: 1,
                        explanation: 'Cache is high-speed memory that stores frequently accessed data for faster CPU access.'
                    },
                    {
                        id: 15,
                        question: 'What is a firewall?',
                        options: ['A virus', 'A security system that monitors network traffic', 'A backup system', 'A programming tool'],
                        correct: 1,
                        explanation: 'A firewall is a security system that monitors and controls incoming and outgoing network traffic.'
                    },
                    {
                        id: 16,
                        question: 'What is the purpose of an API?',
                        options: ['To design websites', 'To allow software components to communicate', 'To store data', 'To compile code'],
                        correct: 1,
                        explanation: 'API (Application Programming Interface) allows different software components to communicate with each other.'
                    },
                    {
                        id: 17,
                        question: 'What is cloud computing?',
                        options: ['Weather prediction', 'Delivering computing services over the internet', 'A type of software', 'A programming language'],
                        correct: 1,
                        explanation: 'Cloud computing delivers computing services (servers, storage, databases) over the internet.'
                    },
                    {
                        id: 18,
                        question: 'What is the difference between IPv4 and IPv6?',
                        options: ['No difference', 'IPv6 has more addresses', 'IPv4 is faster', 'IPv6 is older'],
                        correct: 1,
                        explanation: 'IPv6 uses 128-bit addresses (vs 32-bit in IPv4), providing vastly more available IP addresses.'
                    },
                    {
                        id: 19,
                        question: 'What is a thread in operating systems?',
                        options: ['A type of virus', 'The smallest unit of execution', 'A network cable', 'A storage device'],
                        correct: 1,
                        explanation: 'A thread is the smallest unit of execution within a process, allowing concurrent operations.'
                    },
                    {
                        id: 20,
                        question: 'What is SQL injection?',
                        options: ['A database feature', 'A security vulnerability', 'A query optimization', 'A backup method'],
                        correct: 1,
                        explanation: 'SQL injection is a security vulnerability where malicious SQL code is inserted into application queries.'
                    }
                ],
                'Soft Skills': [
                    {
                        id: 1,
                        question: 'What is the most important aspect of effective communication?',
                        options: ['Speaking clearly', 'Active listening', 'Using technical terms', 'Speaking quickly'],
                        correct: 1,
                        explanation: 'Active listening is crucial for understanding and responding appropriately in communication.'
                    },
                    {
                        id: 2,
                        question: 'How should you handle conflicts in a team?',
                        options: ['Avoid them', 'Address them directly and professionally', 'Blame others', 'Ignore them'],
                        correct: 1,
                        explanation: 'Conflicts should be addressed directly and professionally to find constructive solutions.'
                    },
                    {
                        id: 3,
                        question: 'What is the STAR method used for?',
                        options: ['Coding interviews', 'Answering behavioral questions', 'System design', 'Debugging'],
                        correct: 1,
                        explanation: 'STAR (Situation, Task, Action, Result) method helps structure answers to behavioral interview questions.'
                    },
                    {
                        id: 4,
                        question: 'What is the most important quality in a team member?',
                        options: ['Technical skills only', 'Communication and collaboration', 'Working alone', 'Avoiding mistakes'],
                        correct: 1,
                        explanation: 'While technical skills are important, communication and collaboration are crucial for team success.'
                    },
                    {
                        id: 5,
                        question: 'How do you handle tight deadlines?',
                        options: ['Panic', 'Prioritize tasks and communicate', 'Work alone', 'Ignore the deadline'],
                        correct: 1,
                        explanation: 'Effective deadline management involves prioritization, clear communication, and efficient task execution.'
                    },
                    {
                        id: 6,
                        question: 'What is emotional intelligence?',
                        options: ['Only technical skills', 'Understanding and managing emotions', 'Avoiding emotions', 'Being emotional'],
                        correct: 1,
                        explanation: 'Emotional intelligence is the ability to understand, use, and manage emotions effectively in interpersonal situations.'
                    },
                    {
                        id: 7,
                        question: 'What is the best way to give constructive feedback?',
                        options: ['Criticize publicly', 'Be specific and focus on behavior', 'Only point out negatives', 'Avoid giving feedback'],
                        correct: 1,
                        explanation: 'Constructive feedback should be specific, focus on behavior not personality, and include actionable suggestions.'
                    },
                    {
                        id: 8,
                        question: 'How do you demonstrate leadership?',
                        options: ['By being bossy', 'By taking initiative and inspiring others', 'By working alone', 'By avoiding responsibility'],
                        correct: 1,
                        explanation: 'Leadership involves taking initiative, inspiring others, and taking responsibility for outcomes.'
                    },
                    {
                        id: 9,
                        question: 'What is the key to effective time management?',
                        options: ['Working longer hours', 'Prioritizing tasks and setting goals', 'Multitasking everything', 'Avoiding breaks'],
                        correct: 1,
                        explanation: 'Effective time management involves prioritizing tasks, setting clear goals, and managing energy levels.'
                    },
                    {
                        id: 10,
                        question: 'How should you handle criticism?',
                        options: ['Get defensive', 'Listen, reflect, and learn', 'Ignore it', 'Blame others'],
                        correct: 1,
                        explanation: 'Handling criticism well involves listening without defensiveness, reflecting on feedback, and using it for growth.'
                    },
                    {
                        id: 11,
                        question: 'What is adaptability in the workplace?',
                        options: ['Never changing', 'Being flexible and open to change', 'Resisting new ideas', 'Following only old methods'],
                        correct: 1,
                        explanation: 'Adaptability is the ability to adjust to new conditions, learn new skills, and embrace change.'
                    },
                    {
                        id: 12,
                        question: 'How do you build trust in a team?',
                        options: ['By being secretive', 'Through consistency and reliability', 'By competing with teammates', 'By taking all credit'],
                        correct: 1,
                        explanation: 'Trust is built through consistent behavior, reliability, transparency, and following through on commitments.'
                    },
                    {
                        id: 13,
                        question: 'What is the best approach to problem-solving?',
                        options: ['Guess randomly', 'Analyze, plan, execute, review', 'Blame others', 'Avoid the problem'],
                        correct: 1,
                        explanation: 'Effective problem-solving involves analyzing the situation, planning solutions, executing, and reviewing results.'
                    },
                    {
                        id: 14,
                        question: 'How do you handle stress at work?',
                        options: ['Ignore it', 'Use healthy coping strategies and seek support', 'Panic', 'Quit immediately'],
                        correct: 1,
                        explanation: 'Managing stress involves using healthy coping strategies, maintaining work-life balance, and seeking support when needed.'
                    },
                    {
                        id: 15,
                        question: 'What is professional networking?',
                        options: ['Collecting business cards', 'Building meaningful professional relationships', 'Only online connections', 'Avoiding people'],
                        correct: 1,
                        explanation: 'Professional networking is about building genuine, mutually beneficial relationships in your field.'
                    },
                    {
                        id: 16,
                        question: 'How do you show initiative at work?',
                        options: ['Wait for instructions', 'Identify problems and propose solutions', 'Do minimum work', 'Avoid new tasks'],
                        correct: 1,
                        explanation: 'Showing initiative means proactively identifying opportunities, proposing solutions, and taking action.'
                    },
                    {
                        id: 17,
                        question: 'What is cultural sensitivity?',
                        options: ['Ignoring differences', 'Respecting and valuing diverse perspectives', 'Imposing your views', 'Avoiding diversity'],
                        correct: 1,
                        explanation: 'Cultural sensitivity involves respecting, understanding, and valuing different cultural perspectives and practices.'
                    },
                    {
                        id: 18,
                        question: 'How do you maintain work-life balance?',
                        options: ['Work 24/7', 'Set boundaries and prioritize wellbeing', 'Never take breaks', 'Ignore personal life'],
                        correct: 1,
                        explanation: 'Work-life balance involves setting boundaries, prioritizing health and relationships, and managing time effectively.'
                    },
                    {
                        id: 19,
                        question: 'What is the importance of continuous learning?',
                        options: ['Not important', 'Keeps skills relevant and promotes growth', 'Only for students', 'Waste of time'],
                        correct: 1,
                        explanation: 'Continuous learning keeps skills current, promotes career growth, and helps adapt to changing environments.'
                    },
                    {
                        id: 20,
                        question: 'How do you demonstrate professionalism?',
                        options: ['Being casual always', 'Maintaining ethics, reliability, and respect', 'Ignoring deadlines', 'Gossiping'],
                        correct: 1,
                        explanation: 'Professionalism involves maintaining ethical standards, being reliable, respectful, and accountable.'
                    }
                ]
            };
            this.saveQuestions(sampleQuestions);
        }

        // Initialize companies if empty
        if (this.getCompanies().length === 0) {
            const sampleCompanies = [
                {
                    id: 1,
                    name: 'Google',
                    role: 'Software Engineer',
                    criteria: 'CS/IT, 7+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Test',
                            description: 'Coding and problem-solving assessment',
                            preparation: [
                                'Practice data structures and algorithms',
                                'Solve problems on LeetCode and Codeforces',
                                'Focus on time complexity optimization'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Deep dive into CS fundamentals and coding',
                            preparation: [
                                'Review system design basics',
                                'Practice explaining your thought process',
                                'Prepare for behavioral questions'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'HR Interview',
                            description: 'Cultural fit and final assessment',
                            preparation: [
                                'Research Google\'s culture and values',
                                'Prepare STAR method examples',
                                'Ask thoughtful questions about the role'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Microsoft',
                    role: 'Software Development Engineer',
                    criteria: 'CS/IT/ECE, 7.5+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Assessment',
                            description: 'Coding challenges and MCQs',
                            preparation: [
                                'Practice array and string manipulation',
                                'Review OOP concepts',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Rounds',
                            description: 'Multiple technical interviews',
                            preparation: [
                                'System design preparation',
                                'Database concepts review',
                                'Cloud computing basics'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'Amazon',
                    role: 'SDE Intern/Full-time',
                    criteria: 'All branches, 7+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Test',
                            description: 'Coding and debugging questions',
                            preparation: [
                                'Practice Amazon tagged questions',
                                'Focus on arrays, trees, and graphs',
                                'Practice debugging skills'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Problem-solving and coding',
                            preparation: [
                                'Review Amazon Leadership Principles',
                                'Practice explaining solutions clearly',
                                'Prepare for follow-up questions'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 4,
                    name: 'Meta (Facebook)',
                    role: 'Software Engineer',
                    criteria: 'CS/IT, 8+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Phone Screen',
                            description: 'Initial technical screening',
                            preparation: [
                                'Practice coding problems on LeetCode',
                                'Focus on arrays, strings, and trees',
                                'Prepare for system design basics'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Onsite Rounds',
                            description: 'Multiple technical and system design interviews',
                            preparation: [
                                'Deep dive into system design',
                                'Practice coding on whiteboard',
                                'Review Meta\'s tech stack and culture'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 5,
                    name: 'Apple',
                    role: 'Software Engineer',
                    criteria: 'CS/IT/ECE, 7.5+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Technical Screen',
                            description: 'Coding and problem-solving',
                            preparation: [
                                'Practice algorithm problems',
                                'Review iOS/macOS development basics',
                                'Focus on clean code principles'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Onsite Interview',
                            description: 'Technical and cultural fit assessment',
                            preparation: [
                                'Understand Apple\'s design philosophy',
                                'Practice system design',
                                'Prepare behavioral questions'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 6,
                    name: 'Netflix',
                    role: 'Software Engineer',
                    criteria: 'CS/IT, 8+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Technical Phone Screen',
                            description: 'Coding assessment',
                            preparation: [
                                'Practice distributed systems concepts',
                                'Review scalability patterns',
                                'Focus on clean code and testing'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Onsite Loop',
                            description: 'Multiple rounds including system design',
                            preparation: [
                                'Deep system design preparation',
                                'Review Netflix engineering blog',
                                'Practice explaining trade-offs'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 7,
                    name: 'Adobe',
                    role: 'Software Development Engineer',
                    criteria: 'CS/IT, 7+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Assessment',
                            description: 'Coding and technical MCQs',
                            preparation: [
                                'Practice data structures',
                                'Review OOP concepts',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Problem-solving and coding',
                            preparation: [
                                'Practice array and string problems',
                                'Review design patterns',
                                'Prepare for follow-up questions'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'HR Round',
                            description: 'Cultural fit and final assessment',
                            preparation: [
                                'Research Adobe\'s values',
                                'Prepare STAR method examples',
                                'Ask thoughtful questions'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 8,
                    name: 'Oracle',
                    role: 'Software Engineer',
                    criteria: 'CS/IT/ECE, 7+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Test',
                            description: 'Technical and aptitude assessment',
                            preparation: [
                                'Practice database concepts',
                                'Review SQL queries',
                                'Focus on Java and OOP'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Database and programming questions',
                            preparation: [
                                'Deep dive into database systems',
                                'Practice SQL optimization',
                                'Review Java fundamentals'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 9,
                    name: 'Goldman Sachs',
                    role: 'Software Engineer',
                    criteria: 'CS/IT/ECE, 8+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'HackerRank Test',
                            description: 'Coding and problem-solving',
                            preparation: [
                                'Practice competitive programming',
                                'Focus on algorithms and data structures',
                                'Time management is crucial'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Coding and system design',
                            preparation: [
                                'Practice low-level system design',
                                'Review financial systems basics',
                                'Prepare for behavioral questions'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Superday',
                            description: 'Multiple rounds in one day',
                            preparation: [
                                'Prepare for marathon interviews',
                                'Review all technical concepts',
                                'Practice clear communication'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 10,
                    name: 'Flipkart',
                    role: 'SDE',
                    criteria: 'CS/IT, 7+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Coding Test',
                            description: 'Data structures and algorithms',
                            preparation: [
                                'Practice Flipkart tagged questions',
                                'Focus on trees, graphs, and DP',
                                'Time complexity optimization'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Rounds',
                            description: 'Coding and system design',
                            preparation: [
                                'Practice system design for scale',
                                'Review e-commerce domain',
                                'Prepare for follow-up questions'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'HR Round',
                            description: 'Final assessment',
                            preparation: [
                                'Research Flipkart\'s culture',
                                'Prepare behavioral examples',
                                'Show enthusiasm for e-commerce'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 11,
                    name: 'Wipro',
                    role: 'Project Engineer / Software Engineer',
                    criteria: 'All branches, 6+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Aptitude Test',
                            description: 'Quantitative, Logical Reasoning, Verbal Ability',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning puzzles',
                                'Improve verbal ability and comprehension',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Coding Test',
                            description: 'Basic programming and problem-solving',
                            preparation: [
                                'Practice basic data structures',
                                'Focus on arrays, strings, and loops',
                                'Review programming fundamentals',
                                'Practice on HackerRank or similar platforms'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Technical Interview',
                            description: 'Programming concepts and problem-solving',
                            preparation: [
                                'Review OOP concepts',
                                'Prepare for basic coding questions',
                                'Know your projects well',
                                'Practice explaining code clearly'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Behavioral and cultural fit assessment',
                            preparation: [
                                'Research Wipro\'s values and culture',
                                'Prepare STAR method examples',
                                'Be ready to discuss relocation willingness',
                                'Show enthusiasm for learning and growth'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 12,
                    name: 'IBM',
                    role: 'Associate System Engineer / Software Developer',
                    criteria: 'CS/IT/ECE, 7+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Cognitive Ability Assessment',
                            description: 'Aptitude and logical reasoning test',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning problems',
                                'Improve data interpretation skills',
                                'Time management is crucial'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Coding Assessment',
                            description: 'Programming and problem-solving',
                            preparation: [
                                'Practice data structures and algorithms',
                                'Focus on arrays, strings, and basic algorithms',
                                'Review programming fundamentals',
                                'Practice on coding platforms'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Technical Interview',
                            description: 'Deep dive into technical skills',
                            preparation: [
                                'Review core programming concepts',
                                'Prepare for system design basics',
                                'Know your projects in detail',
                                'Be ready for database questions',
                                'Practice explaining technical concepts'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Behavioral and cultural assessment',
                            preparation: [
                                'Research IBM\'s history and values',
                                'Prepare examples using STAR method',
                                'Show interest in IBM\'s technologies',
                                'Demonstrate learning agility'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 13,
                    name: 'TCS (Tata Consultancy Services)',
                    role: 'System Engineer / Trainee',
                    criteria: 'All branches, 6+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'TCS NQT (National Qualifier Test)',
                            description: 'Aptitude, Programming, and Verbal Ability',
                            preparation: [
                                'Practice TCS NQT previous papers',
                                'Focus on quantitative aptitude',
                                'Improve programming logic',
                                'Practice verbal ability questions'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Programming and technical concepts',
                            preparation: [
                                'Review basic programming concepts',
                                'Prepare for OOP questions',
                                'Know your projects thoroughly',
                                'Practice coding on paper/whiteboard'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Managerial Interview',
                            description: 'Technical depth and problem-solving approach',
                            preparation: [
                                'Be ready for deeper technical questions',
                                'Prepare for scenario-based questions',
                                'Show problem-solving approach',
                                'Demonstrate communication skills'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Final assessment and cultural fit',
                            preparation: [
                                'Research TCS values and culture',
                                'Prepare behavioral examples',
                                'Show willingness to learn and adapt',
                                'Be ready for location preferences'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 14,
                    name: 'Infosys',
                    role: 'System Engineer / Specialist Programmer',
                    criteria: 'All branches, 6+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Infosys Online Test',
                            description: 'Aptitude, Logical Reasoning, and Pseudo Code',
                            preparation: [
                                'Practice Infosys previous papers',
                                'Focus on pseudo code questions',
                                'Improve logical reasoning',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Programming and problem-solving',
                            preparation: [
                                'Review programming fundamentals',
                                'Practice basic data structures',
                                'Know your projects well',
                                'Prepare for OOP concepts'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'HR Interview',
                            description: 'Behavioral and final assessment',
                            preparation: [
                                'Research Infosys culture and values',
                                'Prepare STAR method examples',
                                'Show enthusiasm for technology',
                                'Be ready for location discussions'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 15,
                    name: 'Accenture',
                    role: 'Associate Software Engineer / Application Developer',
                    criteria: 'All branches, 6.5+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Cognitive and Technical Assessment',
                            description: 'Aptitude, Logical Reasoning, and Coding',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning puzzles',
                                'Review basic programming',
                                'Time management is key'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Communication Assessment',
                            description: 'English communication and comprehension',
                            preparation: [
                                'Improve English speaking skills',
                                'Practice reading comprehension',
                                'Work on pronunciation',
                                'Practice common interview phrases'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Technical Interview',
                            description: 'Programming and technical skills',
                            preparation: [
                                'Review programming concepts',
                                'Prepare for basic coding questions',
                                'Know your projects in detail',
                                'Practice explaining solutions'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Behavioral and cultural fit',
                            preparation: [
                                'Research Accenture\'s values',
                                'Prepare behavioral examples',
                                'Show adaptability and learning mindset',
                                'Demonstrate communication skills'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 16,
                    name: 'Cognizant',
                    role: 'Programmer Analyst / Software Engineer',
                    criteria: 'All branches, 6+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Aptitude Test',
                            description: 'Quantitative, Logical, and Verbal',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning problems',
                                'Improve verbal ability',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Coding Test',
                            description: 'Basic programming and problem-solving',
                            preparation: [
                                'Practice basic data structures',
                                'Focus on arrays and strings',
                                'Review programming fundamentals',
                                'Practice on coding platforms'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Technical Interview',
                            description: 'Programming concepts and projects',
                            preparation: [
                                'Review OOP and programming basics',
                                'Know your projects thoroughly',
                                'Prepare for database questions',
                                'Practice explaining code'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Final behavioral assessment',
                            preparation: [
                                'Research Cognizant\'s culture',
                                'Prepare STAR method examples',
                                'Show willingness to learn',
                                'Be ready for location preferences'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 17,
                    name: 'Capgemini',
                    role: 'Software Engineer / Analyst',
                    criteria: 'All branches, 6+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Assessment',
                            description: 'Aptitude, Logical Reasoning, and Coding',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning puzzles',
                                'Review basic programming',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Programming and technical concepts',
                            preparation: [
                                'Review programming fundamentals',
                                'Prepare for OOP questions',
                                'Know your projects well',
                                'Practice coding problems'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'HR Interview',
                            description: 'Behavioral and cultural fit',
                            preparation: [
                                'Research Capgemini\'s values',
                                'Prepare behavioral examples',
                                'Show enthusiasm for technology',
                                'Demonstrate communication skills'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 18,
                    name: 'HCL',
                    role: 'Software Engineer / Trainee',
                    criteria: 'CS/IT/ECE, 6.5+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Aptitude Test',
                            description: 'Quantitative, Logical, and Verbal',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning problems',
                                'Improve verbal ability',
                                'Time management is crucial'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Coding Test',
                            description: 'Programming and problem-solving',
                            preparation: [
                                'Practice data structures',
                                'Focus on arrays, strings, and basic algorithms',
                                'Review programming fundamentals',
                                'Practice on coding platforms'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Technical Interview',
                            description: 'Deep technical assessment',
                            preparation: [
                                'Review core programming concepts',
                                'Know your projects in detail',
                                'Prepare for database questions',
                                'Practice explaining technical solutions'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Final behavioral assessment',
                            preparation: [
                                'Research HCL\'s culture and values',
                                'Prepare STAR method examples',
                                'Show learning agility',
                                'Be ready for location discussions'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 19,
                    name: 'Tech Mahindra',
                    role: 'Associate Software Engineer',
                    criteria: 'All branches, 6+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Aptitude Test',
                            description: 'Quantitative, Logical Reasoning, and English',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning puzzles',
                                'Improve English comprehension',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Coding Test',
                            description: 'Basic programming and problem-solving',
                            preparation: [
                                'Practice basic data structures',
                                'Focus on arrays and strings',
                                'Review programming fundamentals',
                                'Practice coding problems'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'Technical Interview',
                            description: 'Programming and technical skills',
                            preparation: [
                                'Review OOP concepts',
                                'Know your projects thoroughly',
                                'Prepare for basic coding questions',
                                'Practice explaining solutions'
                            ],
                            prepared: false
                        },
                        {
                            id: 4,
                            name: 'HR Interview',
                            description: 'Behavioral and final assessment',
                            preparation: [
                                'Research Tech Mahindra\'s culture',
                                'Prepare behavioral examples',
                                'Show enthusiasm for technology',
                                'Demonstrate communication skills'
                            ],
                            prepared: false
                        }
                    ]
                },
                {
                    id: 20,
                    name: 'Mindtree',
                    role: 'Software Engineer / Trainee',
                    criteria: 'CS/IT/ECE, 6.5+ CGPA, 2024/2025',
                    rounds: [
                        {
                            id: 1,
                            name: 'Online Assessment',
                            description: 'Aptitude, Logical Reasoning, and Coding',
                            preparation: [
                                'Practice quantitative aptitude',
                                'Solve logical reasoning problems',
                                'Review basic programming',
                                'Time management practice'
                            ],
                            prepared: false
                        },
                        {
                            id: 2,
                            name: 'Technical Interview',
                            description: 'Programming and problem-solving',
                            preparation: [
                                'Review programming fundamentals',
                                'Prepare for OOP questions',
                                'Know your projects well',
                                'Practice coding on whiteboard'
                            ],
                            prepared: false
                        },
                        {
                            id: 3,
                            name: 'HR Interview',
                            description: 'Behavioral and cultural fit',
                            preparation: [
                                'Research Mindtree\'s values',
                                'Prepare STAR method examples',
                                'Show learning mindset',
                                'Demonstrate communication skills'
                            ],
                            prepared: false
                        }
                    ]
                }
            ];
            this.saveCompanies(sampleCompanies);
        }

        // Initialize learning topics if empty
        const topics = this.getTopics();
        if (!topics || Object.keys(topics).length === 0) {
            const sampleTopics = {
                'Aptitude': [
                    { id: 1, name: 'Quantitative Aptitude', completed: false },
                    { id: 2, name: 'Logical Reasoning', completed: false },
                    { id: 3, name: 'Verbal Ability', completed: false },
                    { id: 4, name: 'Data Interpretation', completed: false },
                    { id: 5, name: 'Number Systems', completed: false },
                    { id: 6, name: 'Percentages and Profit & Loss', completed: false },
                    { id: 7, name: 'Time, Speed and Distance', completed: false },
                    { id: 8, name: 'Time and Work', completed: false },
                    { id: 9, name: 'Permutations and Combinations', completed: false },
                    { id: 10, name: 'Probability', completed: false }
                ],
                'Programming': [
                    { id: 1, name: 'Data Structures', completed: false },
                    { id: 2, name: 'Algorithms', completed: false },
                    { id: 3, name: 'Object-Oriented Programming', completed: false },
                    { id: 4, name: 'Database Management', completed: false },
                    { id: 5, name: 'System Design Basics', completed: false },
                    { id: 6, name: 'Arrays and Strings', completed: false },
                    { id: 7, name: 'Linked Lists', completed: false },
                    { id: 8, name: 'Trees and Binary Trees', completed: false },
                    { id: 9, name: 'Graphs and Graph Algorithms', completed: false },
                    { id: 10, name: 'Dynamic Programming', completed: false },
                    { id: 11, name: 'Greedy Algorithms', completed: false },
                    { id: 12, name: 'Sorting and Searching', completed: false },
                    { id: 13, name: 'Hash Tables and Hashing', completed: false },
                    { id: 14, name: 'Stacks and Queues', completed: false },
                    { id: 15, name: 'Heaps and Priority Queues', completed: false }
                ],
                'Computer Science': [
                    { id: 1, name: 'Operating Systems', completed: false },
                    { id: 2, name: 'Computer Networks', completed: false },
                    { id: 3, name: 'Database Systems', completed: false },
                    { id: 4, name: 'Software Engineering', completed: false },
                    { id: 5, name: 'Process Management', completed: false },
                    { id: 6, name: 'Memory Management', completed: false },
                    { id: 7, name: 'File Systems', completed: false },
                    { id: 8, name: 'Concurrency and Threading', completed: false },
                    { id: 9, name: 'TCP/IP Protocol Suite', completed: false },
                    { id: 10, name: 'HTTP and REST APIs', completed: false },
                    { id: 11, name: 'SQL and Database Queries', completed: false },
                    { id: 12, name: 'Normalization and Database Design', completed: false },
                    { id: 13, name: 'Design Patterns', completed: false },
                    { id: 14, name: 'Software Testing', completed: false },
                    { id: 15, name: 'Version Control (Git)', completed: false }
                ],
                'Soft Skills': [
                    { id: 1, name: 'Communication Skills', completed: false },
                    { id: 2, name: 'Teamwork', completed: false },
                    { id: 3, name: 'Problem Solving', completed: false },
                    { id: 4, name: 'Leadership', completed: false },
                    { id: 5, name: 'Time Management', completed: false },
                    { id: 6, name: 'Conflict Resolution', completed: false },
                    { id: 7, name: 'Presentation Skills', completed: false },
                    { id: 8, name: 'Emotional Intelligence', completed: false },
                    { id: 9, name: 'Adaptability', completed: false },
                    { id: 10, name: 'Critical Thinking', completed: false },
                    { id: 11, name: 'Active Listening', completed: false },
                    { id: 12, name: 'Negotiation Skills', completed: false }
                ]
            };
            this.saveTopics(sampleTopics);
        }

        // Initialize interview questions if empty
        const interviewQuestions = this.getInterviewQuestions();
        if (!interviewQuestions || Object.keys(interviewQuestions).length === 0) {
            const sampleInterviewQuestions = {
                'Technical': [
                    {
                        id: 1,
                        question: 'Explain the difference between stack and queue data structures.',
                        sampleAnswer: 'A stack is a LIFO (Last In First Out) data structure where elements are added and removed from the same end (top). Operations include push (add) and pop (remove). A queue is a FIFO (First In First Out) data structure where elements are added at the rear and removed from the front. Operations include enqueue (add) and dequeue (remove). Stacks are used in function calls, expression evaluation, and undo operations. Queues are used in task scheduling, BFS algorithms, and message processing.',
                        keywords: ['stack', 'queue', 'LIFO', 'FIFO', 'push', 'pop', 'enqueue', 'dequeue', 'data structures', 'operations', 'function calls', 'BFS', 'scheduling'],
                        tips: [
                            'Start with the basic definition of each data structure',
                            'Explain the key difference (LIFO vs FIFO)',
                            'Mention common operations for each',
                            'Provide real-world use cases'
                        ]
                    },
                    {
                        id: 2,
                        question: 'What is the time complexity of binary search and why?',
                        sampleAnswer: 'Binary search has O(log n) time complexity. This is because at each step, we eliminate half of the remaining elements. For an array of size n, we need at most log₂(n) comparisons to find the target element. The search space is divided in half repeatedly: n → n/2 → n/4 → ... → 1, which takes log₂(n) steps.',
                        keywords: ['binary search', 'time complexity', 'O(log n)', 'logarithmic', 'sorted array', 'divide and conquer', 'search algorithm', 'comparisons', 'efficiency'],
                        tips: [
                            'Explain the algorithm briefly',
                            'Describe why it\'s logarithmic',
                            'Compare with linear search O(n)',
                            'Mention the prerequisite: sorted array'
                        ]
                    },
                    {
                        id: 3,
                        question: 'Explain object-oriented programming principles.',
                        sampleAnswer: 'OOP has four main principles: 1) Encapsulation - bundling data and methods together, hiding internal details. 2) Inheritance - creating new classes based on existing ones, promoting code reuse. 3) Polymorphism - same interface, different implementations. 4) Abstraction - hiding complex implementation details, showing only essential features. These principles help create modular, maintainable, and scalable code.',
                        keywords: ['OOP', 'encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'classes', 'objects', 'methods', 'code reuse', 'modularity', 'maintainability'],
                        tips: [
                            'List all four principles',
                            'Provide a brief definition for each',
                            'Give examples if possible',
                            'Explain the benefits'
                        ]
                    },
                    {
                        id: 4,
                        question: 'What is the difference between SQL and NoSQL databases?',
                        sampleAnswer: 'SQL databases are relational, use structured schemas, and support ACID transactions. They use SQL for queries and are vertically scalable. Examples: MySQL, PostgreSQL. NoSQL databases are non-relational, have flexible schemas, and prioritize scalability. They are horizontally scalable and use various data models (document, key-value, graph). Examples: MongoDB, Redis, Cassandra. Choose SQL for complex queries and transactions, NoSQL for high scalability and flexible data.',
                        keywords: ['SQL', 'NoSQL', 'relational', 'non-relational', 'ACID', 'BASE', 'schema', 'scalability', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'transactions', 'queries'],
                        tips: [
                            'Compare structure and schema',
                            'Discuss scalability differences',
                            'Mention ACID vs BASE',
                            'Provide use cases for each'
                        ]
                    },
                    {
                        id: 5,
                        question: 'Explain the concept of RESTful APIs.',
                        sampleAnswer: 'REST (Representational State Transfer) is an architectural style for web services. Key principles: 1) Stateless - each request contains all needed information. 2) Client-Server separation. 3) Cacheable responses. 4) Uniform interface using HTTP methods (GET, POST, PUT, DELETE). 5) Layered system. RESTful APIs use standard HTTP status codes, are resource-based with URIs, and typically return JSON. They are simple, scalable, and widely adopted.',
                        keywords: ['REST', 'API', 'HTTP methods', 'GET', 'POST', 'PUT', 'DELETE', 'stateless', 'JSON', 'URI', 'status codes', 'web services', 'client-server', 'cacheable'],
                        tips: [
                            'Define REST principles',
                            'Explain HTTP methods',
                            'Mention status codes',
                            'Discuss advantages'
                        ]
                    }
                ],
                'HR/Behavioral': [
                    {
                        id: 1,
                        question: 'Tell me about yourself.',
                        sampleAnswer: 'I am a [Year] year [Branch] student at [University] with a strong passion for software development. I have experience in [technologies] through my projects and internships. I enjoy solving complex problems and have worked on [specific project]. I am particularly interested in [area] and am excited about the opportunity to contribute to [Company Name].',
                        keywords: ['introduction', 'background', 'education', 'experience', 'skills', 'projects', 'internships', 'passion', 'interests', 'career goals', 'self-presentation'],
                        tips: [
                            'Keep it concise (2-3 minutes)',
                            'Start with current status (student/year)',
                            'Highlight relevant experience and skills',
                            'Connect your background to the role',
                            'End with why you\'re interested in this position'
                        ]
                    },
                    {
                        id: 2,
                        question: 'Describe a challenging project you worked on and how you overcame obstacles.',
                        sampleAnswer: 'I worked on [Project Name] where we had to [challenge]. Initially, we faced [specific obstacle]. To overcome this, I [action taken - research, collaboration, breaking down the problem]. I learned [technical skill/soft skill] and the project resulted in [outcome/achievement]. This experience taught me the importance of [lesson learned].',
                        keywords: ['STAR method', 'challenges', 'problem-solving', 'obstacles', 'teamwork', 'collaboration', 'research', 'learning', 'achievement', 'resilience', 'project management'],
                        tips: [
                            'Use the STAR method (Situation, Task, Action, Result)',
                            'Be specific about the challenge',
                            'Focus on your actions and contributions',
                            'Quantify results if possible',
                            'Show what you learned'
                        ]
                    },
                    {
                        id: 3,
                        question: 'Why do you want to work at our company?',
                        sampleAnswer: 'I am drawn to [Company Name] because of [specific reason - innovation, culture, products, mission]. I particularly admire [specific aspect - technology, approach, values]. Your work in [area] aligns with my interests in [your interest]. I believe my skills in [your skills] would allow me to contribute to [specific team/project], and I\'m excited about the opportunity to grow and learn in this environment.',
                        keywords: ['company research', 'motivation', 'culture fit', 'values', 'mission', 'innovation', 'growth', 'contribution', 'alignment', 'career goals', 'enthusiasm'],
                        tips: [
                            'Research the company beforehand',
                            'Be specific, not generic',
                            'Connect company values to your own',
                            'Show genuine interest',
                            'Mention how you can contribute'
                        ]
                    },
                    {
                        id: 4,
                        question: 'What are your greatest strengths?',
                        sampleAnswer: 'My greatest strengths are problem-solving and adaptability. I excel at breaking down complex problems into manageable parts. For example, in [project], I [specific example]. I\'m also highly adaptable - I quickly learn new technologies and adjust to changing requirements. These strengths have helped me [achievement] and I believe they would be valuable in this role.',
                        keywords: ['strengths', 'problem-solving', 'adaptability', 'skills', 'examples', 'achievements', 'value proposition', 'self-awareness', 'confidence', 'learning agility'],
                        tips: [
                            'Choose 2-3 relevant strengths',
                            'Provide specific examples',
                            'Connect to the job requirements',
                            'Be genuine and confident',
                            'Show how they add value'
                        ]
                    },
                    {
                        id: 5,
                        question: 'Describe a time when you had a conflict with a team member.',
                        sampleAnswer: 'During [project], my teammate and I disagreed on [issue]. I initiated a private conversation to understand their perspective. I listened actively and realized they had valid concerns about [aspect]. We found a compromise by [solution] that incorporated both our ideas. This improved our working relationship and the project outcome. I learned the importance of open communication and considering different viewpoints.',
                        keywords: ['conflict resolution', 'teamwork', 'communication', 'active listening', 'compromise', 'collaboration', 'empathy', 'perspective', 'relationship building', 'maturity'],
                        tips: [
                            'Use STAR method',
                            'Show maturity in handling conflict',
                            'Focus on resolution, not blame',
                            'Demonstrate communication skills',
                            'Highlight positive outcome'
                        ]
                    }
                ],
                'System Design': [
                    {
                        id: 1,
                        question: 'How would you design a URL shortener like bit.ly?',
                        sampleAnswer: 'I would design it with these components: 1) API layer for URL shortening and redirection. 2) Database to store original URLs and short codes. 3) Key generation service using base62 encoding. 4) Cache (Redis) for frequently accessed URLs. 5) Load balancer for traffic distribution. For scale, I\'d use database sharding, CDN for caching, and async processing. The flow: User submits URL → Generate unique code → Store mapping → Return short URL. On access: Lookup code → Redirect to original URL.',
                        keywords: ['URL shortener', 'system design', 'base62 encoding', 'Redis', 'caching', 'load balancer', 'database sharding', 'scalability', 'API design', 'CDN', 'hashing', 'distributed systems'],
                        tips: [
                            'Start with high-level architecture',
                            'Identify core components',
                            'Discuss scalability considerations',
                            'Mention database design',
                            'Consider caching and performance',
                            'Think about edge cases'
                        ]
                    },
                    {
                        id: 2,
                        question: 'Design a chat application like WhatsApp.',
                        sampleAnswer: 'Key components: 1) Client apps (mobile/web). 2) Message service for sending/receiving. 3) Presence service for online status. 4) Notification service for push notifications. 5) Database for message history and user data. 6) WebSocket connections for real-time communication. For scale: Use message queues, database sharding by user, read replicas, and caching. Consider end-to-end encryption, message delivery guarantees, and handling offline users.',
                        keywords: ['chat application', 'WebSocket', 'real-time communication', 'message queues', 'push notifications', 'presence service', 'encryption', 'scalability', 'database sharding', 'offline support', 'delivery guarantees'],
                        tips: [
                            'Identify main features first',
                            'Design for real-time communication',
                            'Consider scalability from the start',
                            'Think about data consistency',
                            'Mention security considerations',
                            'Discuss trade-offs'
                        ]
                    },
                    {
                        id: 3,
                        question: 'Design a social media feed like Twitter.',
                        sampleAnswer: 'Components: 1) User service for profiles. 2) Tweet service for creating/storing tweets. 3) Timeline service for generating feeds. 4) Follow service for relationships. 5) Cache for hot data. 6) CDN for media. Use fan-out approach: on tweet creation, push to followers\' timelines (write-heavy) or pull on demand (read-heavy). Implement pagination, ranking algorithms, and real-time updates via WebSockets. Scale with sharding, replication, and caching.',
                        keywords: ['social media', 'feed generation', 'fan-out', 'timeline', 'caching', 'CDN', 'pagination', 'ranking algorithm', 'sharding', 'replication', 'read-heavy', 'write-heavy', 'followers'],
                        tips: [
                            'Clarify requirements (read vs write heavy)',
                            'Discuss fan-out strategies',
                            'Consider timeline generation',
                            'Mention caching strategies',
                            'Think about consistency vs availability'
                        ]
                    },
                    {
                        id: 4,
                        question: 'How would you design a rate limiter?',
                        sampleAnswer: 'Approaches: 1) Token bucket: Tokens added at fixed rate, requests consume tokens. 2) Leaky bucket: Requests processed at fixed rate. 3) Fixed window: Count requests per time window. 4) Sliding window: More accurate, tracks requests in rolling window. Implementation: Use Redis for distributed rate limiting, store counters with TTL. Consider per-user, per-IP, or per-API limits. Return 429 status when limit exceeded. Include rate limit headers in responses.',
                        keywords: ['rate limiter', 'token bucket', 'leaky bucket', 'sliding window', 'Redis', 'distributed systems', 'throttling', 'API limits', 'TTL', 'HTTP 429', 'traffic control'],
                        tips: [
                            'Explain different algorithms',
                            'Choose appropriate approach',
                            'Discuss distributed implementation',
                            'Consider edge cases',
                            'Mention monitoring and alerts'
                        ]
                    },
                    {
                        id: 5,
                        question: 'Design a notification system.',
                        sampleAnswer: 'Components: 1) Notification service to receive requests. 2) Queue system (Kafka/RabbitMQ) for async processing. 3) Channel handlers (email, SMS, push). 4) Template service for message formatting. 5) User preference service. 6) Delivery tracking. Flow: Event triggers notification → Queue → Process based on user preferences → Send via appropriate channel → Track delivery. Support batching, priority levels, and retry logic. Scale with multiple workers and partitioned queues.',
                        keywords: ['notification system', 'Kafka', 'RabbitMQ', 'message queue', 'email', 'SMS', 'push notifications', 'async processing', 'templates', 'user preferences', 'retry logic', 'batching', 'delivery tracking'],
                        tips: [
                            'Identify notification types',
                            'Design for multiple channels',
                            'Consider user preferences',
                            'Implement retry mechanisms',
                            'Think about delivery guarantees'
                        ]
                    }
                ],
                'Problem Solving': [
                    {
                        id: 1,
                        question: 'How would you find the missing number in an array of integers from 1 to n?',
                        sampleAnswer: 'There are several approaches: 1) Sum method: Calculate expected sum (n*(n+1)/2), subtract actual sum, difference is missing number. Time: O(n), Space: O(1). 2) XOR method: XOR all numbers 1 to n, XOR with array elements, result is missing number. Time: O(n), Space: O(1). 3) Hash set: Store all numbers in set, iterate 1 to n to find missing. Time: O(n), Space: O(n). I\'d prefer the sum or XOR method for optimal space complexity.',
                        keywords: ['missing number', 'array', 'sum formula', 'XOR', 'hash set', 'time complexity', 'space complexity', 'O(n)', 'optimization', 'mathematical approach'],
                        tips: [
                            'Think out loud',
                            'Consider multiple approaches',
                            'Analyze time and space complexity',
                            'Choose the best solution',
                            'Handle edge cases'
                        ]
                    },
                    {
                        id: 2,
                        question: 'Explain your approach to solving the "Two Sum" problem.',
                        sampleAnswer: 'Given an array and target, find two numbers that add up to target. Approach 1: Brute force - check all pairs. O(n²) time, O(1) space. Approach 2: Hash map - iterate once, for each element check if (target - element) exists in map. If yes, return indices. O(n) time, O(n) space. I\'d use Approach 2 for better time complexity. Edge cases: empty array, no solution, duplicate numbers.',
                        keywords: ['two sum', 'hash map', 'brute force', 'optimization', 'time complexity', 'space complexity', 'array traversal', 'complement', 'edge cases', 'algorithm design'],
                        tips: [
                            'State the problem clearly',
                            'Start with brute force if needed',
                            'Optimize step by step',
                            'Explain the algorithm clearly',
                            'Discuss complexity',
                            'Mention edge cases'
                        ]
                    },
                    {
                        id: 3,
                        question: 'How would you reverse a linked list?',
                        sampleAnswer: 'Iterative approach: Use three pointers (prev, current, next). Initialize prev=null, current=head. While current exists: save next node, reverse current\'s pointer to prev, move prev and current forward. Return prev as new head. Time: O(n), Space: O(1). Recursive approach: Base case - if head is null or single node, return head. Recursively reverse rest, then adjust pointers. Time: O(n), Space: O(n) for call stack.',
                        keywords: ['linked list', 'reverse', 'pointers', 'iterative', 'recursive', 'data structures', 'in-place', 'time complexity', 'space complexity', 'call stack'],
                        tips: [
                            'Explain both iterative and recursive',
                            'Draw diagrams if helpful',
                            'Walk through with example',
                            'Discuss complexity trade-offs',
                            'Handle edge cases (empty, single node)'
                        ]
                    },
                    {
                        id: 4,
                        question: 'How would you detect a cycle in a linked list?',
                        sampleAnswer: 'Floyd\'s Cycle Detection (Tortoise and Hare): Use two pointers, slow (moves 1 step) and fast (moves 2 steps). If they meet, cycle exists. If fast reaches null, no cycle. Time: O(n), Space: O(1). Alternative: Use hash set to track visited nodes. Time: O(n), Space: O(n). Floyd\'s algorithm is preferred for O(1) space. To find cycle start: reset one pointer to head, move both one step until they meet.',
                        keywords: ['cycle detection', 'Floyd algorithm', 'tortoise and hare', 'two pointers', 'linked list', 'hash set', 'space optimization', 'fast and slow pointers', 'cycle start'],
                        tips: [
                            'Explain Floyd\'s algorithm clearly',
                            'Walk through with example',
                            'Compare with hash set approach',
                            'Discuss finding cycle start',
                            'Mention complexity benefits'
                        ]
                    },
                    {
                        id: 5,
                        question: 'Find the maximum subarray sum (Kadane\'s Algorithm).',
                        sampleAnswer: 'Kadane\'s Algorithm: Track current sum and max sum. Iterate through array: add element to current sum, update max if current > max, reset current to 0 if negative. Time: O(n), Space: O(1). Logic: At each position, decide whether to extend existing subarray or start new one. If current sum becomes negative, starting fresh is better. Works for arrays with at least one positive number.',
                        keywords: ['Kadane algorithm', 'maximum subarray', 'dynamic programming', 'greedy approach', 'optimization', 'O(n)', 'contiguous subarray', 'running sum', 'algorithm design'],
                        tips: [
                            'Explain the intuition',
                            'Walk through example',
                            'Discuss why it works',
                            'Mention edge cases',
                            'Compare with brute force O(n²)'
                        ]
                    }
                ]
            };
            this.saveInterviewQuestions(sampleInterviewQuestions);
        }
    }
};

