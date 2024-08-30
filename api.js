export async function initializeScores() {
    const response = await fetch('https://randomuser.me/api/?results=10&nat=fr');
    const data = await response.json();
    const initialScores = data.results.map(user => ({
        name: user.name.first,
        score: Math.floor(Math.random() * 100 + 1)
    }));
    return initialScores;
}