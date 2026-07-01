// Companies and Interview Rounds Management

const Companies = {
    init() {
        this.renderCompanies();
    },

    renderCompanies() {
        const companies = Storage.getCompanies();
        const container = document.getElementById('companiesContent');

        if (companies.length === 0) {
            container.innerHTML = '<p>No companies available. Sample data will be loaded on first visit.</p>';
            return;
        }

        container.innerHTML = companies.map(company => `
            <div class="company-card">
                <div class="company-header">
                    <div>
                        <h3 class="company-name">${company.name}</h3>
                        <p class="company-role">${company.role}</p>
                        <span class="company-criteria">${company.criteria}</span>
                    </div>
                    <button class="rounds-toggle" onclick="Companies.toggleRounds(${company.id}, event)">
                        View Rounds
                    </button>
                </div>
                <div class="rounds-container" id="rounds-${company.id}">
                    ${this.renderRounds(company.rounds, company.id)}
                </div>
            </div>
        `).join('');
    },

    renderRounds(rounds, companyId) {
        if (!rounds || rounds.length === 0) {
            return '<p>No interview rounds available for this company.</p>';
        }

        return rounds.map(round => `
            <div class="round-item">
                <h4 class="round-name">${round.name}</h4>
                <p class="round-description">${round.description}</p>
                <div class="round-preparation">
                    <strong>Preparation Points:</strong>
                    <ul>
                        ${round.preparation.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                <div class="round-checkbox">
                    <label>
                        <input type="checkbox" 
                               ${round.prepared ? 'checked' : ''} 
                               onchange="Companies.toggleRoundPrepared(${companyId}, ${round.id})">
                        Mark as prepared
                    </label>
                </div>
            </div>
        `).join('');
    },

    toggleRounds(companyId, event) {
        const roundsContainer = document.getElementById(`rounds-${companyId}`);
        if (!roundsContainer) return;
        
        roundsContainer.classList.toggle('show');
        
        const button = event ? event.target : document.querySelector(`button[onclick*="toggleRounds(${companyId}"]`);
        if (button) {
            if (roundsContainer.classList.contains('show')) {
                button.textContent = 'Hide Rounds';
            } else {
                button.textContent = 'View Rounds';
            }
        }
    },

    toggleRoundPrepared(companyId, roundId) {
        const companies = Storage.getCompanies();
        const company = companies.find(c => c.id === companyId);
        
        if (company) {
            const round = company.rounds.find(r => r.id === roundId);
            if (round) {
                round.prepared = !round.prepared;
                Storage.saveCompanies(companies);
                Dashboard.update();
            }
        }
    },

    getPreparedRoundsCount() {
        const companies = Storage.getCompanies();
        let count = 0;
        companies.forEach(company => {
            if (company.rounds) {
                count += company.rounds.filter(round => round.prepared).length;
            }
        });
        return count;
    },

    getExploredCompaniesCount() {
        const companies = Storage.getCompanies();
        return companies.filter(company => 
            company.rounds && company.rounds.some(round => round.prepared)
        ).length;
    }
};

