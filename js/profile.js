// User Profile Management

const Profile = {
    init() {
        this.loadProfile();
        this.setupForm();
    },

    loadProfile() {
        const profile = Storage.getProfile();
        if (profile) {
            const nameEl = document.getElementById('profileName');
            const branchEl = document.getElementById('profileBranch');
            const yearEl = document.getElementById('profileYear');
            const companiesEl = document.getElementById('profileTargetCompanies');
            
            if (nameEl) nameEl.value = profile.name || '';
            if (branchEl) branchEl.value = profile.branch || '';
            if (yearEl) yearEl.value = profile.year || '';
            if (companiesEl) companiesEl.value = profile.targetCompanies || '';
        }
    },

    setupForm() {
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
    },

    saveProfile() {
        const nameEl = document.getElementById('profileName');
        const branchEl = document.getElementById('profileBranch');
        const yearEl = document.getElementById('profileYear');
        const companiesEl = document.getElementById('profileTargetCompanies');
        
        if (!nameEl || !branchEl || !yearEl || !companiesEl) return;
        
        const profile = {
            name: nameEl.value.trim(),
            branch: branchEl.value.trim(),
            year: yearEl.value,
            targetCompanies: companiesEl.value.trim()
        };

        Storage.saveProfile(profile);
        showSuccessMessage('profileSaved', 'Profile saved successfully!');
        
        // Update dashboard after profile save
        Dashboard.update();
    },

    getProfile() {
        return Storage.getProfile();
    }
};



