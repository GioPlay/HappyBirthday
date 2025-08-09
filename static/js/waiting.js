function updateCountdown() {
    const targetDate = new Date('2025-08-10T00:00:00+04:00');
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('countdown').textContent = 'ვებგვერდი ხელმისაწვდომია!';
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();